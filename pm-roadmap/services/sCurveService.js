// services/sCurveService.js

import { GoogleGenAI, Type } from "@google/genai";

// --- API Key and Client Management ---
const geminiApiKey = window.process?.env?.API_KEY;
const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const sCurveModel = 'gemini-2.5-flash';

// --- Helper Functions ---
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const getDaysDiff = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(12, 0, 0, 0);
    d2.setHours(12, 0, 0, 0);
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
};

// --- Data Calculation ---
export const calculateSCurveData = (scheduleData) => {
    if (!scheduleData || scheduleData.length === 0) return { points: [], totalDays: 0 };

    const tasks = scheduleData.filter(t => t.type === 'task'); // Only use tasks for curve
    if (tasks.length === 0) return { points: [], totalDays: 0 };

    const dates = scheduleData.flatMap(t => [new Date(t.start), new Date(t.end)]);
    const projectStart = new Date(Math.min(...dates));
    const projectEnd = new Date(Math.max(...dates));
    const totalDays = getDaysDiff(projectStart, projectEnd) + 1;

    const points = [];
    let plannedCumulative = 0;
    let actualCumulative = 0;

    for (let i = 0; i < totalDays; i++) {
        const currentDate = addDays(projectStart, i);
        
        // Calculate Planned Value
        const plannedTasksToday = tasks.filter(task => new Date(task.end) <= currentDate).length;
        plannedCumulative = (plannedTasksToday / tasks.length) * 100;
        
        // Calculate Actual Value using progress
        let earnedValue = 0;
        tasks.forEach(task => {
            const taskDuration = getDaysDiff(task.start, task.end) + 1;
            const daysIntoTask = getDaysDiff(task.start, currentDate) + 1;
            if (daysIntoTask > 0) {
                 const percentComplete = task.progress / 100;
                 earnedValue += percentComplete;
            }
        });
        actualCumulative = (earnedValue / tasks.length) * 100;
        
        points.push({
            day: i + 1,
            date: currentDate.toISOString().split('T')[0],
            planned: parseFloat(plannedCumulative.toFixed(2)),
            actual: parseFloat(actualCumulative.toFixed(2))
        });
    }

    return { points, totalDays };
};

// --- AI Analysis ---
const sCurveAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: {
            type: Type.STRING,
            description: "A one-paragraph analysis of the S-Curve, explaining the primary variance between planned and actual progress."
        },
        outlook: {
            type: Type.STRING,
            description: "A brief, one-sentence outlook on the project's trajectory based on the current S-Curve."
        }
    },
    required: ['analysis', 'outlook']
};

export const getSCurveAnalysis = async (sCurveData) => {
    if (!geminiClient) {
        throw new Error("Gemini client is not initialized.");
    }
    
    // Provide a subset of data points to the AI for analysis
    const dataSample = sCurveData.points.filter((_, i) => i % Math.ceil(sCurveData.points.length / 10) === 0);

    const prompt = `
        As an expert AI Project Analyst, analyze the following S-Curve data which represents cumulative project task completion over time.

        S-Curve Data Sample (Day, Planned %, Actual %):
        ${dataSample.map(p => `Day ${p.day}, Planned ${p.planned}%, Actual ${p.actual}%`).join('\n')}

        Instructions:
        1. Compare the 'planned' vs 'actual' progress. Identify if the project is ahead of schedule, behind schedule, or on track.
        2. Write a concise analysis (2-4 sentences) explaining the key variance. For example, mention if the project started slow but is now catching up, or if it's consistently behind.
        3. Provide a brief, one-sentence outlook on the project's future trajectory if the current trend continues.
        4. The output must be a valid JSON object strictly adhering to the provided schema.
    `;

    try {
        const result = await geminiClient.models.generateContent({
            model: sCurveModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: sCurveAnalysisSchema,
                systemInstruction: "You are an AI assistant that analyzes S-Curve data and provides a brief analysis and outlook in a structured JSON format.",
            },
        });

        const jsonText = result.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating S-Curve analysis:", error);
        throw new Error("Failed to generate AI analysis for the S-Curve.");
    }
};

/**
 * Orchestrator function to generate all data for the S-Curve view.
 * @param {object} scheduleData The pre-generated project schedule data.
 * @returns {Promise<object>} An object containing the S-Curve data points and the AI analysis.
 */
export const generateSCurveReport = async (scheduleData) => {
    try {
        const sCurveData = calculateSCurveData(scheduleData);
        const analysis = await getSCurveAnalysis(sCurveData);
        return { sCurveData, analysis };
    } catch (error) {
        console.error("Error in S-Curve data generation process:", error);
        throw error;
    }
};
