import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateReadAloudQuestion, scoreReadAloudAttempt } from '../services/geminiService.js';
import { BackIcon, MicrophoneIcon, StopIcon, RefreshIcon } from './icons.js';
import ScoreDisplay from './ScoreDisplay.js';

const ReadAloudPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [questionText, setQuestionText] = useState('');
    const [audioURL, setAudioURL] = useState(null);
    const [score, setScore] = useState(null);
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const fetchNewQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setScore(null);
        setAudioURL(null);
        try {
            const text = await generateReadAloudQuestion();
            setQuestionText(text);
        } catch (err) {
            setError('Failed to fetch a new question. Please check your API key and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNewQuestion();
    }, [fetchNewQuestion]);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                audioChunksRef.current = [];
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setScore(null); // Clear previous scores
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
        if (!audioURL) {
            setError('Please record your response before submitting.');
            return;
        }
        setIsAnalyzing(true);
        setError(null);
        setScore(null);
        try {
            const analysis = await scoreReadAloudAttempt(questionText);
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

    return React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Read Aloud'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'Read the text below aloud clearly and naturally. You will be scored on content, pronunciation, and oral fluency.'),
        
        React.createElement('div', { className: "mt-6 bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/30" },
            isLoading ? (
                React.createElement('div', { className: "flex justify-center items-center h-40" },
                    React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" })
                )
            ) : error ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : (
                React.createElement('p', { className: "text-lg leading-relaxed text-gray-700" }, questionText)
            )
        ),

        React.createElement('div', { className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-4" },
            React.createElement('button', {
                onClick: isRecording ? handleStopRecording : handleStartRecording,
                className: `flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base font-semibold text-white rounded-lg shadow-md transition-transform transform hover:scale-105 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`
            },
                isRecording ? React.createElement(StopIcon, { className: "w-6 h-6 mr-2" }) : React.createElement(MicrophoneIcon, { className: "w-6 h-6 mr-2" }),
                isRecording ? 'Stop Recording' : 'Start Recording'
            ),
             React.createElement('button', {
                onClick: handleSubmit,
                disabled: !audioURL || isAnalyzing || isRecording,
                className: "w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
            }, isAnalyzing ? 'Analyzing...' : 'Get Score'),
            React.createElement('button', {
                onClick: fetchNewQuestion,
                disabled: isLoading || isAnalyzing || isRecording,
                className: "w-full sm:w-auto p-3 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors",
                'aria-label': "Next Question"
            }, React.createElement(RefreshIcon, { className: "w-6 h-6" }))
        ),

        audioURL && (
            React.createElement('div', { className: "mt-4 flex justify-center" },
                React.createElement('audio', { controls: true, src: audioURL, className: "w-full max-w-sm" })
            )
        ),
        
        isAnalyzing && (
            React.createElement('div', { className: "flex justify-center items-center mt-8" },
                React.createElement('div', { className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" }),
                React.createElement('p', { className: "ml-4 text-gray-600" }, 'AI is analyzing your response...')
            )
        ),

        !isAnalyzing && renderScore()
    );
};

export default ReadAloudPractice;