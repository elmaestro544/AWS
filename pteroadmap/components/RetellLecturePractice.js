import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateRetellLectureQuestion, scoreRetellLectureAttempt } from '../services/geminiService.js';
import { BackIcon, MicrophoneIcon, StopIcon, PlayCircleIcon, RefreshIcon } from './icons.js';
import ScoreDisplay from './ScoreDisplay.js';

const decode = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

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

const RetellLecturePractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPreparing, setIsPreparing] = useState(false);
    const [prepTimeLeft, setPrepTimeLeft] = useState(10);
    const [questionTranscript, setQuestionTranscript] = useState('');
    const [userAudioURL, setUserAudioURL] = useState(null);
    const [score, setScore] = useState(null);
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const prepTimerRef = useRef(null);

    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const activeSourceRef = useRef(null);


    const cleanup = () => {
        if (activeSourceRef.current) {
            try { activeSourceRef.current.stop(); } catch(e) {}
        }
        clearInterval(prepTimerRef.current);
    };

    const fetchNewQuestion = useCallback(async () => {
        cleanup();
        setIsLoading(true);
        setError(null);
        setScore(null);
        setUserAudioURL(null);
        audioBufferRef.current = null;
        setQuestionTranscript('');
        setIsPlaying(false);
        setIsPreparing(false);
        setIsRecording(false);
        setPrepTimeLeft(10);
        try {
            const { transcript, audioBase64 } = await generateRetellLectureQuestion();
            setQuestionTranscript(transcript);
            
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioBytes = decode(audioBase64);
            const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            audioBufferRef.current = buffer;

        } catch (err) {
            setError('Failed to fetch a new question. Please check your API key and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNewQuestion();
        return () => {
            cleanup();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [fetchNewQuestion]);
    
    useEffect(() => {
        if (isPreparing) {
            setPrepTimeLeft(10);
            prepTimerRef.current = setInterval(() => {
                setPrepTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(prepTimerRef.current);
                        setIsPreparing(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(prepTimerRef.current);
    }, [isPreparing]);

    const playQuestionAudio = () => {
        if (activeSourceRef.current) {
            activeSourceRef.current.stop();
        }
        if (audioBufferRef.current && audioContextRef.current && !isPlaying && !isPreparing && !isRecording) {
            setScore(null);
            setUserAudioURL(null);
            
            const source = audioContextRef.current.createBufferSource();
            activeSourceRef.current = source;
            source.buffer = audioBufferRef.current;
            source.connect(audioContextRef.current.destination);
            source.onended = () => {
                setIsPlaying(false);
                setIsPreparing(true);
                activeSourceRef.current = null;
            };
            source.start();
            setIsPlaying(true);
        }
    };

    const handleStartRecording = async () => {
        if (isRecording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setUserAudioURL(url);
                audioChunksRef.current = [];
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setScore(null);
        } catch (err) {
            setError('Microphone access was denied. Please allow microphone access in your browser settings.');
            console.error('Error starting recording:', err);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSubmit = async () => {
        if (!userAudioURL) {
            setError('Please record your response before submitting.');
            return;
        }
        setIsAnalyzing(true);
        setError(null);
        setScore(null);
        try {
            const analysis = await scoreRetellLectureAttempt();
            setScore(analysis);
        } catch (err) {
            setError('Failed to analyze the recording. The AI model might be busy. Please try again.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderScore = () => {
        if (!score) return null;
        const scoreItems = [
            { label: "Content", value: score.content, maxValue: 5 },
            { label: "Pronunciation", value: score.pronunciation, maxValue: 5 },
            { label: "Fluency", value: score.fluency, maxValue: 5 }
        ];
        return React.createElement('div', { className: "mt-10" },
            React.createElement(ScoreDisplay, { scoreItems: scoreItems, feedback: score.feedback })
        );
    };

    const getStatusText = () => {
        if (isPlaying) return "Listen to the lecture carefully...";
        if (isPreparing) return `Prepare your response... ${prepTimeLeft}s`;
        if (isRecording) return "Recording your response... (Max 40s)";
        if (score) return "Review your score and the transcript below.";
        if (userAudioURL) return "Your recording is ready. Submit it for scoring.";
        return "Click 'Play Lecture' to begin.";
    };

    return React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Re-tell Lecture'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'You will hear a lecture. After the lecture, you have 10 seconds to prepare, and then 40 seconds to retell the lecture in your own words.'),
        
        React.createElement('div', { className: "mt-6 bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[150px]" },
            isLoading ? (
                React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
            ) : error ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : (
                React.createElement(React.Fragment, null,
                    React.createElement('p', { className: "text-lg font-semibold text-gray-700 mb-4" }, getStatusText()),
                    React.createElement('button', { 
                        onClick: playQuestionAudio, 
                        disabled: isPlaying || isPreparing || isRecording || isLoading, 
                        className: "flex items-center space-x-3 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed" },
                        React.createElement(PlayCircleIcon, { className: "w-8 h-8" }),
                        React.createElement('span', { className: "text-lg font-semibold" }, 'Play Lecture')
                    )
                )
            )
        ),

        React.createElement('div', { className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-4" },
            React.createElement('button', {
                onClick: isRecording ? handleStopRecording : handleStartRecording,
                disabled: isPlaying || isPreparing || isLoading,
                className: `flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base font-semibold text-white rounded-lg shadow-md transition-transform transform hover:scale-105 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} disabled:bg-gray-400 disabled:cursor-not-allowed`
            },
                isRecording ? React.createElement(StopIcon, { className: "w-6 h-6 mr-2" }) : React.createElement(MicrophoneIcon, { className: "w-6 h-6 mr-2" }),
                isRecording ? 'Stop Recording' : 'Start Recording'
            ),
            React.createElement('button', {
                onClick: handleSubmit,
                disabled: !userAudioURL || isAnalyzing || isRecording,
                className: "w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
            }, isAnalyzing ? 'Analyzing...' : 'Get Score'),
            React.createElement('button', {
                onClick: fetchNewQuestion,
                disabled: isLoading || isAnalyzing || isRecording,
                className: "w-full sm:w-auto p-3 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors",
                'aria-label': "Next Question"
            }, React.createElement(RefreshIcon, { className: "w-6 h-6" }))
        ),

        userAudioURL && (
            React.createElement('div', { className: "mt-4 flex justify-center" },
                React.createElement('audio', { controls: true, src: userAudioURL, className: "w-full max-w-sm" })
            )
        ),
        
        isAnalyzing && (
            React.createElement('div', { className: "flex justify-center items-center mt-8" },
                React.createElement('div', { className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" }),
                React.createElement('p', { className: "ml-4 text-gray-600" }, 'AI is analyzing your response...')
            )
        ),

        !isAnalyzing && score && (
            React.createElement('div', null,
                renderScore(),
                React.createElement('div', { className: "mt-8 bg-gray-100 p-6 rounded-lg" },
                    React.createElement('h3', { className: "font-semibold text-gray-800 text-lg mb-2" }, 'Original Lecture Transcript:'),
                    React.createElement('p', { className: "text-gray-700 italic leading-relaxed" }, questionTranscript)
                )
            )
        )
    );
};

export default RetellLecturePractice;