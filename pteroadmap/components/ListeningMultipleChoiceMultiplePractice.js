import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateListeningMultipleChoiceMultipleQuestion } from '../services/geminiService.js';
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


const ListeningMultipleChoiceMultiplePractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [questionData, setQuestionData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
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
        setSelectedAnswers([]);
        setIsSubmitted(false);
        setScore(0);
        try {
            const data = await generateListeningMultipleChoiceMultipleQuestion();
            setQuestionData(data);

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioBytes = decode(data.audioBase64);
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
    
    const handleAnswerChange = (option) => {
        setSelectedAnswers(prev => 
            prev.includes(option) 
                ? prev.filter(item => item !== option) 
                : [...prev, option]
        );
    };

    const handleSubmit = () => {
        if (!questionData) return;
        let currentScore = 0;
        const correctAnswers = questionData.correctAnswers;
        
        selectedAnswers.forEach(answer => {
            if (correctAnswers.includes(answer)) {
                currentScore++;
            } else {
                currentScore--;
            }
        });

        setScore(Math.max(0, currentScore)); // Score cannot be negative
        setIsSubmitted(true);
    };

    const renderOptions = () => {
        if (!questionData) return null;

        return questionData.options.map((option, index) => {
            const isSelected = selectedAnswers.includes(option);
            const isCorrect = questionData.correctAnswers.includes(option);
            
            let labelClass = "flex items-center p-4 rounded-lg border cursor-pointer transition-colors duration-150 ";
            if (isSubmitted) {
                 if (isCorrect) {
                    labelClass += "bg-green-100 border-green-400";
                 } else if (isSelected && !isCorrect) {
                    labelClass += "bg-red-100 border-red-400";
                 } else {
                    labelClass += "bg-white border-gray-300";
                 }
            } else {
                labelClass += isSelected ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300 hover:bg-gray-50";
            }

            return React.createElement('label', { key: index, className: labelClass },
                React.createElement('input', {
                    type: 'checkbox',
                    name: 'mcq-option',
                    checked: isSelected,
                    onChange: () => handleAnswerChange(option),
                    disabled: isSubmitted,
                    className: 'h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                }),
                React.createElement('span', { className: 'ml-3 text-gray-800' }, option)
            );
        });
    };
    
    const renderResult = () => {
        if (!isSubmitted || !questionData) return null;
        const maxScore = questionData.correctAnswers.length;
        
        return React.createElement('div', { className: "mt-8 bg-white p-6 rounded-xl shadow-lg text-center animate-fade-in" },
            React.createElement('h2', { className: "text-2xl font-bold text-gray-800" }, "Results"),
            React.createElement('p', { className: "mt-2 text-xl text-gray-700" }, 
                "You scored ", 
                React.createElement('strong', {className: "text-blue-600"}, score), 
                " out of ", 
                React.createElement('strong', {className: "text-blue-600"}, maxScore),
                " possible points."
            ),
             React.createElement('div', { className: "mt-4 text-left bg-gray-50 p-4 rounded-lg" },
                React.createElement('h3', { className: "font-semibold mb-2 text-gray-800" }, "Correct Answers:"),
                React.createElement('ul', { className: "list-disc list-inside space-y-1 text-green-700" },
                    questionData.correctAnswers.map((answer, index) => React.createElement('li', { key: `ans-${index}` }, 
                        React.createElement('strong', null, answer)
                    ))
                )
            )
        );
    };

    return React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Multiple Choices, Multiple Answers'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'Listen to the recording and answer the question by selecting all the correct responses.'),
        
        React.createElement('div', { className: "mt-6 bg-white p-8 rounded-xl shadow-lg" },
            isLoading ? (
                React.createElement('div', { className: "flex justify-center items-center h-60" },
                    React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
                )
            ) : error ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : questionData && (
                React.createElement(React.Fragment, null,
                     React.createElement('div', { className: "flex justify-center mb-6" },
                        React.createElement('button', { 
                            onClick: playAudio, 
                            disabled: isPlaying || !audioBufferRef.current,
                            className: "flex items-center space-x-3 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        },
                            React.createElement(PlayCircleIcon, { className: "w-8 h-8" }),
                            React.createElement('span', { className: "text-lg font-semibold" }, isPlaying ? 'Playing...' : 'Play Audio')
                        )
                    ),
                    React.createElement('div', { className: "mt-6 pt-6 border-t" },
                        React.createElement('p', { className: 'text-lg font-semibold text-gray-800 mb-4' }, questionData.question),
                        React.createElement('div', { className: "space-y-3" },
                            renderOptions()
                        )
                    )
                )
            )
        ),
        
        React.createElement('div', { className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-4" },
             React.createElement('button', {
                onClick: handleSubmit,
                disabled: isLoading || isSubmitted || selectedAnswers.length === 0,
                className: "w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
            }, 'Check Answers'),
            React.createElement('button', {
                onClick: fetchNewQuestion,
                disabled: isLoading,
                className: "w-full sm:w-auto p-3 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors",
                'aria-label': "Next Question"
            }, React.createElement(RefreshIcon, { className: "w-6 h-6" }))
        ),
        
        renderResult()
    );
};

export default ListeningMultipleChoiceMultiplePractice;