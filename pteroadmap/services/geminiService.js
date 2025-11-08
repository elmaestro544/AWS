import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function isModelConfigured(modelName) {
    // A simple check if the API key has been replaced.
    return process.env.API_KEY && process.env.API_KEY !== 'YOUR_API_KEY_HERE';
}

export function createChatSession() {
    try {
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: 'You are a helpful and friendly AI assistant for PTE (Pearson Test of English) practice.',
          },
        });
        return chat;
    } catch (error) {
        console.error("Error creating chat session:", error);
        throw new Error("Could not create chat session.");
    }
}

async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

export async function sendChatMessage(chat, message, file, useWebSearch) {
    try {
        const parts = [ { text: message } ];
        if (file) {
            const imagePart = await fileToGenerativePart(file);
            parts.push(imagePart);
        }

        if (useWebSearch) {
             // If there's a file, use the multipart object structure.
             // Otherwise, use a simple string for text-only queries.
             const contents = file ? { parts: parts } : message;
             const response = await ai.models.generateContent({
               model: "gemini-2.5-flash",
               contents: contents,
               config: {
                 tools: [{googleSearch: {}}],
               },
            });
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            return { isStream: false, text: response.text, sources: sources };
        } else {
             // For chat, `sendMessageStream` expects an object with a `message` key.
             const result = await chat.sendMessageStream({ message: parts });
             return { isStream: true, stream: result, sources: [] };
        }
    } catch (error) {
        console.error("Error sending chat message:", error);
        throw new Error("Failed to send message.");
    }
}

export async function generateSpeech(text) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioBase64) {
            throw new Error("Failed to generate audio from text.");
        }
        return audioBase64;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate speech.");
    }
}

export async function generateReadAloudQuestion() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a short academic paragraph, about 60-70 words long, suitable for a Pearson Test of English (PTE) 'Read Aloud' question. The paragraph should be on a topic like science, history, or arts. Do not include any introductory text like 'Here is a paragraph:'."
        });
        return response.text;
    } catch (error) {
        console.error("Error generating question from Gemini:", error);
        throw new Error("Failed to generate question.");
    }
}


export async function scoreReadAloudAttempt(originalText) {
    const prompt = `
    You are an expert PTE Academic examiner AI.
    A student was given the following text to read aloud:
    ---
    "${originalText}"
    ---

    Your task is to provide a simulated score based on the three official PTE criteria: Content, Pronunciation, and Fluency. Assume the student read the text with good, but not perfect, pronunciation and fluency. Invent a plausible scenario for their performance.

    - **Content:** Score out of 5. Base this on how many words you imagine were correctly transcribed from the text.
    - **Pronunciation:** Score out of 5. Base this on clarity and native-like pronunciation.
    - **Fluency:** Score out of 5. Base this on rhythm, stress, and intonation.

    Finally, provide a brief, constructive paragraph of feedback on what the student could improve, as if you had heard them speak.

    Return your response ONLY as a valid JSON object.
    `;

    try {
         const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             responseMimeType: "application/json",
             responseSchema: {
                type: Type.OBJECT,
                properties: {
                  content: { type: Type.INTEGER },
                  pronunciation: { type: Type.INTEGER },
                  fluency: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                },
              },
           },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        // Basic validation
        if (typeof parsedResponse.content !== 'number' || typeof parsedResponse.pronunciation !== 'number' || typeof parsedResponse.fluency !== 'number' || typeof parsedResponse.feedback !== 'string') {
            throw new Error("Invalid JSON structure from Gemini API.");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error scoring attempt with Gemini:", error);
        throw new Error("Failed to get score from Gemini.");
    }
}

export async function generateRepeatSentenceQuestion() {
    try {
        // Step 1: Generate the sentence text
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a single, simple sentence suitable for a Pearson Test of English (PTE) 'Repeat Sentence' question. The sentence should be between 9 and 14 words long. Do not include any introductory text, just the sentence itself."
        });
        const sentenceText = textResponse.text.trim();

        if (!sentenceText) {
            throw new Error("Generated empty text for sentence.");
        }

        // Step 2: Convert the text to speech
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: sentenceText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // A clear, standard voice
                    },
                },
            },
        });
        
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioBase64) {
            throw new Error("Failed to generate audio from text.");
        }
        
        return { text: sentenceText, audioBase64 };

    } catch (error) {
        console.error("Error generating repeat sentence question from Gemini:", error);
        throw new Error("Failed to generate question.");
    }
}

export async function scoreRepeatSentenceAttempt(originalText) {
    const prompt = `
    You are an expert PTE Academic examiner AI.
    A student was asked to repeat the following sentence from memory after hearing it once:
    ---
    "${originalText}"
    ---

    Your task is to provide a simulated score for a plausible student attempt. Assume the student repeated about 70-80% of the words correctly but may have missed a few words or had minor hesitations.

    Provide a score based on the three official PTE criteria:
    - **Content:** Score out of 5. Base this on how many words you imagine were correctly repeated.
    - **Pronunciation:** Score out of 5. Assume good, but not perfect, pronunciation on the words they did say.
    - **Fluency:** Score out of 5. Assume a decent rhythm but with a slight hesitation, affecting the flow.

    Finally, provide a brief, constructive paragraph of feedback based on this simulated performance. The feedback should focus on listening carefully and speaking smoothly.

    Return your response ONLY as a valid JSON object.
    `;

    try {
         const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             responseMimeType: "application/json",
             responseSchema: {
                type: Type.OBJECT,
                properties: {
                  content: { type: Type.INTEGER },
                  pronunciation: { type: Type.INTEGER },
                  fluency: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                },
              },
           },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (typeof parsedResponse.content !== 'number' || typeof parsedResponse.pronunciation !== 'number' || typeof parsedResponse.fluency !== 'number' || typeof parsedResponse.feedback !== 'string') {
            throw new Error("Invalid JSON structure from Gemini API.");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error scoring repeat sentence attempt with Gemini:", error);
        throw new Error("Failed to get score from Gemini.");
    }
}

