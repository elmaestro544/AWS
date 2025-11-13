

import { GoogleGenAI, Modality } from "@google/genai";

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
        const stream = await chatSession.sendMessageStream({ message: { parts: messageParts } });
        return { stream, isStream: true };
    }
};


// --- Live API Helper Functions (for Voice Chat) ---

function encode(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(data, ctx, sampleRate, numChannels) {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createPcmBlob(data) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Live API Session Management ---
export const startVoiceSession = (callbacks) => {
    if (!geminiClient) throw new Error("Gemini client not initialized.");

    const sessionPromise = geminiClient.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: "You are an expert AI assistant for project and construction management. Provide concise, actionable advice, data analysis, and generate project artifacts like WBS, schedules, and risk assessments based on user requests. Keep your spoken responses brief and to the point.",
        },
    });

    return sessionPromise;
};