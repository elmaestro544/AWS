import React, { useState, useEffect, useCallback } from 'react';
import { generateFillInBlanksDragDropQuestion } from '../services/geminiService.js';
import { BackIcon, RefreshIcon } from './icons.js';

const FillInBlanksDragDropPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questionData, setQuestionData] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [wordBank, setWordBank] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);

    const fetchNewQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setQuestionData(null);
        setIsSubmitted(false);
        setScore(0);
        setUserAnswers([]);
        setWordBank([]);
        try {
            const data = await generateFillInBlanksDragDropQuestion();
            setQuestionData(data);
            setWordBank(data.wordBank);
            const blankCount = (data.passageWithBlanks.match(/\{\{BLANK\}\}/g) || []).length;
            setUserAnswers(new Array(blankCount).fill(null));
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

    const handleDragStart = (e, word) => {
        e.dataTransfer.setData("word", word);
    };

    const handleDrop = (e, blankIndex) => {
        e.preventDefault();
        const word = e.dataTransfer.getData("word");
        
        if (userAnswers[blankIndex] || !word) return;

        const newAnswers = [...userAnswers];
        newAnswers[blankIndex] = word;
        setUserAnswers(newAnswers);
        setWordBank(prev => prev.filter(w => w !== word));
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const returnWordToBank = (word, blankIndex) => {
        if (isSubmitted || !word) return;

        const newAnswers = [...userAnswers];
        newAnswers[blankIndex] = null;
        setUserAnswers(newAnswers);
        setWordBank(prev => [...prev, word].sort(() => Math.random() - 0.5));
    };

    const handleSubmit = () => {
        if (!questionData) return;
        let correctCount = 0;
        userAnswers.forEach((answer, index) => {
            if (answer && answer === questionData.correctAnswers[index]) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setIsSubmitted(true);
    };

    const renderPassageWithBlanks = () => {
        if (!questionData) return null;

        const parts = questionData.passageWithBlanks.split('{{BLANK}}');
        const elements = [];
        
        parts.forEach((part, index) => {
            elements.push(React.createElement('span', { key: `part-${index}` }, part));
            if (index < parts.length - 1) {
                const answer = userAnswers[index];
                const isCorrect = isSubmitted && answer === questionData.correctAnswers[index];
                const isIncorrect = isSubmitted && answer && answer !== questionData.correctAnswers[index];

                let blankClass = "inline-block text-center border-b-2 p-1 mx-1 min-w-[100px] align-bottom ";
                if (isSubmitted) {
                    if (isCorrect) blankClass += "bg-green-100 border-green-500 text-green-700";
                    else if (isIncorrect) blankClass += "bg-red-100 border-red-500 text-red-700 line-through";
                    else blankClass += "bg-gray-100 border-gray-400"; // Unanswered
                } else {
                    blankClass += "border-dashed border-gray-400";
                }

                elements.push(
                    React.createElement('div', {
                        key: `blank-${index}`,
                        onDrop: (e) => handleDrop(e, index),
                        onDragOver: handleDragOver,
                        className: blankClass,
                    }, 
                        answer ? React.createElement('span', {
                            onClick: () => returnWordToBank(answer, index),
                            className: `bg-blue-100 text-blue-800 p-1 rounded ${!isSubmitted ? 'cursor-pointer' : 'cursor-default'}`
                        }, answer) : React.createElement('span', { className: 'text-gray-400' }, 'Drop here')
                    )
                );
            }
        });
        return React.createElement('div', { className: "text-lg text-gray-800 leading-loose" }, elements);
    };

    const renderWordBank = () => {
        if (!wordBank || isSubmitted) return null;
        return React.createElement('div', { className: 'mt-8 p-4 bg-gray-100 rounded-lg flex flex-wrap gap-3 justify-center' },
            wordBank.map((word, index) => (
                React.createElement('div', {
                    key: `${word}-${index}`,
                    draggable: true,
                    onDragStart: (e) => handleDragStart(e, word),
                    className: 'px-4 py-2 bg-white border rounded-lg shadow-sm cursor-grab active:cursor-grabbing'
                }, word)
            ))
        );
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
                React.createElement('ul', { className: "list-decimal list-inside space-y-1 text-gray-700" },
                    questionData.correctAnswers.map((answer, index) => React.createElement('li', { key: `ans-${index}` }, 
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
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Fill in Blanks (Drag & Drop)'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'Drag the words from the box below to the appropriate blanks in the text.'),
        
        React.createElement('div', { className: "mt-6 bg-white p-8 rounded-xl shadow-lg" },
            isLoading ? (
                React.createElement('div', { className: "flex justify-center items-center h-60" },
                    React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
                )
            ) : error ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : (
                renderPassageWithBlanks()
            )
        ),
        
        renderWordBank(),
        
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

export default FillInBlanksDragDropPractice;