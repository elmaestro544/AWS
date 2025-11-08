import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import * as apiService from '../services/geminiService.js';
import * as historyService from '../services/historyService.js';
import { Spinner, SendIcon, AttachIcon, CloseIcon, SpeakerIcon, StopIcon, MicrophoneIcon, UserIcon } from './icons.js';
import HistoryPanel from './HistoryPanel.js';

// --- Audio Helper Functions ---

function encode(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data, ctx, sampleRate, numChannels) {
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

function createBlob(data) {
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

const AILanguageTutorPractice = ({ currentUser }) => {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [history, setHistory] = useState([]);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(null);

  // Voice Chat State
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  
  const sessionPromiseRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const inputAudioContextRef = useRef(null);
  const outputAudioContextRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const audioSourceNodeRef = useRef(null); // for mic input
  const playbackSourcesRef = useRef(new Set());
  const nextPlaybackStartTimeRef = useRef(0);
  
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioSourceRef = useRef(null); // for TTS
  const SERVICE_ID = 'chat';
  
  const isGeminiConfigured = apiService.isModelConfigured('gemini');

  useEffect(() => {
    setChat(apiService.createChatSession());
    setMessages([{
        sender: 'model',
        text: 'Hello! How can I help you practice your English today? I can chat with you via text or voice.',
    }]);
    
    return () => {
        // Cleanup TTS audio
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }
        // Cleanup Live session
        if (isVoiceSessionActive) {
            stopVoiceSession();
        }
    };
  }, [isVoiceSessionActive]);

  useEffect(() => {
    if (currentUser) {
      setHistory(historyService.getHistory(currentUser.email, SERVICE_ID));
    } else {
      setHistory([]); // Clear history if user logs out
    }
  }, [currentUser]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
    }
  };

  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading) return;
    
    if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        setSpeakingMessageIndex(null);
    }

    const userMessage = { sender: 'user', text: messageText };
    if (file) {
        userMessage.file = file.name;
    }
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    const currentFile = file;
    setFile(null); 
    setIsLoading(true);

    try {
      const result = await apiService.sendChatMessage(chat, messageText, currentFile, useWebSearch);

      if (result.isStream) {
        let responseText = '';
        setMessages(prev => [...prev, { sender: 'model', text: '' }]);
        for await (const chunk of result.stream) {
          responseText += chunk.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = responseText;
            return newMessages;
          });
        }
        if (currentUser) {
            const historyItem = { user: messageText, model: responseText, file: currentFile ? currentFile.name : null, sources: [] };
            historyService.addHistoryItem(currentUser.email, SERVICE_ID, historyItem);
            setHistory(historyService.getHistory(currentUser.email, SERVICE_ID));
        }
      } else {
        const modelMessage = { sender: 'model', text: result.text, sources: result.sources };
        setMessages(prev => [...prev, modelMessage]);
        if (currentUser) {
            const historyItem = { user: messageText, model: result.text, file: currentFile ? currentFile.name : null, sources: result.sources };
            historyService.addHistoryItem(currentUser.email, SERVICE_ID, historyItem);
            setHistory(historyService.getHistory(currentUser.email, SERVICE_ID));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: 'model', text: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [chat, file, useWebSearch, isLoading, currentUser]);

  const handleListen = async (text, index) => {
    if (!text) return;
    if (speakingMessageIndex === index) {
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }
        setSpeakingMessageIndex(null);
        return;
    }

    if (audioSourceRef.current) {
        audioSourceRef.current.stop();
    }
    
    setSpeakingMessageIndex(index);
    setIsAudioLoading(index);

    try {
        const base64Audio = await apiService.generateSpeech(text);
        const audioData = decode(base64Audio);
        
        const ttsAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(audioData, ttsAudioContext, 24000, 1);
        const source = ttsAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ttsAudioContext.destination);
        
        source.onended = () => {
            if (speakingMessageIndex === index) {
                setSpeakingMessageIndex(null);
            }
            audioSourceRef.current = null;
            ttsAudioContext.close();
        };
        
        source.start(0);
        audioSourceRef.current = source;
    } catch (error) {
        console.error("Error playing speech:", error);
        alert(`Could not play audio: ${error.message}`);
        setSpeakingMessageIndex(null);
    } finally {
        setIsAudioLoading(null);
    }
  };
  
  const startVoiceSession = async () => {
    if (!isGeminiConfigured) return;
    try {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsVoiceSessionActive(true);

        inputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        nextPlaybackStartTimeRef.current = 0;
        
        const ai = new GoogleGenAI({ apiKey: window.process.env.API_KEY });
        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    audioSourceNodeRef.current = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                    scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromiseRef.current.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    audioSourceNodeRef.current.connect(scriptProcessorRef.current);
                    scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                },
                onmessage: async (message) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio) {
                        const audioData = decode(base64Audio);
                        nextPlaybackStartTimeRef.current = Math.max(nextPlaybackStartTimeRef.current, outputAudioContextRef.current.currentTime);
                        const audioBuffer = await decodeAudioData(audioData, outputAudioContextRef.current, 24000, 1);
                        const source = outputAudioContextRef.current.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContextRef.current.destination);
                        source.addEventListener('ended', () => playbackSourcesRef.current.delete(source));
                        source.start(nextPlaybackStartTimeRef.current);
                        nextPlaybackStartTimeRef.current += audioBuffer.duration;
                        playbackSourcesRef.current.add(source);
                    }
                    
                    if (message.serverContent?.interrupted) {
                        for (const source of playbackSourcesRef.current.values()) {
                            source.stop();
                        }
                        playbackSourcesRef.current.clear();
                        nextPlaybackStartTimeRef.current = 0;
                    }

                    if (message.serverContent?.inputTranscription) {
                        currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        setLiveTranscription(currentInputTranscriptionRef.current);
                    }
                    if (message.serverContent?.outputTranscription) {
                        currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                    }
                    if (message.serverContent?.turnComplete) {
                        const userInputText = currentInputTranscriptionRef.current.trim();
                        const modelOutputText = currentOutputTranscriptionRef.current.trim();
                        if (userInputText || modelOutputText) {
                            setMessages(prev => [...prev, 
                                { sender: 'user', text: userInputText },
                                { sender: 'model', text: modelOutputText }
                            ]);
                        }
                        currentInputTranscriptionRef.current = '';
                        currentOutputTranscriptionRef.current = '';
                        setLiveTranscription('');
                    }
                },
                onerror: (e) => console.error('Live session error:', e),
                onclose: () => console.log('Live session closed.'),
            },
            config: {
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                outputAudioTranscription: {},
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            },
        });

    } catch (error) {
        console.error("Failed to start voice session:", error);
        alert("Could not start voice session. Please ensure microphone access is granted.");
        setIsVoiceSessionActive(false);
    }
  };

  const stopVoiceSession = () => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
        sessionPromiseRef.current = null;
    }
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (audioSourceNodeRef.current) {
        audioSourceNodeRef.current.disconnect();
        audioSourceNodeRef.current = null;
    }
    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
    playbackSourcesRef.current.clear();
    setIsVoiceSessionActive(false);
    setLiveTranscription('');
  };

  const handleHistoryItemClick = (item) => {
      setChat(apiService.createChatSession());
      const newMessages = [
        { sender: 'user', text: item.user, file: item.file },
        { sender: 'model', text: item.model, sources: item.sources }
      ];
      setMessages(newMessages);
  };

  const handleClearHistory = () => {
    if (currentUser) {
        setHistory(historyService.clearHistory(currentUser.email, SERVICE_ID));
    }
  };

  const renderHistoryItem = (item) => (
    React.createElement('div', {
        key: item.id,
        onClick: () => handleHistoryItemClick(item),
        className: "p-3 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-blue-50"
      },
        React.createElement('p', { className: "text-sm font-semibold text-slate-600 truncate" }, item.user),
        React.createElement('p', { className: "text-xs text-slate-500 mt-1 truncate" }, item.model)
    )
  );

  return React.createElement('div', { className: "max-w-7xl mx-auto" },
    React.createElement('div', { className: "text-center mb-6" },
      React.createElement('h2', { className: "text-3xl font-bold text-slate-900" }, 'AI Conversation Practice'),
      React.createElement('p', { className: "text-slate-500 mt-2" }, 'Practice speaking and writing with an AI tutor.')
    ),
    React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" },
        React.createElement('div', { className: "lg:col-span-2 flex flex-col h-[calc(100vh-240px)]" },
            React.createElement('div', { className: "flex flex-col flex-grow bg-white rounded-2xl overflow-hidden border border-slate-200" },
            React.createElement('div', { ref: chatContainerRef, className: "flex-grow p-4 space-y-4 overflow-y-auto" },
                messages.map((msg, index) => (
                React.createElement('div', { key: index, className: `flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}` },
                    React.createElement('div', { className: `max-w-xl p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}` },
                        msg.file && React.createElement('div', {className: "text-xs italic opacity-80 mb-1 border-b border-slate-300 pb-1"}, `Attached: ${msg.file}`),
                        React.createElement('div', { className: 'flex items-start justify-between gap-3' },
                            React.createElement('p', { className: "whitespace-pre-wrap flex-grow" }, msg.text),
                            msg.sender === 'model' && msg.text && React.createElement('button', {
                                onClick: () => handleListen(msg.text, index),
                                className: `flex-shrink-0 h-7 w-7 flex items-center justify-center bg-black/5 rounded-full hover:bg-black/10`
                            }, isAudioLoading === index 
                                ? React.createElement(Spinner, { size: "4" }) 
                                : speakingMessageIndex === index 
                                    ? React.createElement(StopIcon, {className: "h-4 w-4"}) 
                                    : React.createElement(SpeakerIcon, {className: "h-4 w-4"})
                            )
                        ),
                        msg.sources && msg.sources.length > 0 && (
                            React.createElement('div', { className: "mt-3 pt-2 border-t border-slate-300" },
                            React.createElement('h4', { className: "font-semibold text-sm mb-1" }, 'Sources'),
                            React.createElement('div', { className: "flex flex-wrap gap-2" },
                                msg.sources.map((source, i) => (
                                React.createElement('a', { key: i, href: source.web?.uri, target: "_blank", rel: "noopener noreferrer", className: "text-xs bg-black/10 hover:bg-black/20 py-1 px-2 rounded-full transition-colors truncate" },
                                    source.web?.title || (source.web?.uri && new URL(source.web.uri).hostname)
                                )
                                ))
                            )
                            )
                        )
                    )
                )
                )),
                isLoading && (
                React.createElement('div', { className: "flex justify-start" },
                    React.createElement('div', { className: "bg-slate-200 p-3 rounded-2xl flex items-center space-x-2" },
                    React.createElement(Spinner, { size: "5" }),
                    React.createElement('span', { className: "text-slate-500" }, 'Thinking...')
                    )
                )
                )
            ),
            React.createElement('div', { className: "p-4 border-t border-slate-200" },
                !isGeminiConfigured && React.createElement('div', { className: "text-center bg-red-500/10 p-2 rounded-md mb-2 text-xs text-red-600 font-semibold" },
                    'API key for Google Gemini is not configured. Some features may not work.'.replace('{modelName}', 'Google Gemini')
                ),
                file && !isVoiceSessionActive && React.createElement('div', { className: "flex items-center justify-between bg-slate-200 text-sm py-1 px-3 rounded-md mb-2" },
                    React.createElement('span', { className: "truncate" }, file.name),
                    React.createElement('button', { onClick: () => setFile(null) }, React.createElement(CloseIcon, { className: "h-4 w-4" }))
                ),
                
                isVoiceSessionActive ? 
                React.createElement('div', { className: "flex items-center justify-between bg-slate-200 rounded-full p-2" },
                    React.createElement('div', { className: 'text-sm text-slate-600 flex-grow px-2 truncate'},
                        liveTranscription ? React.createElement('span', { className: 'italic' }, liveTranscription) : "Listening..."
                    ),
                    React.createElement('button', {
                        onClick: stopVoiceSession,
                        className: "h-8 w-8 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-500 text-white animate-pulse"
                    }, React.createElement(StopIcon, { className: "h-5 w-5" }))
                )
                :
                React.createElement(React.Fragment, null,
                    React.createElement('div', { className: `relative flex items-center` },
                        React.createElement('button', {
                            onClick: startVoiceSession,
                            disabled: !isGeminiConfigured,
                            className: `absolute h-8 w-8 flex items-center justify-center disabled:opacity-50 left-2`
                        }, React.createElement(MicrophoneIcon, { className: 'text-slate-500' })),
                        React.createElement('input', {
                            type: "text", value: userInput, onChange: (e) => setUserInput(e.target.value),
                            onKeyDown: (e) => e.key === 'Enter' && handleSendMessage(userInput), placeholder: 'Ask me anything...',
                            className: "w-full bg-white border border-slate-300 rounded-full py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all",
                            style: { paddingLeft: '3.5rem', paddingRight: '3.5rem' },
                            disabled: isLoading || !isGeminiConfigured
                        }),
                        React.createElement('button', {
                            onClick: () => handleSendMessage(userInput), disabled: !userInput.trim() || isLoading || !isGeminiConfigured,
                            className: `absolute h-8 w-8 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all right-2`
                        }, React.createElement(SendIcon, null))
                    ),
                    React.createElement('div', { className: `flex items-center justify-between mt-2 px-2` },
                        React.createElement('button', { onClick: () => fileInputRef.current?.click(), className: "flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"},
                            React.createElement(AttachIcon, { className: "h-5 w-5"}), 'Attach File'
                        ),
                        React.createElement('input', { type: "file", ref: fileInputRef, onChange: handleFileChange, className: "hidden" }),
                        React.createElement('div', { className: 'flex items-center gap-2' },
                            React.createElement('label', { htmlFor: "web-search", className: 'text-sm text-slate-500 cursor-pointer' }, 'Search Web'),
                            React.createElement('input', { type: "checkbox", id: "web-search", checked: useWebSearch, onChange: (e) => setUseWebSearch(e.target.checked),
                                className: "w-4 h-4 rounded text-red-600 bg-slate-200 border-slate-300 focus:ring-red-600"
                            })
                        )
                    )
                )
            )
            )
        ),
        React.createElement('div', { className: "h-[calc(100vh-240px)]" },
            currentUser ?
            React.createElement(HistoryPanel, {
                title: 'Chat History',
                items: history,
                renderItem: renderHistoryItem,
                onClear: handleClearHistory
            }) :
             React.createElement('div', { className: "flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200" },
                React.createElement('div', { className: "p-4 border-b border-slate-200 flex justify-between items-center" },
                    React.createElement('h3', { className: "text-lg font-semibold text-slate-900" }, 'Chat History')
                ),
                React.createElement('div', { className: "flex-grow p-4 flex flex-col items-center justify-center text-center" },
                    React.createElement(UserIcon, { className: "w-12 h-12 text-slate-300 mb-4" }),
                    React.createElement('p', { className: "text-slate-500 font-semibold" }, 'Login to Save History'),
                    React.createElement('p', { className: "text-sm text-slate-400 mt-1" }, 'Your conversation history will appear here.')
                )
            )
        )
    )
  );
};

export default AILanguageTutorPractice;