import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateHighlightIncorrectWordsQuestion } from '../services/geminiService.js';
import { BackIcon, RefreshIcon, PlayCircleIcon } from './icons.js';

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


const HighlightIncorrectWordsPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [questionData, setQuestionData] = useState(null);
    const [selectedWords, setSelectedWords] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
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
        setSelectedWords([]);
        setIsSubmitted(false);
        setScore(0);
        try {
            const data = await generateHighlightIncorrectWordsQuestion();
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
    
    const handleWordClick = (word, index) => {
        if (isSubmitted) return;
        const wordIdentifier = `${word}-${index}`;
        setSelectedWords(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(wordIdentifier)) {
                newSelected.delete(wordIdentifier);
            } else {
                newSelected.add(wordIdentifier);
            }
            return Array.from(newSelected);
        });
    };

    const handleSubmit = () => {
        if (!questionData) return;
        let currentScore = 0;
        const correctWords = new Set(questionData.incorrectWords);
        
        const selected = selectedWords.map(w => w.split('-')[0]);

        selected.forEach(word => {
            if (correctWords.has(word)) {
                currentScore++;
            } else {
                currentScore--;
            }
        });

        setScore(Math.max(0, currentScore));
        setIsSubmitted(true);
    };

    const renderTranscript = () => {
        if (!questionData) return null;
        return questionData.displayedTranscript.split(/(\s+)/).map((word, index) => {
            if (word.trim() === '') return React.createElement('span', { key: index }, word); // Preserve spaces
            const wordIdentifier = `${word.replace(/[.,]/g, '')}-${index}`;
            const isSelected = selectedWords.includes(wordIdentifier);
            const isCorrect = questionData.incorrectWords.includes(word.replace(/[.,]/g, ''));
            
            let wordClass = "cursor-pointer rounded-md px-1 py-0.5 transition-colors ";
            if (isSubmitted) {
                if (isCorrect) wordClass += "bg-green-200 text-green-800";
                else if (isSelected && !isCorrect) wordClass += "bg-red-200 text-red-800 line-through";
            } else {
                wordClass += isSelected ? "bg-yellow-300" : "hover:bg-yellow-100";
            }

            return React.createElement('span', { key: index, onClick: () => handleWordClick(word.replace(/[.,]/g, ''), index), className: wordClass }, word);
        });
    };

    return React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }), 'Back'
        ),
        React.createElement('h1', { className: "text-3xl font-bold" }, 'Highlight Incorrect Words'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'Listen to the recording and identify the words in the text that are different.'),
        
        React.createElement('div', { className: "mt-6 bg-white p-8 rounded-xl shadow-lg" },
            isLoading ? React.createElement('div', { className: "flex justify-center items-center h-40" }, React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }))
            : error ? React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            : React.createElement(React.Fragment, null,
                 React.createElement('div', { className: "flex justify-center mb-6" },
                    React.createElement('button', { onClick: playAudio, disabled: isPlaying, className: "flex items-center space-x-3 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 disabled:bg-gray-400" },
                        React.createElement(PlayCircleIcon, { className: "w-8 h-8" }),
                        React.createElement('span', { className: "text-lg font-semibold" }, isPlaying ? 'Playing...' : 'Play Audio')
                    )
                ),
                React.createElement('div', { className: "mt-6 pt-6 border-t text-lg leading-relaxed" }, renderTranscript())
            )
        ),
        React.createElement('div', { className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-4" },
             React.createElement('button', { onClick: handleSubmit, disabled: isLoading || isSubmitted, className: "w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed" }, 'Check Answers'),
             React.createElement('button', { onClick: fetchNewQuestion, disabled: isLoading, className: "w-full sm:w-auto p-3 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 disabled:bg-gray-400", 'aria-label': "Next" }, React.createElement(RefreshIcon, { className: "w-6 h-6" }))
        ),
        isSubmitted && questionData && React.createElement('div', { className: "mt-8 bg-white p-6 rounded-xl shadow-lg text-center animate-fade-in" },
            React.createElement('h2', { className: "text-2xl font-bold" }, "Results"),
            React.createElement('p', { className: "mt-2 text-xl" }, `You scored ${score} out of ${questionData.incorrectWords.length} possible points.`)
        )
    );
};

export default HighlightIncorrectWordsPractice;