import React from 'react';
import { BackIcon, RefreshIcon } from './icons.js';

const calculateScore = (questions, userAnswers) => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const data = q.data;
        switch (q.type) {
            case 'reading-multiple-choice-single':
                maxScore += 1;
                if (userAnswer === data.correctAnswer) {
                    totalScore += 1;
                }
                break;
            case 'reading-multiple-choice-multiple':
                maxScore += data.correctAnswers.length;
                 if (userAnswer) {
                    let currentScore = 0;
                    userAnswer.forEach(ans => {
                        if (data.correctAnswers.includes(ans)) {
                            currentScore++;
                        } else {
                            currentScore--;
                        }
                    });
                    totalScore += Math.max(0, currentScore);
                }
                break;
            case 're-order-paragraphs':
                maxScore += data.correctOrder.length - 1;
                if (userAnswer) {
                    for (let i = 0; i < userAnswer.length - 1; i++) {
                        const correctIndex = data.correctOrder.indexOf(userAnswer[i]);
                        if (correctIndex !== -1 && correctIndex < data.correctOrder.length - 1) {
                            if (data.correctOrder[correctIndex + 1] === userAnswer[i+1]) {
                                totalScore++;
                            }
                        }
                    }
                }
                break;
            case 'fill-in-blanks-drag-drop':
            case 'fill-in-blanks-dropdown':
                const correctAnswers = q.type === 'fill-in-blanks-dropdown' ? data.blanks.map(b => b.correctAnswer) : data.correctAnswers;
                maxScore += correctAnswers.length;
                if (userAnswer) {
                    correctAnswers.forEach((correct, i) => {
                        const submittedAnswer = q.type === 'fill-in-blanks-dropdown' ? userAnswer[data.blanks[i].id] : userAnswer[i];
                        if (submittedAnswer && submittedAnswer.toLowerCase() === correct.toLowerCase()) {
                            totalScore++;
                        }
                    });
                }
                break;
            default:
                break;
        }
    });

    return { totalScore, maxScore };
};


const QuestionReview = ({ question, userAnswer }) => {
    const { type, data } = question;

    const renderHeader = (title) => React.createElement('div', { className: 'p-4 bg-gray-50 rounded-t-lg border-b' }, React.createElement('h3', { className: 'font-semibold text-lg text-gray-800' }, title));

    switch (type) {
        case 'reading-multiple-choice-single': {
            const isCorrect = userAnswer === data.correctAnswer;
            return React.createElement('div', null,
                renderHeader('Multiple Choice, Single Answer'),
                React.createElement('div', { className: 'p-4' },
                    React.createElement('p', { className: 'mb-4' }, React.createElement('strong', null, 'Your Answer: '), React.createElement('span', { className: isCorrect ? 'text-green-600' : 'text-red-600' }, userAnswer || 'Not Answered')),
                    React.createElement('p', { className: 'mb-2' }, React.createElement('strong', null, 'Correct Answer: '), React.createElement('span', { className: 'text-green-600' }, data.correctAnswer)),
                    !isCorrect && React.createElement('div', { className: 'mt-4 bg-red-50 p-3 rounded-lg border border-red-200' }, 'You did not select the correct option.')
                )
            );
        }
        case 'reading-multiple-choice-multiple': {
             return React.createElement('div', null,
                renderHeader('Multiple Choice, Multiple Answers'),
                 React.createElement('div', { className: 'p-4' },
                    React.createElement('p', { className: 'mb-2' }, React.createElement('strong', null, 'Your selections are highlighted below.')),
                    React.createElement('div', { className: 'space-y-2 mt-4' },
                        data.options.map((opt, i) => {
                            const isSelected = userAnswer && userAnswer.includes(opt);
                            const isCorrect = data.correctAnswers.includes(opt);
                            let className = 'p-3 rounded-md border ';
                            if (isCorrect) className += 'bg-green-100 border-green-300';
                            else if (isSelected && !isCorrect) className += 'bg-red-100 border-red-300 line-through';
                            else className += 'bg-gray-50 border-gray-200';
                            return React.createElement('p', { key: i, className: className }, isSelected ? `☑ ${opt}` : `☐ ${opt}`);
                        })
                    )
                )
            );
        }
        case 're-order-paragraphs': {
             return React.createElement('div', null,
                renderHeader('Re-order Paragraphs'),
                React.createElement('div', { className: 'p-4 grid grid-cols-1 md:grid-cols-2 gap-6' },
                    React.createElement('div', null,
                        React.createElement('h4', { className: 'font-semibold mb-2' }, 'Your Order:'),
                        React.createElement('div', { className: 'space-y-2' }, (userAnswer || []).map((p, i) => React.createElement('div', { key: p, className: 'p-2 bg-gray-100 rounded text-sm' }, `${i+1}. ${p.substring(0, 40)}...`)))
                    ),
                     React.createElement('div', null,
                        React.createElement('h4', { className: 'font-semibold mb-2 text-green-700' }, 'Correct Order:'),
                        React.createElement('div', { className: 'space-y-2' }, data.correctOrder.map((p, i) => React.createElement('div', { key: p, className: 'p-2 bg-green-50 rounded text-sm' }, `${i+1}. ${p.substring(0, 40)}...`)))
                    )
                )
             );
        }
        case 'fill-in-blanks-drag-drop':
        case 'fill-in-blanks-dropdown': {
             const correctAnswers = type === 'fill-in-blanks-dropdown' ? data.blanks.map(b => b.correctAnswer) : data.correctAnswers;
             return React.createElement('div', null,
                renderHeader('Fill in the Blanks'),
                 React.createElement('div', { className: 'p-4' },
                    React.createElement('ul', { className: 'list-decimal list-inside' },
                        correctAnswers.map((correct, i) => {
                             const submittedAnswer = type === 'fill-in-blanks-dropdown' 
                                ? (userAnswer ? userAnswer[data.blanks[i].id] : null) 
                                : (userAnswer ? userAnswer[i] : null);
                             const isCorrect = submittedAnswer && submittedAnswer.toLowerCase() === correct.toLowerCase();
                             return React.createElement('li', { key: i, className: 'mb-2' },
                                `Correct: `, React.createElement('strong', { className: 'text-green-600' }, correct),
                                ` | Your answer: `, React.createElement('span', { className: isCorrect ? 'text-green-600' : 'text-red-600' }, submittedAnswer || '—')
                            )
                        })
                    )
                 )
             );
        }
        default: return null;
    }
};