export async function generateDescribeImageQuestion() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{
                    text: `Generate a simple data visualization graph suitable for a PTE 'Describe Image' task. 
                    It should be one of the following types: bar chart, line graph, pie chart, or a simple process diagram. 
                    The graph must be clear, easy to interpret, and contain labels and data.
                    For example, a bar chart showing population growth over 4 decades, or a pie chart of a country's energy sources.`
                }, ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const part = response?.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData?.data) {
            return part.inlineData.data; // This is the base64 encoded string
        } else {
             throw new Error("No image data received from Gemini API.");
        }

    } catch (error) {
        console.error("Error generating image from Gemini:", error);
        throw new Error("Failed to generate image question.");
    }
}


export async function scoreDescribeImageAttempt() {
    const prompt = `
    You are an expert PTE Academic examiner AI.
    A student was given a data visualization (like a chart or graph) and asked to describe it.

    Your task is to provide a simulated score for a plausible student attempt. Assume the student did a decent job but had some minor flaws. For example, they correctly identified the main trend but missed a few key details, and their speech was mostly fluent but had a slight hesitation.

    Provide a score based on the three official PTE criteria:
    - **Content:** Score out of 5. Base this on how well you imagine they covered the key information in the image.
    - **Pronunciation:** Score out of 5. Assume clear, but not perfect, pronunciation.
    - **Fluency:** Score out of 5. Assume a good rhythm but with a minor pause or repetition.

    Finally, provide a brief, constructive paragraph of feedback based on this simulated performance. The feedback should focus on identifying key features and speaking smoothly.

    Return your response ONLY as a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        content: { type: Type.INTEGER },
                        pronunciation: { type: Type.INTEGER },
                        fluency: { type: Type.INTEGER },
                        feedback: { type: Type.STRING },
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (typeof parsedResponse.content !== 'number' || typeof parsedResponse.pronunciation !== 'number' || typeof parsedResponse.fluency !== 'number' || typeof parsedResponse.feedback !== 'string') {
            throw new Error("Invalid JSON structure from Gemini API.");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error scoring describe image attempt with Gemini:", error);
        throw new Error("Failed to get score from Gemini.");
    }
}

export async function generateRetellLectureQuestion() {
    try {
        // Step 1: Generate the lecture transcript
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a transcript for a short academic lecture, suitable for a Pearson Test of English (PTE) 'Retell Lecture' question. The lecture should be on a topic like science, history, or arts, and be approximately 60-90 seconds long when spoken at a natural pace (around 150-220 words). Do not include any introductory text, just the lecture content itself."
        });
        const transcript = textResponse.text.trim();

        if (!transcript) {
            throw new Error("Generated empty transcript for lecture.");
        }

        // Step 2: Convert the text to speech
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: transcript }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' }, // A suitable voice for lectures
                    },
                },
            },
        });
        
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioBase64) {
            throw new Error("Failed to generate audio from text.");
        }
        
        return { transcript, audioBase64 };

    } catch (error) {
        console.error("Error generating retell lecture question from Gemini:", error);
        throw new Error("Failed to generate question.");
    }
}

export async function scoreRetellLectureAttempt() {
    const prompt = `
    You are an expert PTE Academic examiner AI.
    A student listened to a short academic lecture and was asked to retell it in their own words.

    Your task is to provide a simulated score for a plausible student performance. Assume the student successfully identified and retold some of the key points but may have missed the overall connection or some details. Their speech was mostly fluent but had a few hesitations as they tried to recall information.

    Provide a score based on the three official PTE criteria:
    - **Content:** Score out of 5. Base this on how well you imagine they covered the main points of the lecture.
    - **Pronunciation:** Score out of 5. Assume their pronunciation was clear but not perfect.
    - **Fluency:** Score out of 5. Assume they spoke with a decent rhythm but with some pauses or repetitions, common for this task.

    Finally, provide a brief, constructive paragraph of feedback based on this simulated performance. The feedback should focus on note-taking strategies and structuring the response.

    Return your response ONLY as a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             responseMimeType: "application/json",
             responseSchema: {
                type: Type.OBJECT,
                properties: {
                  content: { type: Type.INTEGER },
                  pronunciation: { type: Type.INTEGER },
                  fluency: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                },
              },
           },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (typeof parsedResponse.content !== 'number' || typeof parsedResponse.pronunciation !== 'number' || typeof parsedResponse.fluency !== 'number' || typeof parsedResponse.feedback !== 'string') {
            throw new Error("Invalid JSON structure from Gemini API.");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error scoring retell lecture attempt with Gemini:", error);
        throw new Error("Failed to get score from Gemini.");
    }
}

export async function generateAnswerShortQuestion() {
    try {
        // Step 1: Generate the question and answer text
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a simple, common knowledge question and its corresponding one or two-word answer, suitable for a PTE 'Answer Short Question' task. Return ONLY a valid JSON object with two keys: 'question' and 'answer'. For example: {\"question\": \"What is the opposite of hot?\", \"answer\": \"Cold\"}.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        answer: { type: Type.STRING }
                    },
                    required: ['question', 'answer']
                }
            }
        });
        const qaData = JSON.parse(textResponse.text.trim());
        const { question, answer } = qaData;

        if (!question || !answer) {
            throw new Error("Generated empty question or answer.");
        }

        // Step 2: Convert the question text to speech
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: question }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioBase64) {
            throw new Error("Failed to generate audio from text.");
        }
        
        return { question, answer, audioBase64 };

    } catch (error) {
        console.error("Error generating answer short question from Gemini:", error);
        throw new Error("Failed to generate question.");
    }
}

