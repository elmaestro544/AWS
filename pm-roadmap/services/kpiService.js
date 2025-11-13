// services/kpiService.js

import { GoogleGenAI, Type } from "@google/genai";

// --- API Key and Client Management ---
const geminiApiKey = window.process?.env?.API_KEY;
const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const kpiModel = 'gemini-2.5-flash';

// --- Local Calculation Functions ---

const getDaysDiff = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(12, 0, 0, 0);
    d2.setHours(12, 0, 0, 0);
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
};

export const calculateKpis = (scheduleData, budgetData) => {
    if (!scheduleData || scheduleData.length === 0 || !budgetData?.budgetItems) {
        return {
            overallProgress: 0,
            scheduleVariance: 0,
            costVariance: 0,
            budgetAtCompletion: 0,
            plannedDuration: 0
        };
    }

    // Budget Calculations
    const totalBudget = budgetData.budgetItems.reduce((sum, item) => {
        const itemCost = item.laborCost + item.materialsCost;
        const contingency = itemCost * (item.contingencyPercent / 100);
        return sum + itemCost + contingency;
    }, 0);

    // Schedule Calculations
    const dates = scheduleData.flatMap(t => [new Date(t.start), new Date(t.end)]);
    const projectStart = new Date(Math.min(...dates));
    const projectEnd = new Date(Math.max(...dates));
    const plannedDuration = getDaysDiff(projectStart, projectEnd);
    const daysElapsed = getDaysDiff(projectStart, new Date());
    const percentDurationElapsed = Math.max(0, Math.min(100, (daysElapsed / plannedDuration) * 100));

    // Progress Calculations
    const overallProgress = scheduleData.reduce((acc, task) => acc + task.progress, 0) / scheduleData.length;

    // EVM Calculations (Simplified)
    const plannedValue = totalBudget * (percentDurationElapsed / 100); // PV
    const earnedValue = totalBudget * (overallProgress / 100); // EV
    
    // Simulate Actual Cost (AC) for demonstration. In a real scenario, this would come from actuals.
    // Let's assume a slight cost overrun for a more interesting example.
    const actualCost = earnedValue * 1.08; // AC (Simulated 8% cost overrun)

    const scheduleVariance = earnedValue - plannedValue; // SV
    const costVariance = earnedValue - actualCost; // CV
    
    // SPI and CPI
    const schedulePerformanceIndex = plannedValue > 0 ? (earnedValue / plannedValue) : 1;
    const costPerformanceIndex = actualCost > 0 ? (earnedValue / actualCost) : 1;

    return {
        overallProgress: parseFloat(overallProgress.toFixed(1)),
        scheduleVariance: parseFloat(scheduleVariance.toFixed(2)),
        costVariance: parseFloat(costVariance.toFixed(2)),
        spi: parseFloat(schedulePerformanceIndex.toFixed(2)),
        cpi: parseFloat(costPerformanceIndex.toFixed(2)),
        budgetAtCompletion: parseFloat(totalBudget.toFixed(2)),
        plannedDuration: plannedDuration
    };
};

// --- AI Analysis Function ---

const kpiAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A brief, one-paragraph summary of the project's current health based on the KPIs."
        },
        recommendation: {
            type: Type.STRING,
            description: "A single, actionable recommendation for the project manager to address the key findings from the KPIs."
        }
    },
    required: ['summary', 'recommendation']
};

export const getKpiAnalysis = async (kpis) => {
    if (!geminiClient) {
        throw new Error("Gemini client is not initialized.");
    }

    const kpiString = `
      - Overall Progress: ${kpis.overallProgress}%
      - Schedule Variance (SV): ${kpis.scheduleVariance.toLocaleString()}
      - Cost Variance (CV): ${kpis.costVariance.toLocaleString()}
      - Schedule Performance Index (SPI): ${kpis.spi}
      - Cost Performance Index (CPI): ${kpis.cpi}
    `;

    const prompt = `
        As an expert AI Project Management Analyst, analyze the following Key Performance Indicators (KPIs) for a project.

        KPIs:
        ${kpiString}

        Instructions:
        1. Write a concise summary (2-3 sentences) interpreting these KPIs to describe the project's health. An SPI or CPI less than 1.0 indicates underperformance, while a value greater than 1.0 indicates overperformance. A negative variance is unfavorable.
        2. Provide one single, highly actionable recommendation for the project manager based on your analysis.
        3. The output must be a valid JSON object strictly adhering to the provided schema.
    `;

    try {
        const result = await geminiClient.models.generateContent({
            model: kpiModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: kpiAnalysisSchema,
                systemInstruction: "You are an AI assistant that analyzes project KPIs and provides a concise summary and a single actionable recommendation in a structured JSON format.",
            },
        });

        const jsonText = result.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating KPI analysis:", error);
        throw new Error("Failed to generate AI analysis for the KPIs.");
    }
};


/**
 * Orchestrator function to generate all data needed for the KPI view.
 * @param {object} scheduleData - The generated project schedule.
 * @param {object} budgetData - The generated project budget.
 * @returns {Promise<object>} An object containing calculated KPIs and AI analysis.
 */
export const generateKpiReport = async (scheduleData, budgetData) => {
    try {
        const kpis = calculateKpis(scheduleData, budgetData);
        const analysis = await getKpiAnalysis(kpis);
        return { kpis, analysis };
    } catch (error) {
        console.error("Error in KPI data generation process:", error);
        throw error; // Re-throw to be caught by the UI
    }
};
