import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateSummarizeSpokenTextQuestion, scoreSummarizeSpokenTextAttempt } from '../services/geminiService.js';
import { BackIcon, RefreshIcon, PlayCircleIcon } from './icons.js';
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


const SummarizeSpokenTextPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [questionData, setQuestionData] = useState({ transcript: '' });
    const [userSummary, setUserSummary] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [score, setScore] = useState(null);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const timerRef = useRef(null);
    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const activeSourceRef = useRef(null);

    const startTimer = () => {
        if (isTimerRunning) return;
        setIsTimerRunning(true);
        timerRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    setIsTimerRunning(false);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const resetTimer = () => {
        clearInterval(timerRef.current);
        setTimeLeft(10 * 60);
        setIsTimerRunning(false);
    };

    const cleanup = () => {
        if (activeSourceRef.current) {
            try { activeSourceRef.current.stop(); } catch(e) {}
        }
        clearInterval(timerRef.current);
    };

    const fetchNewQuestion = useCallback(async () => {
        cleanup();
        setIsLoading(true);
        setError(null);
        setScore(null);
        setUserSummary('');
        setWordCount(0);
        resetTimer();
        try {
            const { transcript, audioBase64 } = await generateSummarizeSpokenTextQuestion();
            setQuestionData({ transcript });
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
            if(audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [fetchNewQuestion]);
    
    const playAudio = () => {
        if (activeSourceRef.current) {
            activeSourceRef.current.stop();
        }
        if (audioBufferRef.current && audioContextRef.current && !isPlaying) {
            startTimer();
            const source = audioContextRef.current.createBufferSource();
            activeSourceRef.current = source;
            source.buffer = audioBufferRef.current;
            source.connect(audioContextRef.current.destination);
            source.onended = () => {
                setIsPlaying(false);
                activeSourceRef.current = null;
            };
            source.start();
            setIsPlaying(true);
        }
    };
    
    const handleSummaryChange = (e) => {
        const text = e.target.value;
        setUserSummary(text);
        const words = text.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
    };

    const handleSubmit = async () => {
        if (wordCount < 1) {
            setError('Please write your summary before submitting.');
            return;
        }
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
        setIsAnalyzing(true);
        setError(null);
        setScore(null);
        try {
            const analysis = await scoreSummarizeSpokenTextAttempt(userSummary, questionData.transcript);
            setScore(analysis);
        } catch (err) {
            setError('Failed to analyze your summary. The AI model might be busy. Please try again.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderScore = () => {
        if (!score) return null;
        const scoreItems = [
            { label: "Content", value: score.content, maxValue: 2 },
            { label: "Form", value: score.form, maxValue: 2 },
            { label: "Grammar", value: score.grammar, maxValue: 2 },
            { label: "Vocabulary", value: score.vocabulary, maxValue: 2 },
            { label: "Spelling", value: score.spelling, maxValue: 2 }
        ];
        return React.createElement('div', { className: "mt-10" },
            React.createElement(ScoreDisplay, { scoreItems: scoreItems, feedback: score.feedback })
        );
    };
    
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Summarize Spoken Text'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'You will hear a short lecture. Write a summary for a fellow student who was not present at the lecture. You should write 50-70 words. You have 10 minutes for this task.'),
        
        React.createElement('div', { className: "mt-6 bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[150px]" },
            isLoading ? (
                React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
            ) : error && !audioBufferRef.current ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : (
                 React.createElement('button', { 
                    onClick: playAudio, 
                    disabled: isPlaying || !audioBufferRef.current,
                    className: "flex items-center space-x-3 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                },
                    React.createElement(PlayCircleIcon, { className: "w-8 h-8" }),
                    React.createElement('span', { className: "text-lg font-semibold" }, isPlaying ? 'Playing Lecture...' : 'Play Lecture')
                )
            )
        ),

        React.createElement('div', { className: "mt-6" },
             React.createElement('div', { className: "flex justify-between items-center mb-2" },
                React.createElement('div', { className: "text-lg font-bold text-gray-700" }, `Time Left: ${formatTime(timeLeft)}`),
                React.createElement('div', { className: `text-sm font-medium ${wordCount < 50 || wordCount > 70 ? 'text-red-500' : 'text-green-600'}` },
                    `Word Count: ${wordCount}`
                )
            ),
            React.createElement('textarea', {
                value: userSummary,
                onChange: handleSummaryChange,
                className: "w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow min-h-[150px]",
                placeholder: "Start writing your summary here after listening...",
                disabled: isLoading || isAnalyzing || timeLeft === 0
            })
        ),

        React.createElement('div', { className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-4" },
             React.createElement('button', {
                onClick: handleSubmit,
                disabled: !userSummary || isAnalyzing || isLoading || timeLeft === 0,
                className: "w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
            }, isAnalyzing ? 'Analyzing...' : 'Submit & Get Score'),
            React.createElement('button', {
                onClick: fetchNewQuestion,
                disabled: isLoading || isAnalyzing,
                className: "w-full sm:w-auto p-3 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors",
                'aria-label': "Next Question"
            }, React.createElement(RefreshIcon, { className: "w-6 h-6" }))
        ),
        
        error && audioBufferRef.current && (
             React.createElement('div', { className: "mt-4 text-center text-red-600" }, error)
        ),
        
        isAnalyzing && (
            React.createElement('div', { className: "flex justify-center items-center mt-8" },
                React.createElement('div', { className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" }),
                React.createElement('p', { className: "ml-4 text-gray-600" }, 'AI is analyzing your summary...')
            )
        ),
        
        !isAnalyzing && renderScore()
    );
};

export default SummarizeSpokenTextPractice;