export async function scoreAnswerShortQuestionAttempt(correctAnswer) {
    const prompt = `
    You are an expert PTE Academic examiner AI.
    A student was asked a simple question, and the correct answer is "${correctAnswer}".

    Your task is to provide a simulated score for a plausible student attempt. Assume the student answered the question correctly with good pronunciation and fluency.

    Provide a score based on the three official PTE criteria:
    - **Content:** Score out of 5. For this task, a correct answer is worth 5 points.
    - **Pronunciation:** Score out of 5. Assume their pronunciation was clear (score 4 or 5).
    - **Fluency:** Score out of 5. Assume they answered without hesitation (score 5).

    Finally, provide a brief, encouraging paragraph of feedback (e.g., "Well done, that was the correct answer. Your pronunciation was clear.").

    Return your response ONLY as a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             responseMimeType: "application/json",
             responseSchema: {
                type: Type.OBJECT,
                properties: {
                  content: { type: Type.INTEGER },
                  pronunciation: { type: Type.INTEGER },
                  fluency: { type: Type.INTEGER },
                  feedback: { type: Type.STRING },
                },
              },
           },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (typeof parsedResponse.content !== 'number' || typeof parsedResponse.pronunciation !== 'number' || typeof parsedResponse.fluency !== 'number' || typeof parsedResponse.feedback !== 'string') {
            throw new Error("Invalid JSON structure from Gemini API.");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error scoring Answer Short Question attempt with Gemini:", error);
        throw new Error("Failed to get score from Gemini.");
    }
}


export async function generateSummarizeWrittenTextQuestion() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate an academic passage of about 250-300 words suitable for a Pearson Test of English (PTE) 'Summarize Written Text' question. The topic should be academic in nature (e.g., sociology, biology, astronomy). The passage must contain a clear main idea and supporting points. Do not include a title or any introductory text like 'Here is the passage:'."
        });
        return response.text;
    } catch (error) {
        console.error("Error generating SWT question from Gemini:", error);
        throw new Error("Failed to generate Summarize Written Text question.");
    }
}

export async function scoreSummarizeWrittenTextAttempt(originalPassage, userSummary) {
    const prompt = `
    You are an expert PTE Academic examiner AI. A student was given the following passage and asked to summarize it in a single sentence of 5-75 words.

    Original Passage:
    ---
    "${originalPassage}"
    ---

    Student's Summary:
    ---
    "${userSummary}"
    ---

    Your task is to score the student's summary based on the four official PTE criteria for this task: Content, Form, Grammar, and Vocabulary.

    - **Content:** Score out of 2. Does the summary accurately represent the main ideas of the passage? (0 = poor, 1 = fair, 2 = good).
    - **Form:** Score out of 1. Is the summary a single, complete sentence between 5 and 75 words? (0 = no, 1 = yes).
    - **Grammar:** Score out of 2. Is the sentence grammatically correct? (0 = many errors, 1 = minor errors, 2 = correct).
    - **Vocabulary:** Score out of 2. Is the vocabulary appropriate and used correctly? (0 = poor, 1 = adequate, 2 = good).

    Finally, provide a brief, constructive paragraph of feedback (around 50-60 words) on the summary's strengths and weaknesses.

    Return your response ONLY as a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        content: { type: Type.INTEGER },
                        form: { type: Type.INTEGER },
                        grammar: { type: Type.INTEGER },
                        vocabulary: { type: Type.INTEGER },
                        feedback: { type: Type.STRING },
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        // Basic validation
        if (typeof parsedResponse.content !== 'number' || typeof parsedResponse.form !== 'number' || typeof parsedResponse.grammar !== 'number' || typeof parsedResponse.vocabulary !== 'number' || typeof parsedResponse.feedback !== 'string') {
            throw new Error("Invalid JSON structure from Gemini API.");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error scoring SWT attempt with Gemini:", error);
        throw new Error("Failed to get score for Summarize Written Text.");
    }
}


export async function generateWriteEssayQuestion() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a standard academic essay prompt suitable for a Pearson Test of English (PTE) 'Write Essay' task. The prompt should present a topic and ask for the test-taker's opinion, or ask them to discuss advantages and disadvantages. It should be concise and clear. Do not include any introductory text like 'Here is your essay prompt:'."
        });
        return response.text;
    } catch (error) {
        console.error("Error generating essay question from Gemini:", error);
        throw new Error("Failed to generate Write Essay question.");
    }
}

export async function scoreWriteEssayAttempt(essayPrompt, userEssay) {
    const prompt = `
    You are an expert PTE Academic examiner AI. A student was given the following essay prompt and wrote the response provided.

    Essay Prompt:
    ---
    "${essayPrompt}"
    ---

    Student's Essay:
    ---
    "${userEssay}"
    ---

    Your task is to score the student's essay based on the seven official PTE criteria for this task. The essay should be between 200 and 300 words.

    - **Content:** Score out of 3. Does the essay address the prompt effectively?
    - **Form:** Score out of 2. Is the word count between 200 and 300 words? (Give 1 if it's close, 0 if it's far off).
    - **Development, Structure, and Coherence:** Score out of 2. Is the essay well-structured with a clear introduction, body paragraphs, and conclusion?
    - **Grammar:** Score out of 2. Is the grammar correct and varied?
    - **General Linguistic Range:** Score out of 2. Is the language natural and contextually appropriate?
    - **Vocabulary Range:** Score out of 2. Is a good range of academic vocabulary used correctly?
    - **Spelling:** Score out of 2. Are words spelled correctly (US or UK spelling is acceptable)?

    Finally, provide a brief, constructive paragraph of feedback (around 60-70 words) on the essay's overall quality, highlighting one strength and one area for improvement.

    Return your response ONLY as a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        content: { type: Type.INTEGER },
                        form: { type: Type.INTEGER },
                        development: { type: Type.INTEGER, description: "Development, Structure, and Coherence" },
                        grammar: { type: Type.INTEGER },
                        linguisticRange: { type: Type.INTEGER, description: "General Linguistic Range" },
                        vocabulary: { type: Type.INTEGER, description: "Vocabulary Range" },
                        spelling: { type: Type.INTEGER },
                        feedback: { type: Type.STRING },
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        // Basic validation
        if (typeof parsedResponse.content !== 'number' || typeof parsedResponse.form !== 'number' || typeof parsedResponse.development !== 'number' || typeof parsedResponse.grammar !== 'number' || typeof parsedResponse.linguisticRange !== 'number' || typeof parsedResponse.vocabulary !== 'number' || typeof parsedResponse.spelling !== 'number' || typeof parsedResponse.feedback !== 'string') {
            throw new Error("Invalid JSON structure from Gemini API.");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error scoring Write Essay attempt with Gemini:", error);
        throw new Error("Failed to get score for Write Essay.");
    }
}

export async function getLanguageTutorFeedback(transcript, language) {
    const prompt = `
    You are an expert language examiner AI. A student has just completed a practice conversation in ${language}.

    Here is the full transcript of their conversation:
    ---
    ${transcript}
    ---

    Your task is to analyze ONLY THE USER'S speech from the transcript and provide a detailed, constructive performance report.

    Evaluate the user based on the following criteria, with scores out of 10:
    - **Pronunciation:** How clear and accurate was their pronunciation?
    - **Fluency:** How natural and smooth was their speech, including rhythm and pauses?

    Provide the following in your analysis:
    1.  "overallFeedback": A brief, encouraging summary (2-3 sentences) of the user's performance, highlighting one strength and one key area for improvement.
    2.  "pronunciationScore": An integer score from 1 to 10.
    3.  "pronunciationFeedback": Specific feedback on pronunciation. Mention specific words if possible.
    4.  "fluencyScore": An integer score from 1 to 10.
    5.  "fluencyFeedback": Specific feedback on fluency and rhythm.
    6.  "grammarFeedback": Identify up to 3 grammatical errors the user made. For each, provide the incorrect phrase and the corrected version. If there are no errors, state that.
    7.  "vocabularySuggestions": An array of 3-5 alternative words or more advanced phrases the user could have used.

    Return your response ONLY as a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallFeedback: { type: Type.STRING },
                        pronunciationScore: { type: Type.INTEGER },
                        pronunciationFeedback: { type: Type.STRING },
                        fluencyScore: { type: Type.INTEGER },
                        fluencyFeedback: { type: Type.STRING },
                        grammarFeedback: { type: Type.STRING },
                        vocabularySuggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['overallFeedback', 'pronunciationScore', 'pronunciationFeedback', 'fluencyScore', 'fluencyFeedback', 'grammarFeedback', 'vocabularySuggestions']
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting language tutor feedback from Gemini:", error);
        throw new Error("Failed to get feedback from Gemini.");
    }
}

