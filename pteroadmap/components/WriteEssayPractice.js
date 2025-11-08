import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateWriteEssayQuestion, scoreWriteEssayAttempt } from '../services/geminiService.js';
import { BackIcon, RefreshIcon } from './icons.js';
import ScoreDisplay from './ScoreDisplay.js';

const WriteEssayPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [questionPrompt, setQuestionPrompt] = useState('');
    const [userEssay, setUserEssay] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [score, setScore] = useState(null);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const timerRef = useRef(null);

    const startTimer = () => {
        setIsTimerRunning(true);
        timerRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    setIsTimerRunning(false);
                    // Optionally auto-submit or notify user
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const resetTimer = () => {
        clearInterval(timerRef.current);
        setTimeLeft(20 * 60);
        setIsTimerRunning(false);
    };

    const fetchNewQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setScore(null);
        setUserEssay('');
        setWordCount(0);
        resetTimer();
        try {
            const prompt = await generateWriteEssayQuestion();
            setQuestionPrompt(prompt);
            startTimer(); // Start timer when new question is loaded
        } catch (err) {
            setError('Failed to fetch a new essay prompt. Please check your API key and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNewQuestion();
        return () => clearInterval(timerRef.current); // Cleanup on component unmount
    }, [fetchNewQuestion]);

    const handleEssayChange = (e) => {
        const text = e.target.value;
        setUserEssay(text);
        const words = text.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
    };

    const handleSubmit = async () => {
        if (wordCount < 1) {
            setError('Please write your essay before submitting.');
            return;
        }
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
        setIsAnalyzing(true);
        setError(null);
        setScore(null);
        try {
            const analysis = await scoreWriteEssayAttempt(questionPrompt, userEssay);
            setScore(analysis);
        } catch (err) {
            setError('Failed to analyze your essay. The AI model might be busy. Please try again.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderScore = () => {
        if (!score) return null;
        const scoreItems = [
            { label: "Content", value: score.content, maxValue: 3 },
            { label: "Form", value: score.form, maxValue: 2 },
            { label: "Development", value: score.development, maxValue: 2 },
            { label: "Grammar", value: score.grammar, maxValue: 2 },
            { label: "Linguistic Range", value: score.linguisticRange, maxValue: 2 },
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
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Write Essay'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'You will have 20 minutes to plan, write, and revise an essay about the topic below. Your response will be judged on how well you develop a position, organize your ideas, present supporting details, and control the elements of standard written English. You should write 200-300 words.'),
        
        React.createElement('div', { className: "mt-6 bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/30" },
            isLoading ? (
                React.createElement('div', { className: "flex justify-center items-center h-20" },
                    React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
                )
            ) : error && !questionPrompt ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : (
                React.createElement('p', { className: "text-lg font-semibold text-gray-800" }, questionPrompt)
            )
        ),
        
        React.createElement('div', { className: "mt-6" },
             React.createElement('div', { className: "flex justify-between items-center mb-2" },
                React.createElement('div', { className: "text-lg font-bold text-gray-700" }, formatTime(timeLeft)),
                React.createElement('div', { className: `text-sm font-medium ${wordCount < 200 || wordCount > 300 ? 'text-red-500' : 'text-green-600'}` },
                    `Word Count: ${wordCount}`
                )
            ),
            React.createElement('textarea', {
                value: userEssay,
                onChange: handleEssayChange,
                className: "w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow min-h-[300px]",
                placeholder: "Start writing your essay here...",
                disabled: isLoading || isAnalyzing || timeLeft === 0
            })
        ),

        React.createElement('div', { className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-4" },
             React.createElement('button', {
                onClick: handleSubmit,
                disabled: !userEssay || isAnalyzing || isLoading || timeLeft === 0,
                className: "w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
            }, isAnalyzing ? 'Analyzing...' : 'Submit & Get Score'),
            React.createElement('button', {
                onClick: fetchNewQuestion,
                disabled: isLoading || isAnalyzing,
                className: "w-full sm:w-auto p-3 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors",
                'aria-label': "Next Question"
            }, React.createElement(RefreshIcon, { className: "w-6 h-6" }))
        ),
        
        error && questionPrompt && (
             React.createElement('div', { className: "mt-4 text-center text-red-600" }, error)
        ),
        
        isAnalyzing && (
            React.createElement('div', { className: "flex justify-center items-center mt-8" },
                React.createElement('div', { className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" }),
                React.createElement('p', { className: "ml-4 text-gray-600" }, 'AI is analyzing your essay...')
            )
        ),
        
        !isAnalyzing && renderScore()
    );
};

export default WriteEssayPractice;