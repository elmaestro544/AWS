import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateSpeakingMockTestSet } from '../services/geminiService.js';
import { MicrophoneIcon, StopIcon, PlayCircleIcon } from './icons.js';

const questionTypes = {
    'read-aloud': { title: 'Read Aloud', prepTime: 35, recordTime: 40 },
    'repeat-sentence': { title: 'Repeat Sentence', prepTime: 0, recordTime: 15 },
    'describe-image': { title: 'Describe Image', prepTime: 25, recordTime: 40 },
    'retell-lecture': { title: 'Re-tell Lecture', prepTime: 10, recordTime: 40 },
    'answer-short-question': { title: 'Answer Short Question', prepTime: 0, recordTime: 10 },
};

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


const AudioPlayer = ({ audioBase64, onEnd }) => {
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
        setupAudio();

        async function setupAudio() {
            try {
                const audioBytes = decode(audioBase64);
                const buffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
                if (isActive) {
                    audioBufferRef.current = buffer;
                }
            } catch(e) {
                console.error("Error decoding audio data", e);
            }
        }

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
                if(onEnd) onEnd();
            };
            source.start();
            sourceRef.current = source;
            setIsPlaying(true);
        }
    };

    return React.createElement('button', { onClick: playAudio, disabled: isPlaying, className: "flex items-center space-x-3 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg" },
        React.createElement(PlayCircleIcon, { className: "w-8 h-8" }),
        React.createElement('span', { className: "text-lg font-semibold" }, isPlaying ? 'Playing...' : 'Play Audio')
    );
};


const SpeakingMockTestPlayer = ({ navigateTo, setMockTestResult }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userRecordings, setUserRecordings] = useState({});
    const [timeLeft, setTimeLeft] = useState(35 * 60); // Approx. total time
    const [questionState, setQuestionState] = useState('starting'); // starting, preparing, recording, finishing, finished
    const [timer, setTimer] = useState(0);

    const mainTimerRef = useRef(null);
    const questionTimerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleNext = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setQuestionState('starting');
        } else {
            // End of test
            clearInterval(mainTimerRef.current);
            setMockTestResult({ questions, userRecordings });
            navigateTo('speaking-mock-test-results');
        }
    }, [currentQuestionIndex, questions, userRecordings, setMockTestResult, navigateTo]);
    
    // Fetch questions on mount
    useEffect(() => {
        generateSpeakingMockTestSet()
            .then(setQuestions)
            .catch(err => console.error("Failed to load test", err))
            .finally(() => setIsLoading(false));
    }, []);

    // Main test timer
    useEffect(() => {
        if (!isLoading) {
            mainTimerRef.current = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
        }
        return () => clearInterval(mainTimerRef.current);
    }, [isLoading]);

    // State machine for question flow
    useEffect(() => {
        if (isLoading || questions.length === 0) return;

        const currentQuestion = questions[currentQuestionIndex];
        const config = questionTypes[currentQuestion.type];

        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];
                mediaRecorderRef.current.ondataavailable = event => audioChunksRef.current.push(event.data);
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        const base64Audio = reader.result.split(',')[1];
                        setUserRecordings(prev => ({ ...prev, [currentQuestionIndex]: base64Audio }));
                    };
                     stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorderRef.current.start();
            } catch (err) { console.error("Mic error", err); }
        };

        const stopRecording = () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };

        clearInterval(questionTimerRef.current);

        if (questionState === 'starting') {
            if (config.prepTime > 0) {
                setTimer(config.prepTime);
                setQuestionState('preparing');
            } else {
                setTimer(config.recordTime);
                setQuestionState('recording');
                startRecording();
            }
        } else if (questionState === 'preparing') {
            questionTimerRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(questionTimerRef.current);
                        setTimer(config.recordTime);
                        setQuestionState('recording');
                        startRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (questionState === 'recording') {
             questionTimerRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(questionTimerRef.current);
                        stopRecording();
                        setQuestionState('finishing');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (questionState === 'finishing') {
             // Artificial delay to show "Completed" before moving on
            setTimeout(handleNext, 1500);
        }

        return () => clearInterval(questionTimerRef.current);

    }, [questionState, currentQuestionIndex, questions, isLoading, handleNext]);


    const renderQuestionContent = () => {
        const q = questions[currentQuestionIndex];
        switch (q.type) {
            case 'read-aloud': return React.createElement('p', {className: 'text-lg'}, q.data.text);
            case 'repeat-sentence': return React.createElement(AudioPlayer, { audioBase64: q.data.audioBase64, onEnd: () => setQuestionState('recording') });
            case 'describe-image': return React.createElement('img', { src: `data:image/png;base64,${q.data.imageBase64}`, alt: "Chart", className: "max-w-full max-h-[400px] rounded-lg" });
            case 'retell-lecture': return React.createElement(AudioPlayer, { audioBase64: q.data.audioBase64, onEnd: () => setQuestionState('preparing') });
            case 'answer-short-question': return React.createElement(AudioPlayer, { audioBase64: q.data.audioBase64, onEnd: () => setQuestionState('recording') });
            default: return null;
        }
    };

    const getStatusMessage = () => {
        switch (questionState) {
            case 'preparing': return `Preparing... ${timer}s`;
            case 'recording': return React.createElement('div', {className: 'flex items-center text-red-500'}, React.createElement('div', {className: 'w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2'}), `Recording... ${timer}s`);
            case 'finishing': return 'Completed';
            default: return 'Starting...';
        }
    };
    
    if (isLoading) return React.createElement('div', { className: 'flex justify-center items-center h-64' }, React.createElement('div', { className: "animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600" }));

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const currentQuestion = questions[currentQuestionIndex];
    const formatTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6 md:p-8' },
            React.createElement('div', { className: 'flex justify-between items-center border-b pb-4 mb-6' },
                React.createElement('h2', { className: 'text-xl font-bold' }, `${questionTypes[currentQuestion.type].title} (${currentQuestionIndex + 1}/${questions.length})`),
                React.createElement('div', { className: 'text-xl font-bold text-gray-700' }, formatTime(timeLeft))
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 h-2.5 mb-6' }, React.createElement('div', { className: 'bg-purple-600 h-2.5', style: { width: `${progress}%` } })),
            
            React.createElement('div', { className: 'min-h-[400px] flex flex-col justify-center items-center bg-gray-50 p-4 rounded-lg' }, renderQuestionContent()),

            React.createElement('div', { className: 'mt-6 text-center font-semibold text-lg' }, getStatusMessage()),

            React.createElement('div', { className: 'flex justify-end mt-8 pt-6 border-t' },
                 React.createElement('button', { onClick: handleNext, className: 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600' }, 'Next Question')
            )
        )
    );
};

export default SpeakingMockTestPlayer;