export async function generateFillInBlanksDropdownQuestion() {
    const prompt = `
    Create a question for the 'Fill in the Blanks (Dropdown)' section of the PTE Academic test.
    The response must be a single JSON object.

    The task requires:
    1.  An academic passage of about 120-200 words. The passage should have between 4 and 5 blanks. Represent each blank in the text with "{{BLANK_n}}", where 'n' is the blank number (e.g., "{{BLANK_1}}", "{{BLANK_2}}").
    2.  For each blank, provide a list of 4 word options: one correct answer and three plausible distractors. The options should be contextually and grammatically relevant.
    3.  The JSON object should have two keys: "passage" (a string) and "blanks" (an array of objects).
    4.  Each object in the "blanks" array must have three keys: "id" (the blank number), "options" (an array of 4 strings, shuffled), and "correctAnswer" (the correct string).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        passage: { type: Type.STRING },
                        blanks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.INTEGER },
                                    options: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
                                    correctAnswer: { type: Type.STRING }
                                },
                                required: ['id', 'options', 'correctAnswer']
                            }
                        }
                    },
                    required: ['passage', 'blanks']
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        // Validation
        if (!parsedResponse.passage || !Array.isArray(parsedResponse.blanks) || parsedResponse.blanks.length < 4) {
            throw new Error("Invalid JSON structure received from Gemini API.");
        }
        
        parsedResponse.blanks.forEach(blank => {
            // Ensure correct answer is in options, as model can sometimes forget
            if (!blank.options.includes(blank.correctAnswer)) {
                blank.options[0] = blank.correctAnswer;
            }
            blank.options.sort(() => Math.random() - 0.5);
        });

        return parsedResponse;
    } catch (error) {
        console.error("Error generating Fill in Blanks question from Gemini:", error);
        throw new Error("Failed to generate Fill in Blanks question.");
    }
}

export async function generateReadingMultipleChoiceMultipleQuestion() {
    const prompt = `
    Create a question for the 'Multiple Choice, Multiple Answers' section of the PTE Academic reading test.
    The response must be a single JSON object.

    The task requires:
    1. An academic passage of about 200-300 words on a topic like science, history, or arts.
    2. A question about the content of the passage.
    3. A list of 5 to 7 plausible options.
    4. A list containing the correct answers (usually 2 or 3 correct answers) which must be strings present in the options list.

    The JSON object should have four keys: "passage", "question", "options" (an array of strings), and "correctAnswers" (an array of strings).
    Ensure the strings in "correctAnswers" are exact matches to strings in the "options" array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        passage: { type: Type.STRING },
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswers: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['passage', 'question', 'options', 'correctAnswers']
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        // Validation
        if (!parsedResponse.passage || !parsedResponse.question || !Array.isArray(parsedResponse.options) || parsedResponse.options.length < 5 || !Array.isArray(parsedResponse.correctAnswers) || parsedResponse.correctAnswers.length < 2) {
            throw new Error("Invalid JSON structure received from Gemini API.");
        }

        return parsedResponse;
    } catch (error) {
        console.error("Error generating Reading Multiple Choice question from Gemini:", error);
        throw new Error("Failed to generate Reading Multiple Choice question.");
    }
}

