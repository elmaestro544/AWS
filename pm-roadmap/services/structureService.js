// services/structureService.js

import { GoogleGenAI, Type } from "@google/genai";

// --- API Key and Client Management ---
const geminiApiKey = window.process?.env?.API_KEY;
const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const structureModel = 'gemini-2.5-flash';

// --- JSON Schema Definition for Project Structure ---
// Defines a 3-level deep structure to avoid recursive refs which are not supported.
const level3Node = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Name of the third-level node." },
        type: { type: Type.STRING, description: "Type of the third-level node (e.g., 'Component')." }
    },
    required: ['name', 'type']
};

const level2Node = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Name of the second-level node." },
        type: { type: Type.STRING, description: "Type of the second-level node (e.g., 'Feature')." },
        children: {
            type: Type.ARRAY,
            description: "Nested array of third-level child nodes.",
            items: level3Node
        }
    },
    required: ['name', 'type']
};

const level1Node = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Name of the first-level child node." },
        type: { type: Type.STRING, description: "Type of the first-level child node (e.g., 'Module')." },
        children: {
            type: Type.ARRAY,
            description: "Nested array of second-level child nodes.",
            items: level2Node
        }
    },
    required: ['name', 'type']
};

const structureSchema = {
    type: Type.OBJECT,
    properties: {
        projectName: {
            type: Type.STRING,
            description: "A concise name for the project derived from the objective."
        },
        root: {
            type: Type.OBJECT,
            description: "The root node of the project structure.",
            properties: {
                name: { type: Type.STRING, description: "Name of the root element, usually the project itself." },
                type: { type: Type.STRING, description: "The type of node, e.g., 'Project', 'Phase'." },
                children: {
                    type: Type.ARRAY,
                    description: "An array of child nodes representing the next level of the hierarchy.",
                    items: level1Node
                }
            },
            required: ['name', 'type']
        }
    },
    required: ['projectName', 'root']
};


/**
 * Generates a hierarchical project structure from a project objective.
 * @param {string} objective - The user's high-level project goal.
 * @returns {Promise<object>} A structured object representing the project's skeleton.
 */
export const generateProjectStructure = async (objective) => {
    if (!geminiClient) {
        throw new Error("Gemini client is not initialized. Please check your API key.");
    }

    const prompt = `
        As an expert AI Systems Architect, analyze the following project objective and design a hierarchical "skeleton" or blueprint of its core components.

        Project Objective: "${objective}"

        Your tasks:
        1.  Create a logical, top-down breakdown of the project into its main phases, modules, features, or components.
        2.  Represent this breakdown as a nested tree structure, starting from a single root node.
        3.  Assign a relevant 'type' to each node (e.g., 'Project', 'Phase', 'Module', 'Feature', 'Component').
        4.  The hierarchy should be at least 3 levels deep to provide a meaningful skeleton.
        5.  The entire output must be a single, valid JSON object that strictly adheres to the provided schema.
    `;

    try {
        const result = await geminiClient.models.generateContent({
            model: structureModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: structureSchema,
                systemInstruction: "You are an expert AI Systems Architect. Your function is to decompose a project objective into a hierarchical tree structure, representing its core components and their relationships. You must output this structure as a valid JSON object that strictly follows the given schema.",
            },
        });
        
        const jsonText = result.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating project structure:", error);
        throw new Error("Failed to generate the project structure. The AI model may be temporarily unavailable or the request could not be processed.");
    }
};