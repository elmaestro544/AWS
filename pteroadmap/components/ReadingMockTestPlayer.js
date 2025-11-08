import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateReadingMockTestSet } from '../services/geminiService.js';
import { BackIcon } from './icons.js';

// --- Reusable Question Rendering Components ---

const MCSA_Question = ({ data, userAnswer, onAnswerChange }) => {
    return React.createElement('div', null,
        React.createElement('div', { className: "prose max-w-none text-gray-700 leading-relaxed mb-8 h-64 overflow-y-auto p-2 border rounded-md" },
            data.passage.split('\n').map((para, index) => React.createElement('p', { key: index }, para))
        ),
        React.createElement('div', { className: "mt-6 pt-6 border-t" },
            React.createElement('p', { className: 'text-lg font-semibold text-gray-800 mb-4' }, data.question),
            React.createElement('div', { className: "space-y-3" },
                data.options.map((option, index) => {
                    const isSelected = userAnswer === option;
                    let labelClass = "flex items-center p-4 rounded-lg border cursor-pointer transition-colors duration-150 ";
                    labelClass += isSelected ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300 hover:bg-gray-50";

                    return React.createElement('label', { key: index, className: labelClass },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'mcq-option',
                            checked: isSelected,
                            onChange: () => onAnswerChange(option),
                            className: 'h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500'
                        }),
                        React.createElement('span', { className: 'ml-3 text-gray-800' }, option)
                    );
                })
            )
        )
    );
};