const ReadingMockTestResults = ({ navigateTo, results }) => {
    if (!results) {
        return React.createElement('div', { className: 'text-center' },
            React.createElement('p', null, 'No results available. Please complete a mock test first.'),
            React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg" }, 'Back to Dashboard')
        );
    }
    
    const { totalScore, maxScore } = calculateScore(results.questions, results.userAnswers);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    
    const getPerformanceColor = () => {
        if (percentage >= 75) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Reading Mock Test Results'),
        React.createElement('p', { className: 'text-gray-600 mb-8' }, 'Review your performance and identify areas for improvement.'),

        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-8 mb-8 text-center' },
            React.createElement('h2', { className: 'text-xl font-semibold text-gray-700' }, 'Your Overall Score'),
            React.createElement('p', { className: `text-7xl font-bold my-2 ${getPerformanceColor()}` }, `${percentage}%`),
            React.createElement('p', { className: 'text-lg text-gray-600' }, `You scored `, React.createElement('strong', null, totalScore), ` out of `, React.createElement('strong', null, maxScore), ` possible points.`),
            React.createElement('div', { className: 'flex justify-center gap-4 mt-8' },
                 React.createElement('button', { onClick: () => navigateTo('reading-mock-test-player'), className: 'flex items-center px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700' }, React.createElement(RefreshIcon, { className: 'w-5 h-5 mr-2' }), 'Try Again'),
                 React.createElement('button', { onClick: () => navigateTo('dashboard'), className: 'flex items-center px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300' }, React.createElement(BackIcon, { className: 'w-5 h-5 mr-2' }), 'Back to Dashboard')
            )
        ),
        
        React.createElement('div', { className: 'space-y-6' },
             React.createElement('h2', { className: 'text-2xl font-bold text-gray-800' }, 'Answer Review'),
            results.questions.map((question, index) => (
                React.createElement('div', { key: index, className: 'bg-white rounded-xl shadow-md' },
                    React.createElement(QuestionReview, {
                        question: question,
                        userAnswer: results.userAnswers[index]
                    })
                )
            ))
        )
    );
};

export default ReadingMockTestResults;