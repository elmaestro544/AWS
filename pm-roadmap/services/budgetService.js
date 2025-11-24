
// services/budgetService.js

import { GoogleGenAI, Type } from "@google/genai";

// --- API Key and Client Management ---
const geminiApiKey = window.process?.env?.API_KEY;
const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const budgetModel = 'gemini-2.5-flash';

// --- JSON Schema Definition for Budget Estimation ---
const budgetEstimationSchema = {
    type: Type.OBJECT,
    properties: {
        budgetItems: {
            type: Type.ARRAY,
            description: "A detailed list of budget items, including labor, materials, and other expenses.",
            items: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        description: "The primary category of the cost item (e.g., 'Designer', 'Software Engineer', 'Marketing Specialist')."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A brief description of the team or resource associated with this cost item."
                    },
                    laborHours: {
                        type: Type.NUMBER, // Changed from INTEGER
                        description: "Estimated total labor hours for this item. Should be 0 if this is a material or non-labor expense."
                    },
                    laborCost: {
                        type: Type.NUMBER,
                        description: "Estimated total labor cost for this item. Should be 0 if this is a material or non-labor expense."
                    },
                    materialsCost: {
                        type: Type.NUMBER,
                        description: "Estimated cost of materials or non-labor expenses for this item. Should be 0 if this is purely a labor cost."
                    },
                    contingencyPercent: {
                        type: Type.NUMBER, // Changed from INTEGER
                        description: "A suggested contingency percentage (0-100) for this specific item to account for unforeseen issues."
                    }
                },
                required: ['category', 'description', 'laborHours', 'laborCost', 'materialsCost', 'contingencyPercent']
            }
        }
    },
    required: ['budgetItems']
};


/**
 * Generates a project budget based on user-provided details.
 * @param {object} projectDetails - An object containing objectives, scope, currency, etc.
 * @returns {Promise<object>} A structured budget object with a list of cost items.
 */
export const generateProjectBudget = async (projectDetails) => {
    if (!geminiClient) {
        throw new Error("Gemini client is not initialized. Please check your API key.");
    }

    const { objectives, currency, budgetCap, contingency, scope } = projectDetails;

    const prompt = `
        As an expert AI Financial Analyst specializing in project management, create a detailed budget breakdown for the following project.

        Project Details:
        - Objectives: "${objectives}"
        - Scope Summary: "${scope}"
        - Target Currency: ${currency || 'USD'}
        - Budget Cap (Optional): ${budgetCap || 'Not specified'}
        - Overall Contingency Guideline: ${contingency || '10'}%

        Instructions:
        1.  Analyze the project objectives and scope to identify all necessary roles, resources, and potential expenses.
        2.  Generate a list of 5 to 8 distinct budget items.
        3.  For each item, provide realistic estimates for labor hours, labor costs, and materials/non-labor costs in the specified currency. If an item is purely labor, materials cost should be 0, and vice-versa.
        4.  Assign a specific contingency percentage to each item, reflecting its potential for cost variance.
        5.  The entire output must be a single, valid JSON object that strictly adheres to the provided schema. Do not include any explanatory text outside of the JSON structure.
    `;

    try {
        const result = await geminiClient.models.generateContent({
            model: budgetModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: budgetEstimationSchema,
                systemInstruction: "You are an expert AI Financial Analyst for project management. Your role is to generate a detailed, itemized project budget based on user-provided details. You must output the budget as a valid JSON object that strictly follows the given schema.",
            },
        });
        
        const jsonText = result.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating project budget:", error);
        throw new Error(`Failed to generate the project budget: ${error.message}`);
    }
};
