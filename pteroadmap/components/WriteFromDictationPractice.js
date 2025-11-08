import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateWriteFromDictationQuestion, scoreWriteFromDictationAttempt } from '../services/geminiService.js';
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


const WriteFromDictationPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [questionData, setQuestionData] = useState(null);
    const [userSentence, setUserSentence] = useState('');
    const [score, setScore] = useState(null);
    const [error, setError] = useState(null);

    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const activeSourceRef = useRef(null);

    const cleanup = () => {
        if (activeSourceRef.current) {
            try { activeSourceRef.current.stop(); } catch(e) {}
        }
    };

    const fetchNewQuestion = useCallback(async () => {
        cleanup();
        setIsLoading(true);
        setError(null);
        setQuestionData(null);
        setUserSentence('');
        setScore(null);
        try {
            const data = await generateWriteFromDictationQuestion();
            setQuestionData(data);
             if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioBytes = decode(data.audioBase64);
            const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            audioBufferRef.current = buffer;
        } catch (err) {
            setError('Failed to fetch a new question. Please try again.');
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
    
    const playAudio = () => {
        if (activeSourceRef.current) {
            activeSourceRef.current.stop();
        }
        if (audioBufferRef.current && audioContextRef.current && !isPlaying) {
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
    
    const handleSubmit = async () => {
        if (!userSentence || !questionData) return;
        setIsAnalyzing(true);
        setError(null);
        setScore(null);
        try {
            const analysis = await scoreWriteFromDictationAttempt(questionData.sentence, userSentence);
            setScore(analysis);
        } catch (err) {
            setError('Failed to analyze your sentence. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderScore = () => {
        if (!score) return null;
        const scoreItems = [{ label: "Accuracy", value: score.score, maxValue: score.maxScore }];
        return React.createElement('div', { className: 'mt-10' },
            React.createElement(ScoreDisplay, { scoreItems: scoreItems, feedback: score.feedback }),
            React.createElement('div', { className: 'mt-4 bg-gray-100 p-4 rounded-lg' },
                React.createElement('h4', { className: 'font-semibold' }, 'Correct Sentence:'),
                React.createElement('p', { className: 'text-green-700 italic' }, questionData.sentence)
            )
        );
    };

    return React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }), 'Back'
        ),
        React.createElement('h1', { className: "text-3xl font-bold" }, 'Write From Dictation'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'You will hear a sentence. Type the sentence in the box below exactly as you hear it.'),
        
        React.createElement('div', { className: "mt-6 bg-white p-8 rounded-xl shadow-lg" },
            isLoading ? React.createElement('div', { className: "flex justify-center items-center h-20" }, React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }))
            : error ? React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            : React.createElement('div', { className: "flex justify-center" },
                React.createElement('button', { onClick: playAudio, disabled: isPlaying, className: "flex items-center space-x-3 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 disabled:bg-gray-400" },
                    React.createElement(PlayCircleIcon, { className: "w-8 h-8" }),
                    React.createElement('span', { className: "text-lg font-semibold" }, isPlaying ? 'Playing...' : 'Play Sentence')
                )
            )
        ),
        React.createElement('div', { className: 'mt-6' },
            React.createElement('textarea', {
                value: userSentence,
                onChange: (e) => setUserSentence(e.target.value),
                className: 'w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
                rows: '3',
                placeholder: 'Type the sentence here...',
                disabled: isLoading || isAnalyzing
            })
        ),
        React.createElement('div', { className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-4" },
             React.createElement('button', { onClick: handleSubmit, disabled: isLoading || isAnalyzing || !userSentence, className: "w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed" }, isAnalyzing ? 'Analyzing...' : 'Get Score'),
             React.createElement('button', { onClick: fetchNewQuestion, disabled: isLoading || isAnalyzing, className: "w-full sm:w-auto p-3 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 disabled:bg-gray-400", 'aria-label': "Next" }, React.createElement(RefreshIcon, { className: "w-6 h-6" }))
        ),
        isAnalyzing && React.createElement('div', { className: 'flex justify-center items-center mt-8' },
            React.createElement('div', { className: 'animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500' }),
            React.createElement('p', { className: 'ml-4 text-gray-600' }, 'AI is analyzing your sentence...')
        ),
        !isAnalyzing && renderScore()
    );
};

export default WriteFromDictationPractice;