export async function generateReorderParagraphsQuestion() {
    const prompt = `
    Create a question for the 'Re-order Paragraphs' section of the PTE Academic test.
    The response must be a single JSON object.

    The task requires:
    1. A set of 4 to 5 short, logically connected academic paragraphs that form a coherent single text when ordered correctly.
    2. The JSON object should have one key: "paragraphs".
    3. The "paragraphs" value should be an array of strings, with each string being a paragraph.
    4. IMPORTANT: The paragraphs in the array must be in the correct, logical order. The frontend application will handle shuffling them for the user.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        paragraphs: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['paragraphs']
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        // Validation
        if (!Array.isArray(parsedResponse.paragraphs) || parsedResponse.paragraphs.length < 4 || parsedResponse.paragraphs.length > 5) {
            throw new Error("Invalid JSON structure: 'paragraphs' must be an array of 4-5 strings.");
        }

        const correctOrder = [...parsedResponse.paragraphs];
        // Shuffle the array for the user
        const shuffled = [...parsedResponse.paragraphs].sort(() => Math.random() - 0.5);

        return {
            shuffledParagraphs: shuffled,
            correctOrder: correctOrder
        };

    } catch (error) {
        console.error("Error generating Re-order Paragraphs question from Gemini:", error);
        throw new Error("Failed to generate Re-order Paragraphs question.");
    }
}

export async function generateSummarizeSpokenTextQuestion() {
    try {
        // Step 1: Generate the lecture transcript
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a transcript for a short academic lecture, suitable for a Pearson Test of English (PTE) 'Summarize Spoken Text' question. The lecture should be on a topic like science, history, or arts, and be approximately 60-90 seconds long when spoken at a natural pace (around 150-220 words). Do not include any introductory text, just the lecture content itself."
        });
        const transcript = textResponse.text.trim();

        if (!transcript) {
            throw new Error("Generated empty transcript for lecture.");
        }

        // Step 2: Convert the text to speech
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: transcript }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                },
            },
        });
        
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioBase64) {
            throw new Error("Failed to generate audio from text.");
        }
        
        return { transcript, audioBase64 };

    } catch (error) {
        console.error("Error generating Summarize Spoken Text question from Gemini:", error);
        throw new Error("Failed to generate question.");
    }
}

export async function scoreSummarizeSpokenTextAttempt(userSummary, originalTranscript) {
    const prompt = `
    You are an expert PTE Academic examiner AI. A student listened to a lecture and wrote the following summary. The summary should be between 50 and 70 words.

    Original Lecture Transcript (for your context):
    ---
    "${originalTranscript}"
    ---

    Student's Summary:
    ---
    "${userSummary}"
    ---

    Your task is to score the student's summary based on the five official PTE criteria for this task:

    - **Content:** Score out of 2. Does the summary accurately represent the main ideas of the lecture? (0 = poor, 1 = fair, 2 = good).
    - **Form:** Score out of 2. Is the summary between 50 and 70 words? (2 = yes, 1 = close, 0 = no).
    - **Grammar:** Score out of 2. Is the summary grammatically correct? (0 = many errors, 1 = minor errors, 2 = correct).
    - **Vocabulary:** Score out of 2. Is the vocabulary appropriate and used correctly? (0 = poor, 1 = adequate, 2 = good).
    - **Spelling:** Score out of 2. Are words spelled correctly? (2 = all correct, 1 = one error, 0 = multiple errors).

    Finally, provide a brief, constructive paragraph of feedback (around 50-60 words) on the summary's strengths and areas for improvement.

    Return your response ONLY as a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        content: { type: Type.INTEGER },
                        form: { type: Type.INTEGER },
                        grammar: { type: Type.INTEGER },
                        vocabulary: { type: Type.INTEGER },
                        spelling: { type: Type.INTEGER },
                        feedback: { type: Type.STRING },
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (typeof parsedResponse.content !== 'number' || typeof parsedResponse.form !== 'number' || typeof parsedResponse.grammar !== 'number' || typeof parsedResponse.vocabulary !== 'number' || typeof parsedResponse.spelling !== 'number' || typeof parsedResponse.feedback !== 'string') {
            throw new Error("Invalid JSON structure from Gemini API.");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error scoring Summarize Spoken Text attempt with Gemini:", error);
        throw new Error("Failed to get score for Summarize Spoken Text.");
    }
}

export async function generateFillInBlanksListeningQuestion() {
    const prompt = `
    Create a question for the 'Fill in the Blanks' section of the PTE Academic listening test.
    The response must be a single JSON object.

    The task requires:
    1. A full academic audio transcript of about 150-200 words on a topic like science, history, or arts.
    2. An array of 5 to 7 keywords from the transcript that will serve as the blanks. These should be common, content-bearing words.

    The JSON object should have two keys: "transcript" (the full string) and "answers" (an array of the chosen keyword strings).
    `;
    try {
        // Step 1: Get transcript and answers from Gemini
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        transcript: { type: Type.STRING },
                        answers: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['transcript', 'answers']
                }
            }
        });
        const { transcript, answers } = JSON.parse(textResponse.text.trim());

        if (!transcript || !answers || answers.length === 0) {
            throw new Error("Invalid data for FIB-L question generation.");
        }
        
        // Step 2: Create the gapped text
        let gappedText = transcript;
        answers.forEach(answer => {
             // Replace only the first occurrence of the word, as a whole word, case-insensitively
            const regex = new RegExp(`\\b${answer}\\b`, 'i');
            if (regex.test(gappedText)) {
                gappedText = gappedText.replace(regex, '{{BLANK}}');
            }
        });

        // Step 3: Generate audio from the full transcript
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: transcript }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                },
            },
        });
        
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioBase64) {
            throw new Error("Failed to generate audio from text for FIB-L.");
        }
        
        return { gappedText, correctAnswers: answers, audioBase64 };

    } catch (error) {
        console.error("Error generating Fill in Blanks (Listening) question from Gemini:", error);
        throw new Error("Failed to generate Fill in Blanks (Listening) question.");
    }
}

export async function generateListeningMultipleChoiceMultipleQuestion() {
    const prompt = `
    Create a question for the 'Multiple Choice, Multiple Answers' section of the PTE Academic LISTENING test.
    The response must be a single JSON object.

    The task requires:
    1. A full academic audio transcript of about 40-90 seconds (approx 100-220 words) on a topic like science, history, or arts.
    2. A question about the content of the transcript.
    3. A list of 5 to 7 plausible options.
    4. A list containing the correct answers (usually 2 or 3 correct answers) which must be strings present in the options list.

    The JSON object should have four keys: "transcript", "question", "options" (an array of strings), and "correctAnswers" (an array of strings).
    Ensure the strings in "correctAnswers" are exact matches to strings in the "options" array.
    `;
    try {
        // Step 1: Get transcript, question, and answers from Gemini
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        transcript: { type: Type.STRING },
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswers: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['transcript', 'question', 'options', 'correctAnswers']
                }
            }
        });
        const { transcript, question, options, correctAnswers } = JSON.parse(textResponse.text.trim());

        if (!transcript || !question || !options || !correctAnswers) {
            throw new Error("Invalid data for L-MCM question generation.");
        }

        // Step 2: Generate audio from the full transcript
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: transcript }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                },
            },
        });
        
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioBase64) {
            throw new Error("Failed to generate audio from text for L-MCM.");
        }
        
        return { transcript, question, options, correctAnswers, audioBase64 };

    } catch (error) {
        console.error("Error generating Listening Multiple Choice (Multiple) question from Gemini:", error);
        throw new Error("Failed to generate Listening Multiple Choice (Multiple) question.");
    }
}

