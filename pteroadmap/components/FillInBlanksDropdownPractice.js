import React, { useState, useEffect, useCallback } from 'react';
import { generateFillInBlanksDropdownQuestion } from '../services/geminiService.js';
import { BackIcon, RefreshIcon } from './icons.js';

const FillInBlanksDropdownPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questionData, setQuestionData] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);

    const fetchNewQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setQuestionData(null);
        setUserAnswers({});
        setIsSubmitted(false);
        setScore(0);
        try {
            const data = await generateFillInBlanksDropdownQuestion();
            setQuestionData(data);
            // Initialize user answers state
            const initialAnswers = {};
            data.blanks.forEach(blank => {
                initialAnswers[blank.id] = '';
            });
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
    }, [fetchNewQuestion]);

    const handleAnswerChange = (blankId, value) => {
        setUserAnswers(prev => ({ ...prev, [blankId]: value }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questionData.blanks.forEach(blank => {
            if (userAnswers[blank.id] === blank.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setIsSubmitted(true);
    };

    const renderPassageWithDropdowns = () => {
        if (!questionData) return null;

        // Using a regex to split the passage by placeholders like {{BLANK_1}}
        const parts = questionData.passage.split(/(\{\{BLANK_\d+\}\})/g);

        return parts.map((part, index) => {
            const match = part.match(/\{\{BLANK_(\d+)\}\}/);
            if (match) {
                const blankId = parseInt(match[1], 10);
                const blankData = questionData.blanks.find(b => b.id === blankId);
                
                if (!blankData) return React.createElement('span', { key: index }, part);
                
                const isCorrect = isSubmitted && userAnswers[blankId] === blankData.correctAnswer;
                const isIncorrect = isSubmitted && userAnswers[blankId] && userAnswers[blankId] !== blankData.correctAnswer;
                
                let selectClassName = "mx-1 py-1 px-2 border border-gray-400 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none";
                
                if (isSubmitted) {
                    selectClassName += " text-white font-semibold";
                    if (isCorrect) selectClassName += " bg-green-500 border-green-600";
                    else if (isIncorrect) selectClassName += " bg-red-500 border-red-600";
                    else selectClassName += " bg-gray-400 border-gray-500"; // Not answered
                } else {
                     selectClassName += " bg-gray-100";
                }

                return React.createElement('select', {
                    key: `blank-${blankId}`,
                    value: userAnswers[blankId] || '',
                    onChange: (e) => handleAnswerChange(blankId, e.target.value),
                    disabled: isSubmitted,
                    className: selectClassName,
                    'aria-label': `Blank number ${blankId}`
                },
                    React.createElement('option', { value: "", disabled: true }, 'Select...'),
                    ...blankData.options.map(option => React.createElement('option', { key: option, value: option }, option))
                );
            }
            return React.createElement('span', { key: index }, part);
        });
    };
    
    const renderResult = () => {
        if (!isSubmitted || !questionData) return null;
        const totalBlanks = questionData.blanks.length;
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
                    questionData.blanks.map(blank => React.createElement('li', { key: `ans-${blank.id}` }, 
                        `Blank ${blank.id}: `,
                        React.createElement('strong', { className: "text-green-700" }, blank.correctAnswer)
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
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Fill in Blanks (Dropdown)'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'Read the text and choose the correct word for each blank from the dropdown list.'),
        
        React.createElement('div', { className: "mt-6 bg-white p-8 rounded-xl shadow-lg" },
            isLoading ? (
                React.createElement('div', { className: "flex justify-center items-center h-60" },
                    React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
                )
            ) : error ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : (
                React.createElement('div', { className: "text-lg text-gray-800 leading-loose" }, 
                    renderPassageWithDropdowns()
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

export default FillInBlanksDropdownPractice;