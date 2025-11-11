// services/riskService.js

import { GoogleGenAI, Type } from "@google/genai";

// --- API Key and Client Management ---
const geminiApiKey = window.process?.env?.API_KEY;
const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const riskModel = 'gemini-2.5-flash';

// --- JSON Schema Definition for Risk Analysis ---
const riskAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        risks: {
            type: Type.ARRAY,
            description: "An array of potential project risks identified from the project data.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "A unique identifier for the risk (e.g., 'RISK-001')." },
                    title: { type: Type.STRING, description: "A concise, one-line title for the risk." },
                    description: { type: Type.STRING, description: "A detailed explanation of the risk, its potential causes, and its impact on the project." },
                    projectName: { type: Type.STRING, description: "The name of the project this risk is associated with." },
                    date: { type: Type.STRING, description: "The date the risk was identified, in 'YYYY-MM-DD' format." },
                    severity: {
                        type: Type.STRING,
                        description: "The severity of the risk's impact.",
                        enum: ['High', 'Medium', 'Low']
                    },
                    likelihood: {
                        type: Type.STRING,
                        description: "The likelihood of the risk occurring.",
                        enum: ['Certain', 'Likely', 'Possible', 'Unlikely', 'Rare']
                    },
                    impact: {
                        type: Type.STRING,
                        description: "The impact level on the project if the risk materializes.",
                        enum: ['Critical', 'Major', 'Moderate', 'Minor']
                    },
                    mitigationStrategies: {
                        type: Type.ARRAY,
                        description: "A list of actionable strategies to mitigate this risk.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "A title for the mitigation strategy." },
                                description: { type: Type.STRING, description: "A detailed description of the steps to take for this mitigation strategy." }
                            },
                             required: ['name', 'description']
                        }
                    }
                },
                required: ['id', 'title', 'description', 'projectName', 'date', 'severity', 'likelihood', 'impact', 'mitigationStrategies']
            }
        }
    },
    required: ['risks']
};

/**
 * Generates a risk analysis based on a user's project objective.
 * @param {string} objective - The user's high-level project goal.
 * @returns {Promise<object>} A structured risk analysis object.
 */
export const analyzeProjectRisks = async (objective) => {
    if (!geminiClient) {
        throw new Error("Gemini client is not initialized. Please check your API key.");
    }

    const prompt = `
        As an expert AI Risk Manager for a top-tier project management firm, analyze the following project objective and generate a comprehensive risk intelligence report.

        Project Objective: "${objective}"

        Your tasks:
        1. Identify between 5 to 8 potential risks associated with this project.
        2. For each risk, provide a detailed description, and classify its 'severity', 'likelihood', and 'impact' based on the provided schema enums.
        3. For each risk, devise 1-2 distinct and actionable mitigation strategies.
        4. Assign a plausible project name and a recent date for each risk.
        5. The entire output must be a single, valid JSON object that strictly adheres to the provided schema.
    `;

    try {
        const result = await geminiClient.models.generateContent({
            model: riskModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: riskAnalysisSchema,
                systemInstruction: "You are an expert AI Risk Management analyst. Your function is to identify, classify, and suggest mitigation strategies for project risks based on user input, and structure this analysis into a valid JSON format according to the provided schema.",
            },
        });
        
        const jsonText = result.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating risk analysis:", error);
        throw new Error("Failed to generate the risk analysis. The AI model may be temporarily unavailable or the request could not be processed.");
    }
};