const MCMA_Question = ({ data, userAnswer = [], onAnswerChange }) => {
    const handleSelect = (option) => {
        const newAnswers = userAnswer.includes(option)
            ? userAnswer.filter(item => item !== option)
            : [...userAnswer, option];
        onAnswerChange(newAnswers);
    };

    return React.createElement('div', null,
        React.createElement('div', { className: "prose max-w-none text-gray-700 leading-relaxed mb-8 h-64 overflow-y-auto p-2 border rounded-md" },
            data.passage.split('\n').map((para, index) => React.createElement('p', { key: index }, para))
        ),
        React.createElement('div', { className: "mt-6 pt-6 border-t" },
            React.createElement('p', { className: 'text-lg font-semibold text-gray-800 mb-4' }, data.question),
            React.createElement('div', { className: "space-y-3" },
                data.options.map((option, index) => {
                    const isSelected = userAnswer.includes(option);
                    let labelClass = "flex items-center p-4 rounded-lg border cursor-pointer transition-colors duration-150 ";
                    labelClass += isSelected ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300 hover:bg-gray-50";

                    return React.createElement('label', { key: index, className: labelClass },
                        React.createElement('input', {
                            type: 'checkbox',
                            name: `mcq-option-${index}`,
                            checked: isSelected,
                            onChange: () => handleSelect(option),
                            className: 'h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                        }),
                        React.createElement('span', { className: 'ml-3 text-gray-800' }, option)
                    );
                })
            )
        )
    );
};

const ROP_Question = ({ data, userAnswer = [], onAnswerChange }) => {
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    const handleDragStart = (e, index) => {
        dragItem.current = index;
    };
    
    const handleDragEnter = (e, index) => {
        dragOverItem.current = index;
        const list = [...userAnswer];
        const draggedItemContent = list[dragItem.current];
        list.splice(dragItem.current, 1);
        list.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = dragOverItem.current;
        onAnswerChange(list);
    };

    return React.createElement('div', { className: 'space-y-3' },
        userAnswer.map((para, index) => (
            React.createElement('div', {
                key: para,
                draggable: true,
                onDragStart: (e) => handleDragStart(e, index),
                onDragEnter: (e) => handleDragEnter(e, index),
                onDragOver: (e) => e.preventDefault(),
                className: 'flex items-start p-4 border rounded-lg transition-shadow bg-white cursor-move hover:shadow-md'
            },
                React.createElement('span', { className: "mr-4 font-bold text-lg text-blue-500" }, `${index + 1}.`),
                React.createElement('p', { className: 'text-gray-700' }, para)
            )
        ))
    );
};


const FIB_D_Question = ({ data, userAnswer = {}, onAnswerChange }) => {
    const handleSelect = (blankId, value) => {
        onAnswerChange({ ...userAnswer, [blankId]: value });
    };

    const parts = data.passage.split(/(\{\{BLANK_\d+\}\})/g);

    return React.createElement('div', { className: "text-lg text-gray-800 leading-loose" },
        parts.map((part, index) => {
            const match = part.match(/\{\{BLANK_(\d+)\}\}/);
            if (match) {
                const blankId = parseInt(match[1], 10);
                const blankData = data.blanks.find(b => b.id === blankId);
                if (!blankData) return React.createElement('span', { key: index }, part);

                return React.createElement('select', {
                    key: `blank-${blankId}`,
                    value: userAnswer[blankId] || '',
                    onChange: (e) => handleSelect(blankId, e.target.value),
                    className: "mx-1 py-1 px-2 border border-gray-400 rounded-md bg-gray-100 focus:ring-blue-500 focus:border-blue-500",
                },
                    React.createElement('option', { value: "", disabled: true }, 'Select...'),
                    ...blankData.options.map(option => React.createElement('option', { key: option, value: option }, option))
                );
            }
            return React.createElement('span', { key: index }, part);
        })
    );
};


const FIB_DD_Question = ({ data, userAnswer = [], onAnswerChange }) => {
    const [wordBank, setWordBank] = useState([]);

    useEffect(() => {
        // Initialize word bank by removing already used words
        const usedWords = userAnswer.filter(w => w !== null);
        setWordBank(data.wordBank.filter(w => !usedWords.includes(w)));
    }, [data.wordBank, userAnswer]);

    const handleDrop = (e, blankIndex) => {
        e.preventDefault();
        const word = e.dataTransfer.getData("word");
        if (userAnswer[blankIndex] || !word) return;

        const newAnswers = [...userAnswer];
        newAnswers[blankIndex] = word;
        onAnswerChange(newAnswers);
    };

    const returnWordToBank = (word, blankIndex) => {
        if (!word) return;
        const newAnswers = [...userAnswer];
        newAnswers[blankIndex] = null;
        onAnswerChange(newAnswers);
    };

    const parts = data.passageWithBlanks.split('{{BLANK}}');
    const elements = [];
    let blankCounter = 0;
    
    parts.forEach((part, index) => {
        elements.push(React.createElement('span', { key: `part-${index}` }, part));
        if (index < parts.length - 1) {
            const currentBlankIndex = blankCounter;
            const answer = userAnswer[currentBlankIndex];
            elements.push(
                React.createElement('div', {
                    key: `blank-${currentBlankIndex}`,
                    onDrop: (e) => handleDrop(e, currentBlankIndex),
                    onDragOver: (e) => e.preventDefault(),
                    className: "inline-block text-center border-b-2 p-1 mx-1 min-w-[100px] align-bottom border-dashed border-gray-400",
                },
                    answer ? React.createElement('span', {
                        onClick: () => returnWordToBank(answer, currentBlankIndex),
                        className: 'bg-blue-100 text-blue-800 p-1 rounded cursor-pointer'
                    }, answer) : React.createElement('span', { className: 'text-gray-400' }, 'Drop here')
                )
            );
            blankCounter++;
        }
    });

    return React.createElement('div', null,
        React.createElement('div', { className: 'text-lg text-gray-800 leading-loose mb-8' }, elements),
        React.createElement('div', { className: 'mt-8 p-4 bg-gray-100 rounded-lg flex flex-wrap gap-3 justify-center' },
            wordBank.map((word, index) => (
                React.createElement('div', {
                    key: `${word}-${index}`,
                    draggable: true,
                    onDragStart: (e) => e.dataTransfer.setData("word", word),
                    className: 'px-4 py-2 bg-white border rounded-lg shadow-sm cursor-grab'
                }, word)
            ))
        )
    );
};

const ReadingMockTestPlayer = ({ navigateTo, setMockTestResult }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [error, setError] = useState(null);
    const timerRef = useRef(null);

    const handleSubmit = useCallback(() => {
        clearInterval(timerRef.current);
        const resultPayload = {
            questions: questions,
            userAnswers: userAnswers,
        };
        setMockTestResult(resultPayload);
        navigateTo('reading-mock-test-results');
    }, [questions, userAnswers, setMockTestResult, navigateTo]);
    
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const testSet = await generateReadingMockTestSet();
                setQuestions(testSet);
                const initialAnswers = {};
                testSet.forEach((q, index) => {
                    switch (q.type) {
                        case 're-order-paragraphs':
                            initialAnswers[index] = [...q.data.shuffledParagraphs];
                            break;
                        case 'fill-in-blanks-drag-drop':
                            const blankCount = (q.data.passageWithBlanks.match(/\{\{BLANK\}\}/g) || []).length;
                            initialAnswers[index] = new Array(blankCount).fill(null);
                            break;
                        case 'reading-multiple-choice-multiple':
                            initialAnswers[index] = [];
                            break;
                        case 'fill-in-blanks-dropdown':
                             initialAnswers[index] = {};
                             break;
                        default:
                            // For MCSA, we can leave it undefined, and it will default to null/empty.
                            break;
                    }
                });
                setUserAnswers(initialAnswers);
            } catch (err) {
                setError('Failed to load the mock test. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTest();
    }, []);

    useEffect(() => {
        if (!isLoading && questions.length > 0) {
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
    }, [isLoading, questions, handleSubmit]);
    
    const handleAnswerChange = (answer) => {
        setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const renderCurrentQuestion = () => {
        const question = questions[currentQuestionIndex];
        const userAnswer = userAnswers[currentQuestionIndex];
        
        switch (question.type) {
            case 'reading-multiple-choice-single':
                return React.createElement(MCSA_Question, { data: question.data, userAnswer: userAnswer, onAnswerChange: handleAnswerChange });
            case 'reading-multiple-choice-multiple':
                return React.createElement(MCMA_Question, { data: question.data, userAnswer: userAnswer, onAnswerChange: handleAnswerChange });
            case 're-order-paragraphs':
                return React.createElement(ROP_Question, { data: question.data, userAnswer: userAnswer, onAnswerChange: handleAnswerChange });
            case 'fill-in-blanks-drag-drop':
                return React.createElement(FIB_DD_Question, { data: question.data, userAnswer: userAnswer, onAnswerChange: handleAnswerChange });
            case 'fill-in-blanks-dropdown':
                 return React.createElement(FIB_D_Question, { data: question.data, userAnswer: userAnswer, onAnswerChange: handleAnswerChange });
            default:
                return React.createElement('p', null, `Unknown question type: ${question.type}`);
        }
    };

    if (isLoading) {
        return React.createElement('div', { className: 'flex flex-col items-center justify-center h-full min-h-[50vh]' },
            React.createElement('div', { className: "animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" }),
            React.createElement('p', { className: 'mt-4 text-gray-600' }, 'Preparing your mock test...')
        );
    }

    if (error) {
        return React.createElement('div', { className: 'text-red-600 bg-red-100 p-4 rounded-lg' }, error);
    }
    
    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6 md:p-8' },
            React.createElement('div', { className: 'flex justify-between items-center border-b pb-4 mb-6' },
                React.createElement('h2', { className: 'text-xl font-bold' }, `Question ${currentQuestionIndex + 1} of ${questions.length}`),
                React.createElement('div', { className: 'text-xl font-bold text-red-500' }, formatTime(timeLeft))
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2.5 mb-6' },
                React.createElement('div', { className: 'bg-blue-600 h-2.5 rounded-full', style: { width: `${progress}%` } })
            ),

            renderCurrentQuestion(),

            React.createElement('div', { className: 'flex justify-between mt-8 pt-6 border-t' },
                React.createElement('button', { onClick: handlePrev, disabled: currentQuestionIndex === 0, className: 'px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50' }, 'Previous'),
                currentQuestionIndex === questions.length - 1
                    ? React.createElement('button', { onClick: handleSubmit, className: 'px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600' }, 'Finish & See Results')
                    : React.createElement('button', { onClick: handleNext, className: 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600' }, 'Next')
            )
        )
    );
};

export default ReadingMockTestPlayer;