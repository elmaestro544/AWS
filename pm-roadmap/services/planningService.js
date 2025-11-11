
import { GoogleGenAI, Type } from "@google/genai";

// --- API Key and Client Management ---

// Re-using the same API key logic from geminiService.js
const geminiApiKey = window.process?.env?.API_KEY;
const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// The model that supports JSON schema responses well
const planningModel = 'gemini-2.5-flash';

// --- JSON Schema Definition for the Project Plan ---

const projectPlanSchema = {
    type: Type.OBJECT,
    properties: {
        workBreakdownStructure: {
            type: Type.ARRAY,
            description: "A detailed list of tasks and subtasks for the project's Work Breakdown Structure (WBS).",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The concise name of the main task or phase (e.g., 'Phase 1: Research & Discovery')."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A detailed description of the task, including its purpose, scope, and key activities."
                    },
                    durationInDays: {
                        type: Type.INTEGER,
                        description: "The estimated number of days to complete this entire task, as an integer."
                    },
                    assigneeCount: {
                        type: Type.INTEGER,
                        description: "The suggested number of people to be assigned to this task, as an integer."
                    },
                    subtasks: {
                        type: Type.ARRAY,
                        description: "A list of smaller, actionable subtasks required to complete the main task. Can be empty if not applicable.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: {
                                    type: Type.STRING,
                                    description: "The specific, actionable name of the subtask (e.g., 'Conduct competitor analysis')."
                                },
                                durationInDays: {
                                    type: Type.INTEGER,
                                    description: "The estimated number of days for this specific subtask, as an integer."
                                }
                            },
                            required: ['name', 'durationInDays']
                        }
                    }
                },
                required: ['name', 'description', 'durationInDays', 'assigneeCount', 'subtasks']
            }
        },
        keyMilestones: {
            type: Type.ARRAY,
            description: "A list of significant milestones that mark major project achievements or decision points.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The name of the milestone (e.g., 'Project Kick-off Complete')."
                    },
                    acceptanceCriteria: {
                        type: Type.STRING,
                        description: "The specific, measurable criteria that must be met for the milestone to be considered complete."
                    },
                    durationInDays: {
                        type: Type.INTEGER,
                        description: "The estimated duration in days associated with achieving this milestone, as an integer."
                    },
                     assigneeCount: {
                        type: Type.INTEGER,
                        description: "The suggested number of people whose work contributes to this milestone, as an integer."
                    }
                },
                required: ['name', 'acceptanceCriteria', 'durationInDays', 'assigneeCount']
            }
        }
    },
    required: ['workBreakdownStructure', 'keyMilestones']
};


// --- Service Function ---

/**
 * Generates a project plan based on a user's objective.
 * @param {string} objective - The user's high-level project goal.
 * @returns {Promise<object>} A structured project plan with WBS and milestones.
 */
export const generateProjectPlan = async (objective) => {
    if (!geminiClient) {
        throw new Error("Gemini client is not initialized. Please check your API key.");
    }

    const prompt = `Based on the following project objective, create a comprehensive project plan.
    
    Objective: "${objective}"
    
    Generate a detailed Work Breakdown Structure (WBS) with logical phases and actionable tasks/subtasks. Also, define a set of key milestones with clear acceptance criteria. Ensure the durations and assignee counts are realistic estimates. The entire output must be a single, valid JSON object that strictly adheres to the provided schema.`;

    try {
        const result = await geminiClient.models.generateContent({
            model: planningModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: projectPlanSchema,
                systemInstruction: "You are an expert AI Project Manager. Your task is to take a high-level project objective and break it down into a comprehensive Work Breakdown Structure (WBS) and a set of Key Milestones. You must generate the output in a valid JSON format that strictly adheres to the provided schema. Your plans should be realistic, actionable, and tailored to the user's objective.",
            },
        });
        
        const jsonText = result.text.trim();
        // The API should return valid JSON, but a try-catch is good practice
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating project plan:", error);
        throw new Error("Failed to generate the project plan. The AI model may be temporarily unavailable or the request could not be processed.");
    }
};