export async function generateHighlightCorrectSummaryQuestion() {
    const prompt = `
    Create a question for the 'Highlight Correct Summary' section of the PTE Academic listening test.
    The response must be a single JSON object.

    The task requires:
    1. A full academic audio transcript of about 30-90 seconds (approx 75-220 words) on a topic like science, history, or arts.
    2. A list of 3 to 5 summary options.
    3. Exactly ONE of these options must be the correct summary of the transcript.
    4. The other options should be plausible but incorrect distractors (e.g., they mention minor details, contain incorrect information, or are only partially correct).

    The JSON object should have three keys: "transcript" (the full string), "options" (an array of summary strings), and "correctAnswer" (the string of the correct summary).
    The "correctAnswer" string must be an exact match to one of the strings in the "options" array.
    `;
    try {
        // Step 1: Get transcript, options, and correct answer from Gemini
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        transcript: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswer: { type: Type.STRING }
                    },
                    required: ['transcript', 'options', 'correctAnswer']
                }
            }
        });
        const { transcript, options, correctAnswer } = JSON.parse(textResponse.text.trim());

        if (!transcript || !options || !correctAnswer || options.length < 3) {
            throw new Error("Invalid data for HCS question generation.");
        }

        // Step 2: Generate audio from the full transcript
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: transcript }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                },
            },
        });
        
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioBase64) {
            throw new Error("Failed to generate audio from text for HCS.");
        }
        
        // Shuffle options for the user
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

        return { transcript, options: shuffledOptions, correctAnswer, audioBase64 };

    } catch (error) {
        console.error("Error generating Highlight Correct Summary question from Gemini:", error);
        throw new Error("Failed to generate Highlight Correct Summary question.");
    }
}

export async function generateListeningMultipleChoiceSingleQuestion() {
    const prompt = `
    Create a question for the 'Multiple Choice, Single Answer' section of the PTE Academic listening test.
    The response must be a single JSON object.

    The task requires:
    1. A full academic audio transcript of about 60-90 seconds (approx 150-220 words) on a topic like science, history, or arts.
    2. A single-choice question about the content of the transcript.
    3. A list of 3 to 5 plausible options.
    4. Exactly ONE of these options must be the correct answer.
    5. The other options should be plausible but incorrect distractors.

    The JSON object should have four keys: "transcript", "question", "options" (an array of strings), and "correctAnswer" (the string of the correct answer).
    The "correctAnswer" string must be an exact match to one of the strings in the "options" array.
    `;
    try {
        // Step 1: Get transcript, question, options, and correct answer from Gemini
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        transcript: { type: Type.STRING },
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswer: { type: Type.STRING }
                    },
                    required: ['transcript', 'question', 'options', 'correctAnswer']
                }
            }
        });
        const { transcript, question, options, correctAnswer } = JSON.parse(textResponse.text.trim());

        if (!transcript || !question || !options || !correctAnswer || options.length < 3) {
            throw new Error("Invalid data for L-MCS question generation.");
        }

        // Step 2: Generate audio from the full transcript
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: transcript }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                },
            },
        });
        
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!audioBase64) {
            throw new Error("Failed to generate audio from text for L-MCS.");
        }
        
        // Shuffle options for the user
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

        return { transcript, question, options: shuffledOptions, correctAnswer, audioBase64 };

    } catch (error) {
        console.error("Error generating Listening Multiple Choice (Single) question from Gemini:", error);
        throw new Error("Failed to generate Listening Multiple Choice (Single) question.");
    }
}

