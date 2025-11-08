import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateReorderParagraphsQuestion } from '../services/geminiService.js';
import { BackIcon, RefreshIcon } from './icons.js';

const ReorderParagraphsPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questionData, setQuestionData] = useState(null);
    const [userOrder, setUserOrder] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);
    
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    const fetchNewQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setQuestionData(null);
        setUserOrder([]);
        setIsSubmitted(false);
        setScore(0);
        try {
            const data = await generateReorderParagraphsQuestion();
            setQuestionData(data);
            setUserOrder(data.shuffledParagraphs);
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
    
    const handleDragStart = (e, index) => {
        dragItem.current = index;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.parentNode);
    };

    const handleDragEnter = (e, index) => {
        dragOverItem.current = index;
        const list = [...userOrder];
        const draggedItemContent = list[dragItem.current];
        list.splice(dragItem.current, 1);
        list.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = dragOverItem.current;
        setUserOrder(list);
    };

    const handleDragEnd = () => {
        dragItem.current = null;
        dragOverItem.current = null;
    };


    const handleSubmit = () => {
        if (!questionData) return;
        let currentScore = 0;
        const correct = questionData.correctOrder;
        
        for (let i = 0; i < userOrder.length - 1; i++) {
            const userCurrentPara = userOrder[i];
            const userNextPara = userOrder[i+1];

            const correctCurrentIndex = correct.indexOf(userCurrentPara);
            
            if (correctCurrentIndex !== -1 && correctCurrentIndex < correct.length - 1) {
                const correctNextPara = correct[correctCurrentIndex + 1];
                if (userNextPara === correctNextPara) {
                    currentScore++;
                }
            }
        }
        
        setScore(currentScore);
        setIsSubmitted(true);
    };

    const renderParagraphs = (paragraphs, isDraggable) => {
        return paragraphs.map((para, index) => (
            React.createElement('div', { 
                key: `para-${index}`,
                draggable: isDraggable && !isSubmitted,
                onDragStart: (e) => handleDragStart(e, index),
                onDragEnter: (e) => handleDragEnter(e, index),
                onDragEnd: handleDragEnd,
                onDragOver: (e) => e.preventDefault(),
                className: `flex items-start p-4 border rounded-lg transition-shadow bg-white ${isDraggable && !isSubmitted ? 'cursor-move hover:shadow-md' : ''}`
            },
              React.createElement('span', { className: "mr-4 font-bold text-lg text-blue-500" }, `${index + 1}.`),
              React.createElement('p', { className: 'text-gray-700' }, para)
            )
        ));
    };
    
    const renderResult = () => {
        if (!isSubmitted || !questionData) return null;
        const maxScore = questionData.correctOrder.length - 1;
        
        return React.createElement('div', { className: "mt-8 bg-white p-6 rounded-xl shadow-lg text-center animate-fade-in" },
            React.createElement('h2', { className: "text-2xl font-bold text-gray-800" }, "Results"),
            React.createElement('p', { className: "mt-2 text-xl text-gray-700" }, 
                "You scored ", 
                React.createElement('strong', {className: "text-blue-600"}, score), 
                " out of ", 
                React.createElement('strong', {className: "text-blue-600"}, maxScore),
                " possible points for correct pairs."
            ),
             React.createElement('div', { className: "mt-4 text-left" },
                React.createElement('h3', { className: "font-semibold mb-2 text-gray-800 text-center" }, "Correct Order:"),
                React.createElement('div', { className: "space-y-3" },
                    renderParagraphs(questionData.correctOrder, false)
                )
            )
        );
    };

    return React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Re-order Paragraphs'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'The text boxes below are in a random order. Restore the original order by dragging and dropping them.'),
        
        React.createElement('div', { className: "mt-6" },
            isLoading ? (
                React.createElement('div', { className: "flex justify-center items-center h-60" },
                    React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
                )
            ) : error ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : userOrder && (
                React.createElement('div', { className: 'space-y-3' }, 
                   renderParagraphs(userOrder, true)
                )
            )
        ),
        
        React.createElement('div', { className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-4" },
             React.createElement('button', {
                onClick: handleSubmit,
                disabled: isLoading || isSubmitted,
                className: "w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
            }, 'Check Order'),
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

export default ReorderParagraphsPractice;