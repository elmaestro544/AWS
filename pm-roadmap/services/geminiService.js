
import { GoogleGenAI } from "@google/genai";

// --- API Key and Client Management ---

const geminiApiKey = window.process?.env?.API_KEY;

const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

export const isModelConfigured = (modelId) => {
    if (modelId.startsWith('gemini')) {
        return isGeminiConfigured();
    }
    return false; // Other models removed
};

export const isAnyModelConfigured = () => {
    return isGeminiConfigured();
};

const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

const textModel = 'gemini-2.5-flash';

// Legacy export for backward compatibility
export const isApiKeyConfigured = isAnyModelConfigured();

// --- Helper Functions ---

const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

// --- Chat Management ---

export const createChatSession = () => {
    if (geminiClient) {
        return geminiClient.chats.create({ 
            model: textModel,
            config: {
                systemInstruction: "You are an expert AI assistant for project and construction management. Provide concise, actionable advice, data analysis, and generate project artifacts like WBS, schedules, and risk assessments based on user requests.",
            }
        });
    }
    return null;
};

export const sendChatMessage = async (chatSession, message, file, useWebSearch) => {
    if (!geminiClient) throw new Error("Gemini client not initialized.");
    
    const messageParts = [{ text: message }];
    if (file) {
        messageParts.unshift(await fileToGenerativePart(file));
    }

    if (useWebSearch) {
        const result = await geminiClient.models.generateContent({
            model: textModel,
            contents: { parts: messageParts },
            config: { 
                tools: [{ googleSearch: {} }],
                systemInstruction: "You are an expert AI assistant for project and construction management. Provide concise, actionable advice, data analysis, and generate project artifacts like WBS, schedules, and risk assessments based on user requests. When web search is enabled, use it to find the most current information, standards, and best practices relevant to the user's query.",
            },
        });
        return { text: result.text, sources: result.candidates?.[0]?.groundingMetadata?.groundingChunks || [], isStream: false };
    } else {
        const stream = await chatSession.sendMessageStream({ content: { parts: messageParts } });
        return { stream, isStream: true };
    }
};
