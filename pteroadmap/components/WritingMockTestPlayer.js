import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateWritingMockTestSet } from '../services/geminiService.js';

const questionTypes = {
    'summarize-written-text': { title: 'Summarize Written Text', duration: 10 * 60 },
    'write-essay': { title: 'Write Essay', duration: 20 * 60 }
};

const QuestionRenderer = ({ question, userAnswer, onAnswerChange }) => {
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        const words = (userAnswer || '').trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
    }, [userAnswer]);

    if (question.type === 'summarize-written-text') {
        const wordCountColor = wordCount < 5 || wordCount > 75 ? 'text-red-500' : 'text-gray-500';
        return React.createElement('div', null,
            React.createElement('div', { className: "prose max-w-none text-gray-700 leading-relaxed mb-6 h-64 overflow-y-auto p-4 border rounded-md bg-gray-50" },
                React.createElement('p', { className: 'font-semibold' }, 'Read the passage below and summarize it in a single sentence. Your summary should be between 5 and 75 words.'),
                question.data.passage.split('\n').map((para, index) => React.createElement('p', { key: index }, para))
            ),
            React.createElement('textarea', {
                value: userAnswer,
                onChange: (e) => onAnswerChange(e.target.value),
                className: "w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500",
                rows: "4",
                placeholder: "Write your one-sentence summary here...",
            }),
            React.createElement('div', { className: `text-sm mt-2 text-right ${wordCountColor}` }, `Word Count: ${wordCount}`)
        );
    }

    if (question.type === 'write-essay') {
        const wordCountColor = wordCount < 200 || wordCount > 300 ? 'text-red-500' : 'text-green-600';
        return React.createElement('div', null,
             React.createElement('div', { className: "prose max-w-none text-gray-700 leading-relaxed mb-6 p-4 border rounded-md bg-gray-50" },
                React.createElement('p', { className: 'font-semibold' }, 'You have 20 minutes to write an essay of 200-300 words on the following topic:'),
                React.createElement('p', { className: 'font-bold text-gray-800' }, question.data.prompt)
            ),
            React.createElement('textarea', {
                value: userAnswer,
                onChange: (e) => onAnswerChange(e.target.value),
                className: "w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[300px]",
                placeholder: "Start writing your essay here...",
            }),
             React.createElement('div', { className: `text-sm mt-2 text-right ${wordCountColor}` }, `Word Count: ${wordCount}`)
        );
    }

    return React.createElement('p', null, `Unknown question type: ${question.type}`);
};

const WritingMockTestPlayer = ({ navigateTo, setMockTestResult }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [error, setError] = useState(null);
    const timerRef = useRef(null);

    const handleSubmit = useCallback(() => {
        clearTimeout(timerRef.current);
        const resultPayload = {
            questions: questions,
            userAnswers: userAnswers,
        };
        setMockTestResult(resultPayload);
        navigateTo('writing-mock-test-results');
    }, [questions, userAnswers, setMockTestResult, navigateTo]);
    
     const handleNext = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    }, [currentQuestionIndex, questions.length]);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const testSet = await generateWritingMockTestSet();
                setQuestions(testSet);
                setUserAnswers(testSet.reduce((acc, _, index) => ({ ...acc, [index]: '' }), {}));
            } catch (err) {
                setError('Failed to load the mock test. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTest();
    }, []);

    useEffect(() => {
        clearTimeout(timerRef.current);
        if (questions.length > 0) {
            const currentQuestion = questions[currentQuestionIndex];
            const duration = questionTypes[currentQuestion.type].duration;
            setTimeLeft(duration);

             timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        if (currentQuestionIndex < questions.length - 1) {
                            handleNext();
                        } else {
                            handleSubmit();
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [currentQuestionIndex, questions, handleSubmit, handleNext]);
    
    const handleAnswerChange = (answer) => {
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (isLoading) {
        return React.createElement('div', { className: 'flex flex-col items-center justify-center h-full min-h-[50vh]' },
            React.createElement('div', { className: "animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500" }),
            React.createElement('p', { className: 'mt-4 text-gray-600' }, 'Preparing your writing mock test...')
        );
    }

    if (error) {
        return React.createElement('div', { className: 'text-red-600 bg-red-100 p-4 rounded-lg' }, error);
    }
    
    const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const currentQuestion = questions[currentQuestionIndex];

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6 md:p-8' },
            React.createElement('div', { className: 'flex justify-between items-center border-b pb-4 mb-6' },
                React.createElement('h2', { className: 'text-xl font-bold' }, questionTypes[currentQuestion.type].title),
                React.createElement('div', { className: 'text-xl font-bold text-red-500' }, formatTime(timeLeft))
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2.5 mb-6' },
                React.createElement('div', { className: 'bg-orange-500 h-2.5 rounded-full', style: { width: `${progress}%` } })
            ),

            React.createElement(QuestionRenderer, {
                question: currentQuestion,
                userAnswer: userAnswers[currentQuestionIndex],
                onAnswerChange: handleAnswerChange
            }),

            React.createElement('div', { className: 'flex justify-between mt-8 pt-6 border-t' },
                React.createElement('button', { onClick: handlePrev, disabled: currentQuestionIndex === 0, className: 'px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50' }, 'Previous'),
                currentQuestionIndex === questions.length - 1
                    ? React.createElement('button', { onClick: handleSubmit, className: 'px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600' }, 'Finish & See Results')
                    : React.createElement('button', { onClick: handleNext, className: 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600' }, 'Next')
            )
        )
    );
};

export default WritingMockTestPlayer;
