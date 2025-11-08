import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateFillInBlanksListeningQuestion } from '../services/geminiService.js';
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

const FillInBlanksListeningPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [questionData, setQuestionData] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
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
        setUserAnswers({});
        setIsSubmitted(false);
        setScore(0);
        try {
            const data = await generateFillInBlanksListeningQuestion();
            setQuestionData(data);

            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioBytes = decode(data.audioBase64);
            const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            audioBufferRef.current = buffer;
            
            const initialAnswers = {};
            for (let i = 0; i < data.correctAnswers.length; i++) {
                initialAnswers[i] = '';
            }
            setUserAnswers(initialAnswers);

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

    const handleAnswerChange = (index, value) => {
        setUserAnswers(prev => ({ ...prev, [index]: value }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questionData.correctAnswers.forEach((correctAnswer, index) => {
            if (userAnswers[index] && userAnswers[index].trim().toLowerCase() === correctAnswer.toLowerCase()) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setIsSubmitted(true);
    };

    const renderPassageWithBlanks = () => {
        if (!questionData) return null;

        const parts = questionData.gappedText.split('{{BLANK}}');
        const elements = [];
        
        parts.forEach((part, index) => {
            elements.push(React.createElement('span', { key: `part-${index}` }, part));
            if (index < parts.length - 1) {
                const isCorrect = isSubmitted && userAnswers[index] && userAnswers[index].trim().toLowerCase() === questionData.correctAnswers[index].toLowerCase();
                const isIncorrect = isSubmitted && userAnswers[index] && userAnswers[index].trim().toLowerCase() !== questionData.correctAnswers[index].toLowerCase();
                
                let inputClassName = "mx-1 py-1 px-2 border-b-2 focus:outline-none focus:border-blue-500 transition-colors";
                if (isSubmitted) {
                    if (isCorrect) inputClassName += " bg-green-100 border-green-500";
                    else if (isIncorrect) inputClassName += " bg-red-100 border-red-500";
                    else inputClassName += " bg-gray-100 border-gray-400";
                } else {
                    inputClassName += " border-gray-300";
                }

                elements.push(
                    React.createElement('input', {
                        key: `blank-${index}`,
                        type: 'text',
                        value: userAnswers[index] || '',
                        onChange: (e) => handleAnswerChange(index, e.target.value),
                        disabled: isSubmitted,
                        className: inputClassName,
                        style: { width: `${Math.max(questionData.correctAnswers[index].length * 10, 80)}px`},
                        'aria-label': `Blank number ${index + 1}`
                    })
                );
            }
        });
        return elements;
    };
    
    const renderResult = () => {
        if (!isSubmitted || !questionData) return null;
        const totalBlanks = questionData.correctAnswers.length;
        return React.createElement('div', { className: "mt-8 bg-white p-6 rounded-xl shadow-lg text-center animate-fade-in" },
            React.createElement('h2', { className: "text-2xl font-bold text-gray-800" }, "Results"),
            React.createElement('p', { className: "mt-2 text-xl text-gray-700" }, 
                "You answered ", 
                React.createElement('strong', {className: "text-blue-600"}, score), 
                " out of ", 
                React.createElement('strong', {className: "text-blue-600"}, totalBlanks), 
                " blanks correctly."
            ),
             React.createElement('div', { className: "mt-4 text-left bg-gray-50 p-4 rounded-lg" },
                React.createElement('h3', { className: "font-semibold mb-2 text-gray-800" }, "Correct Answers:"),
                React.createElement('ul', { className: "list-disc list-inside space-y-1 text-gray-700" },
                    questionData.correctAnswers.map((answer, index) => React.createElement('li', { key: `ans-${index}` }, 
                        `Blank ${index + 1}: `,
                        React.createElement('strong', { className: "text-green-700" }, answer)
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
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Fill in the Blanks'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'You will hear a recording. Type the missing words in each blank.'),
        
        React.createElement('div', { className: "mt-6 bg-white p-8 rounded-xl shadow-lg" },
            isLoading ? (
                React.createElement('div', { className: "flex justify-center items-center h-60" },
                    React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
                )
            ) : error ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : (
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
                    React.createElement('div', { className: "text-lg text-gray-800 leading-loose" }, 
                        renderPassageWithBlanks()
                    )
                )
            )
        ),
        
        React.createElement('div', { className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-4" },
             React.createElement('button', {
                onClick: handleSubmit,
                disabled: isLoading || isSubmitted,
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

export default FillInBlanksListeningPractice;