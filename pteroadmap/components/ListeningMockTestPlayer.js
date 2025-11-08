import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateListeningMockTestSet } from '../services/geminiService.js';
import { PlayCircleIcon } from './icons.js';

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


const AudioPlayer = ({ audioBase64 }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef(null);
    const audioBufferRef = useRef(null);
    const sourceRef = useRef(null);

    useEffect(() => {
        if (!audioBase64) return;

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        }
        
        let isActive = true;

        const setupAudio = async () => {
            try {
                const audioBytes = decode(audioBase64);
                const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
                if (isActive) {
                    audioBufferRef.current = buffer;
                }
            } catch(e) {
                console.error("Error decoding audio data", e);
            }
        };

        setupAudio();

        return () => {
            isActive = false;
            if (sourceRef.current) {
                try { sourceRef.current.stop(); } catch(e) {}
            }
        };
    }, [audioBase64]);

    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        }
    }, []);

    const playAudio = () => {
        if (sourceRef.current) {
            sourceRef.current.stop();
        }
        if (audioBufferRef.current && audioContextRef.current && !isPlaying) {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBufferRef.current;
            source.connect(audioContextRef.current.destination);
            source.onended = () => {
                setIsPlaying(false);
                sourceRef.current = null;
            };
            source.start();
            sourceRef.current = source;
            setIsPlaying(true);
        }
    };

    return (
        React.createElement('div', { className: "flex justify-center mb-6" },
            React.createElement('button', { 
                onClick: playAudio, 
                disabled: isPlaying || !audioBufferRef.current,
                className: "flex items-center space-x-3 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            },
                React.createElement(PlayCircleIcon, { className: "w-8 h-8" }),
                React.createElement('span', { className: "text-lg font-semibold" }, isPlaying ? 'Playing...' : 'Play Audio')
            )
        )
    );
};

// --- Question Renderers ---

const SST_Question = ({ data, userAnswer, onAnswerChange }) => {
    const [wordCount, setWordCount] = useState(0);
    useEffect(() => {
        setWordCount((userAnswer || '').trim().split(/\s+/).filter(Boolean).length);
    }, [userAnswer]);
    const wordCountColor = wordCount < 50 || wordCount > 70 ? 'text-red-500' : 'text-green-600';

    return React.createElement('div', null,
        React.createElement(AudioPlayer, { audioBase64: data.audioBase64 }),
        React.createElement('p', { className: 'text-gray-600 mb-4' }, 'Listen to the lecture and write a summary of 50-70 words.'),
        React.createElement('textarea', { value: userAnswer, onChange: e => onAnswerChange(e.target.value), className: "w-full p-4 border rounded-lg min-h-[150px]", placeholder: "Your summary..." }),
        React.createElement('div', { className: `text-sm mt-2 text-right ${wordCountColor}` }, `Word Count: ${wordCount}`)
    );
};

const MCMA_Question = ({ data, userAnswer = [], onAnswerChange }) => {
    const handleSelect = option => onAnswerChange(userAnswer.includes(option) ? userAnswer.filter(i => i !== option) : [...userAnswer, option]);
    return React.createElement('div', null,
        React.createElement(AudioPlayer, { audioBase64: data.audioBase64 }),
        React.createElement('p', { className: 'text-lg font-semibold text-gray-800 mb-4' }, data.question),
        React.createElement('div', { className: "space-y-3" }, data.options.map((option, index) => React.createElement('label', { key: index, className: "flex items-center p-4 rounded-lg border cursor-pointer bg-white" },
            React.createElement('input', { type: 'checkbox', checked: userAnswer.includes(option), onChange: () => handleSelect(option), className: 'h-5 w-5' }),
            React.createElement('span', { className: 'ml-3 text-gray-800' }, option)
        )))
    );
};

const FIB_L_Question = ({ data, userAnswer = {}, onAnswerChange }) => {
    const parts = data.gappedText.split('{{BLANK}}');
    const elements = [];
    parts.forEach((part, index) => {
        elements.push(React.createElement('span', { key: `part-${index}` }, part));
        if (index < parts.length - 1) {
            elements.push(React.createElement('input', {
                key: `blank-${index}`, type: 'text', value: userAnswer[index] || '',
                onChange: e => onAnswerChange({ ...userAnswer, [index]: e.target.value }),
                className: "mx-1 py-1 px-2 border-b-2 focus:outline-none w-28",
            }));
        }
    });
    return React.createElement('div', null,
        React.createElement(AudioPlayer, { audioBase64: data.audioBase64 }),
        React.createElement('p', { className: "text-lg text-gray-800 leading-loose bg-gray-50 p-4 rounded-md" }, elements)
    );
};

