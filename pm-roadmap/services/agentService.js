// services/agentService.js

import { GoogleGenAI, Type } from "@google/genai";

// --- API Key and Client Management ---
const geminiApiKey = window.process?.env?.API_KEY;
const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const agentModel = 'gemini-2.5-flash';

// --- JSON Schema Definition for Vendor Offers ---
const vendorOfferSchema = {
    type: Type.OBJECT,
    properties: {
        offers: {
            type: Type.ARRAY,
            description: "A list of vendor offers based on the user's procurement request.",
            items: {
                type: Type.OBJECT,
                properties: {
                    partner: { type: Type.STRING, description: "The name of the vendor or partner." },
                    description: { type: Type.STRING, description: "A brief one-line description of the offer or vendor specialty." },
                    value: { type: Type.NUMBER, description: "The total cost or value of the offer in the most appropriate currency (e.g., USD)." },
                    deliveryTime: { type: Type.STRING, description: "The estimated delivery time, e.g., '6 BD' for 6 business days or '2 Weeks'." },
                    location: { type: Type.STRING, description: "The location of the vendor, e.g., 'Los Angeles, CA'." },
                    status: { type: Type.STRING, description: "The relationship status with the partner.", enum: ['External', 'Internal'] }
                },
                required: ['partner', 'description', 'value', 'deliveryTime', 'location', 'status']
            }
        }
    },
    required: ['offers']
};


/**
 * Generates a list of vendor offers based on a procurement request.
 * @param {string} request - The user's description of what they need to procure.
 * @returns {Promise<object>} A structured object containing a list of vendor offers.
 */
export const generateVendorOffers = async (request) => {
    if (!geminiClient) {
        throw new Error("Gemini client is not initialized. Please check your API key.");
    }

    const prompt = `
        As an expert AI Procurement Agent, your task is to find the best vendor offers for the following request.

        Procurement Request: "${request}"

        Instructions:
        1.  Analyze the request and generate a list of 3 to 5 realistic, distinct vendor offers.
        2.  For each offer, provide a plausible partner name, a brief description, a competitive value (price), an estimated delivery time, a location, and a status ('Internal' or 'External').
        3.  Ensure the offers are diverse and representative of a real-world procurement scenario.
        4.  The entire output must be a single, valid JSON object that strictly adheres to the provided schema. Do not include any explanatory text outside the JSON structure.
    `;

    try {
        const result = await geminiClient.models.generateContent({
            model: agentModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: vendorOfferSchema,
                systemInstruction: "You are an expert AI Procurement Agent. Your function is to analyze user procurement requests and generate a structured list of suitable vendor offers in a valid JSON format according to the provided schema.",
            },
        });
        
        const jsonText = result.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating vendor offers:", error);
        throw new Error("Failed to generate vendor offers. The AI model may be temporarily unavailable or the request could not be processed.");
    }
};