export async function analyzePteScores(scores) {
    const prompt = `
    You are an expert PTE Academic coach AI. A student has provided their PTE scores. Your task is to analyze these scores, identify the weakest areas, provide constructive feedback, and suggest specific practice exercises available in the app.

    The student's scores are:
    - Communicative Skills (out of 90):
      - Listening: ${scores.listening}
      - Reading: ${scores.reading}
      - Speaking: ${scores.speaking}
      - Writing: ${scores.writing}
    - Enabling Skills (out of 90):
      - Grammar: ${scores.grammar}
      - Oral Fluency: ${scores.oralFluency}
      - Pronunciation: ${scores.pronunciation}
      - Spelling: ${scores.spelling}
      - Vocabulary: ${scores.vocabulary}
      - Written Discourse: ${scores.writtenDiscourse}

    Analyze the scores and perform the following actions:
    1.  Provide a brief, encouraging "overallSummary" of the student's performance (2-3 sentences), highlighting one or two key strengths.
    2.  Identify the 2 or 3 skills with the lowest scores that need the most improvement. For each of these skills, create an object for an "areasForImprovement" array.
    3.  For each area of improvement, provide:
        - "skill": The name of the skill (e.g., "Pronunciation", "Reading", "Vocabulary").
        - "score": The student's score for that skill.
        - "feedback": A short, constructive paragraph (2-3 sentences) explaining why this score might be low and what to focus on. For example, a low 'Pronunciation' score could be due to incorrect word stress or unclear vowel sounds. A low 'Reading' score might relate to speed or comprehension of complex texts.
        - "suggestedPractice": An array of strings. Each string must be a key corresponding to a practice question type in the app. The available keys are: 'read-aloud', 'repeat-sentence', 'describe-image', 'retell-lecture', 'answer-short-question', 'summarize-written-text', 'write-essay', 'fill-in-blanks-dropdown', 'reading-multiple-choice-multiple', 're-order-paragraphs', 'summarize-spoken-text', 'listening-multiple-choice-multiple', 'listening-multiple-choice-single', 'fill-in-blanks-listening', 'highlight-correct-summary'. Choose the most relevant practice types for improving the specific skill. For 'Pronunciation' and 'Oral Fluency', suggest 'read-aloud' and 'repeat-sentence'. For 'Written Discourse', suggest 'write-essay' and 'summarize-written-text'. For 'Reading', suggest 'fill-in-blanks-dropdown' and 're-order-paragraphs'.

    Return your response ONLY as a valid JSON object. Do not include any other text or formatting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallSummary: { type: Type.STRING },
                        areasForImprovement: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    skill: { type: Type.STRING },
                                    score: { type: Type.INTEGER },
                                    feedback: { type: Type.STRING },
                                    suggestedPractice: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ['skill', 'score', 'feedback', 'suggestedPractice']
                            }
                        }
                    },
                    required: ['overallSummary', 'areasForImprovement']
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        
        // Basic validation
        if (!parsedResponse.overallSummary || !Array.isArray(parsedResponse.areasForImprovement)) {
             throw new Error("Invalid JSON structure from Gemini API for score analysis.");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error analyzing scores with Gemini:", error);
        throw new Error("Failed to get score analysis from Gemini.");
    }
}

export async function generateReadingMultipleChoiceSingleQuestion() {
    const prompt = `
    Create a question for the 'Multiple Choice, Single Answer' section of the PTE Academic reading test.
    The response must be a single JSON object.

    The task requires:
    1. An academic passage of about 200-300 words.
    2. A single-choice question about the content.
    3. A list of 4 to 5 plausible options.
    4. Exactly ONE of these options must be the correct answer. The "correctAnswer" string must be an exact match to one of the "options".

    The JSON object should have four keys: "passage", "question", "options" (an array of strings), and "correctAnswer" (a string).
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        passage: { type: Type.STRING },
                        question: { type: Type.STRING },
                        options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswer: { type: Type.STRING }
                    },
                    required: ['passage', 'question', 'options', 'correctAnswer']
                }
            }
        });
        const parsedResponse = JSON.parse(response.text.trim());
        if (!parsedResponse.passage || !parsedResponse.question || !Array.isArray(parsedResponse.options) || !parsedResponse.correctAnswer) {
            throw new Error("Invalid JSON structure received from Gemini API.");
        }
        return parsedResponse;
    } catch (error) {
        console.error("Error generating Reading MC-S question:", error);
        throw new Error("Failed to generate Reading MC-S question.");
    }
}

export async function generateFillInBlanksDragDropQuestion() {
    const prompt = `
    Create a question for 'Fill in the Blanks (Drag and Drop)' for the PTE Academic test.
    The response must be a single JSON object.

    The task requires:
    1. An academic passage of about 80-100 words with 4-5 blanks. Represent each blank with "{{BLANK}}".
    2. A list of 6-8 words for a word bank. This list must contain all the correct words for the blanks, plus extra distractors.

    The JSON object should have three keys: "passageWithBlanks", "wordBank" (an array of all options), and "correctAnswers" (an array of correct words in order).
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        passageWithBlanks: { type: Type.STRING },
                        wordBank: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        correctAnswers: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['passageWithBlanks', 'wordBank', 'correctAnswers']
                }
            }
        });
        const parsedResponse = JSON.parse(response.text.trim());
        if (!parsedResponse.passageWithBlanks || !Array.isArray(parsedResponse.wordBank) || !Array.isArray(parsedResponse.correctAnswers)) {
            throw new Error("Invalid JSON structure from Gemini API.");
        }
        return parsedResponse;
    } catch (error) {
        console.error("Error generating FIB DragDrop question:", error);
        throw new Error("Failed to generate FIB DragDrop question.");
    }
}

export async function generateSelectMissingWordQuestion() {
    const prompt = `
    Create a 'Select Missing Word' question for the PTE listening test.
    The response must be a single JSON object.

    The task requires:
    1. A short academic sentence or two (15-40 words) where the final word/phrase is a key piece of information.
    2. A list of 5 plausible options for the final word/phrase.
    3. Exactly ONE option must be correct.

    The JSON object must have "transcript" (the full text including the final word for audio generation), "options" (an array of 5 strings), and "correctAnswer" (the correct final word string).
    `;
    try {
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        transcript: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        correctAnswer: { type: Type.STRING }
                    },
                    required: ['transcript', 'options', 'correctAnswer']
                }
            }
        });
        const data = JSON.parse(textResponse.text.trim());
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: data.transcript }] }],
            config: { responseModalities: [Modality.AUDIO] }
        });
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioBase64) throw new Error("Failed to generate audio.");
        return { ...data, audioBase64 };
    } catch (error) {
        console.error("Error generating Select Missing Word question:", error);
        throw new Error("Failed to generate question.");
    }
}

export async function generateHighlightIncorrectWordsQuestion() {
    const prompt = `
    Create a 'Highlight Incorrect Words' question for the PTE listening test.
    The response must be a single JSON object.

    The task requires:
    1. An original academic transcript of 40-60 words for audio generation.
    2. A modified transcript where 3 to 5 words are changed to plausible alternatives.
    3. An array of the incorrect words in the modified transcript.

    The JSON object must have "originalTranscript", "displayedTranscript", and "incorrectWords" (an array of the changed words from the displayed transcript).
    `;
    try {
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        originalTranscript: { type: Type.STRING },
                        displayedTranscript: { type: Type.STRING },
                        incorrectWords: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['originalTranscript', 'displayedTranscript', 'incorrectWords']
                }
            }
        });
        const data = JSON.parse(textResponse.text.trim());
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: data.originalTranscript }] }],
            config: { responseModalities: [Modality.AUDIO] }
        });
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioBase64) throw new Error("Failed to generate audio.");
        return { ...data, audioBase64 };
    } catch (error) {
        console.error("Error generating Highlight Incorrect Words question:", error);
        throw new Error("Failed to generate question.");
    }
}

export async function generateWriteFromDictationQuestion() {
    try {
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a single, grammatically correct sentence for a PTE 'Write from Dictation' task. Length: 10-15 words. Topic: common academic. Output only the sentence."
        });
        const sentence = textResponse.text.trim();
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: sentence }] }],
            config: { responseModalities: [Modality.AUDIO] }
        });
        const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioBase64) throw new Error("Failed to generate audio.");
        return { sentence, audioBase64 };
    } catch (error) {
        console.error("Error generating Write From Dictation question:", error);
        throw new Error("Failed to generate question.");
    }
}

export async function scoreWriteFromDictationAttempt(originalSentence, userSentence) {
    const prompt = `
    You are an expert PTE Academic examiner AI. A student was asked to write the following sentence from dictation:
    Original Sentence: "${originalSentence}"
    Student's Sentence: "${userSentence}"

    Your task is to score the student's attempt. The scoring is based on the number of correct words spelled correctly.
    - **score:** Calculate the number of correct words that are also spelled correctly.
    - **maxScore:** The total number of words in the original sentence.
    - **feedback:** Provide a short, constructive paragraph of feedback (around 40-50 words) on what was correct and what was missed or misspelled.

    Return your response ONLY as a valid JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        maxScore: { type: Type.INTEGER },
                        feedback: { type: Type.STRING },
                    },
                    required: ['score', 'maxScore', 'feedback']
                },
            },
        });
        const parsedResponse = JSON.parse(response.text.trim());
        if (typeof parsedResponse.score !== 'number' || typeof parsedResponse.maxScore !== 'number' || typeof parsedResponse.feedback !== 'string') {
            throw new Error("Invalid JSON structure from Gemini API for WFD scoring.");
        }
        return parsedResponse;
    } catch (error) {
        console.error("Error scoring WFD attempt with Gemini:", error);
        throw new Error("Failed to get score for Write From Dictation.");
    }
}