const HIW_Question = ({ data, userAnswer = [], onAnswerChange }) => {
    const handleWordClick = (word, index) => {
        const wordId = `${word}-${index}`;
        onAnswerChange(userAnswer.includes(wordId) ? userAnswer.filter(i => i !== wordId) : [...userAnswer, wordId]);
    };
    return React.createElement('div', null,
        React.createElement(AudioPlayer, { audioBase64: data.audioBase64 }),
        React.createElement('div', { className: "text-lg leading-relaxed bg-gray-50 p-4 rounded-md" }, data.displayedTranscript.split(/(\s+)/).map((word, index) => {
            if (word.trim() === '') return React.createElement('span', { key: index }, word);
            const wordId = `${word.replace(/[.,]/g, '')}-${index}`;
            return React.createElement('span', { key: index, onClick: () => handleWordClick(word.replace(/[.,]/g, ''), index), className: `cursor-pointer rounded-md px-1 ${userAnswer.includes(wordId) ? 'bg-yellow-300' : 'hover:bg-yellow-100'}` }, word);
        }))
    );
};

const WFD_Question = ({ data, userAnswer, onAnswerChange }) => (
    React.createElement('div', null,
        React.createElement(AudioPlayer, { audioBase64: data.audioBase64 }),
        React.createElement('p', { className: 'text-gray-600 mb-4' }, 'Type the sentence exactly as you hear it.'),
        React.createElement('textarea', { value: userAnswer, onChange: e => onAnswerChange(e.target.value), className: "w-full p-4 border rounded-lg", rows: "3", placeholder: "Type the sentence here..." })
    )
);


const ListeningMockTestPlayer = ({ navigateTo, setMockTestResult }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(35 * 60);
    const [error, setError] = useState(null);
    const timerRef = useRef(null);

    const handleSubmit = useCallback(() => {
        clearInterval(timerRef.current);
        setMockTestResult({ questions, userAnswers });
        navigateTo('listening-mock-test-results');
    }, [questions, userAnswers, setMockTestResult, navigateTo]);
    
    useEffect(() => {
        generateListeningMockTestSet()
            .then(testSet => {
                setQuestions(testSet);
                // Initialize answers based on type
                const initialAnswers = {};
                 testSet.forEach((q, index) => {
                    if (q.type === 'listening-multiple-choice-multiple' || q.type === 'highlight-incorrect-words') initialAnswers[index] = [];
                    else if (q.type === 'fill-in-blanks-listening') initialAnswers[index] = {};
                    else initialAnswers[index] = '';
                });
                setUserAnswers(initialAnswers);
            })
            .catch(err => setError('Failed to load the mock test. Please try again later.'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (!isLoading) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isLoading, handleSubmit]);

    const renderCurrentQuestion = () => {
        const q = questions[currentQuestionIndex];
        const commonProps = {
            data: q.data,
            userAnswer: userAnswers[currentQuestionIndex],
            onAnswerChange: answer => setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }))
        };
        if (q.type === 'summarize-spoken-text') return React.createElement(SST_Question, commonProps);
        if (q.type === 'listening-multiple-choice-multiple') return React.createElement(MCMA_Question, commonProps);
        if (q.type === 'fill-in-blanks-listening') return React.createElement(FIB_L_Question, commonProps);
        if (q.type === 'highlight-incorrect-words') return React.createElement(HIW_Question, commonProps);
        if (q.type.startsWith('write-from-dictation')) return React.createElement(WFD_Question, commonProps);
        return React.createElement('p', null, 'Unknown question type');
    };

    if (isLoading) return React.createElement('div', { className: 'flex justify-center items-center h-64' }, React.createElement('div', { className: "animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" }), React.createElement('p', { className: 'ml-4' }, 'Generating your test...'));
    if (error) return React.createElement('div', { className: 'text-red-500 text-center' }, error);

    const formatTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6 md:p-8' },
            React.createElement('div', { className: 'flex justify-between items-center border-b pb-4 mb-6' },
                React.createElement('h2', { className: 'text-xl font-bold' }, `Question ${currentQuestionIndex + 1}/${questions.length}`),
                React.createElement('div', { className: 'text-xl font-bold text-red-500' }, formatTime(timeLeft))
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 h-2.5 mb-6' }, React.createElement('div', { className: 'bg-blue-600 h-2.5', style: { width: `${progress}%` } })),
            renderCurrentQuestion(),
            React.createElement('div', { className: 'flex justify-between mt-8 pt-6 border-t' },
                React.createElement('button', { onClick: () => setCurrentQuestionIndex(p => p - 1), disabled: currentQuestionIndex === 0, className: 'px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50' }, 'Previous'),
                currentQuestionIndex === questions.length - 1
                    ? React.createElement('button', { onClick: handleSubmit, className: 'px-6 py-2 bg-green-500 text-white rounded-lg' }, 'Finish & See Results')
                    : React.createElement('button', { onClick: () => setCurrentQuestionIndex(p => p + 1), className: 'px-6 py-2 bg-blue-500 text-white rounded-lg' }, 'Next')
            )
        )
    );
};

export default ListeningMockTestPlayer;