export async function generateReadingMockTestSet() {
    try {
        const questionPromises = [
            generateReadingMultipleChoiceSingleQuestion(),
            generateReadingMultipleChoiceMultipleQuestion(),
            generateReorderParagraphsQuestion(),
            generateFillInBlanksDragDropQuestion(),
            generateFillInBlanksDropdownQuestion()
        ];
        
        const results = await Promise.all(questionPromises);

        const testSet = [
            { type: 'reading-multiple-choice-single', data: results[0] },
            { type: 'reading-multiple-choice-multiple', data: results[1] },
            { type: 're-order-paragraphs', data: results[2] },
            { type: 'fill-in-blanks-drag-drop', data: results[3] },
            { type: 'fill-in-blanks-dropdown', data: results[4] }
        ];

        // Simple shuffle
        return testSet.sort(() => Math.random() - 0.5);

    } catch (error) {
        console.error("Error generating reading mock test set from Gemini:", error);
        throw new Error("Failed to generate the mock test set.");
    }
}

export async function generateWritingMockTestSet() {
    try {
        const questionPromises = [
            generateSummarizeWrittenTextQuestion(),
            generateWriteEssayQuestion()
        ];
        
        const results = await Promise.all(questionPromises);

        const testSet = [
            { type: 'summarize-written-text', data: { passage: results[0] } },
            { type: 'write-essay', data: { prompt: results[1] } }
        ];

        return testSet;

    } catch (error) {
        console.error("Error generating writing mock test set from Gemini:", error);
        throw new Error("Failed to generate the mock test set.");
    }
}

export async function generateSpeakingMockTestSet() {
    try {
        const questionPromises = [
            generateReadAloudQuestion(),
            generateReadAloudQuestion(),
            generateRepeatSentenceQuestion(),
            generateRepeatSentenceQuestion(),
            generateRepeatSentenceQuestion(),
            generateDescribeImageQuestion(),
            generateDescribeImageQuestion(),
            generateRetellLectureQuestion(),
            generateAnswerShortQuestion(),
            generateAnswerShortQuestion(),
        ];
        
        const results = await Promise.all(questionPromises);

        const testSet = [
            { type: 'read-aloud', data: { text: results[0] } },
            { type: 'read-aloud', data: { text: results[1] } },
            { type: 'repeat-sentence', data: results[2] },
            { type: 'repeat-sentence', data: results[3] },
            { type: 'repeat-sentence', data: results[4] },
            { type: 'describe-image', data: { imageBase64: results[5] } },
            { type: 'describe-image', data: { imageBase64: results[6] } },
            { type: 'retell-lecture', data: results[7] },
            { type: 'answer-short-question', data: results[8] },
            { type: 'answer-short-question', data: results[9] },
        ];
        
        return testSet.sort(() => Math.random() - 0.5);

    } catch (error) {
        console.error("Error generating speaking mock test set from Gemini:", error);
        throw new Error("Failed to generate the speaking mock test set.");
    }
}

export async function generateListeningMockTestSet() {
    try {
        const questionPromises = [
            generateSummarizeSpokenTextQuestion(),
            generateListeningMultipleChoiceMultipleQuestion(),
            generateFillInBlanksListeningQuestion(),
            generateHighlightIncorrectWordsQuestion(),
            generateWriteFromDictationQuestion(),
            generateWriteFromDictationQuestion(), // WFD is important, so include two
        ];

        const results = await Promise.all(questionPromises);

        const testSet = [
            { type: 'summarize-spoken-text', data: results[0] },
            { type: 'listening-multiple-choice-multiple', data: results[1] },
            { type: 'fill-in-blanks-listening', data: results[2] },
            { type: 'highlight-incorrect-words', data: results[3] },
            // Use distinct types to serve as unique keys
            { type: 'write-from-dictation-1', data: results[4] },
            { type: 'write-from-dictation-2', data: results[5] },
        ];

        // Simple shuffle to vary the test experience
        return testSet.sort(() => Math.random() - 0.5);

    } catch (error) {
        console.error("Error generating listening mock test set from Gemini:", error);
        throw new Error("Failed to generate the listening mock test set.");
    }
}

export async function generateFullMockTestSet() {
    try {
        const [speaking, writing, reading, listening] = await Promise.all([
            generateSpeakingMockTestSet(),
            generateWritingMockTestSet(),
            generateReadingMockTestSet(),
            generateListeningMockTestSet()
        ]);

        return { speaking, writing, reading, listening };
    } catch (error) {
        console.error("Error generating full mock test set from Gemini:", error);
        throw new Error("Failed to generate the full mock test set.");
    }
}