import React, { useState, useEffect } from 'react';
import { scoreSummarizeSpokenTextAttempt, scoreWriteFromDictationAttempt } from '../services/geminiService.js';
import { BackIcon, RefreshIcon } from './icons.js';
import ScoreDisplay from './ScoreDisplay.js';

const QuestionReview = ({ question, userAnswer, score }) => {
    const { type, data } = question;

    const renderHeader = (title) => React.createElement('div', { className: 'p-4 bg-gray-50 rounded-t-lg border-b' }, React.createElement('h3', { className: 'font-semibold text-lg text-gray-800' }, title));
    
    const UserAnswerDisplay = ({ children }) => React.createElement('div', { className: 'prose prose-sm max-w-none text-gray-800 p-4 bg-blue-50 border border-blue-200 rounded-md min-h-[50px] overflow-y-auto' }, children);
    const CorrectAnswerDisplay = ({ title, children }) => React.createElement('div', { className: 'mt-4' }, React.createElement('h4', { className: 'font-semibold text-gray-700 mb-2' }, title), children);

    const renderContent = () => {
        if (type === 'summarize-spoken-text') {
            const scoreItems = score ? [ { label: "Content", value: score.content, maxValue: 2 }, { label: "Form", value: score.form, maxValue: 2 }, { label: "Grammar", value: score.grammar, maxValue: 2 }, { label: "Vocabulary", value: score.vocabulary, maxValue: 2 }, { label: "Spelling", value: score.spelling, maxValue: 2 } ] : [];
            return React.createElement('div', null,
                renderHeader('Summarize Spoken Text'),
                React.createElement('div', { className: 'p-6' },
                    React.createElement(UserAnswerDisplay, null, React.createElement('p', null, userAnswer || "Not Answered")),
                    !score ? React.createElement('p', {className: 'text-center mt-4'}, 'Analyzing...') : React.createElement(ScoreDisplay, { scoreItems, feedback: score.feedback })
                )
            );
        }
        if (type.startsWith('write-from-dictation')) {
            const scoreItems = score ? [{ label: "Accuracy", value: score.score, maxValue: score.maxScore }] : [];
            return React.createElement('div', null,
                renderHeader('Write From Dictation'),
                 React.createElement('div', { className: 'p-6' },
                    React.createElement(UserAnswerDisplay, null, React.createElement('p', null, userAnswer || "Not Answered")),
                    !score ? React.createElement('p', {className: 'text-center mt-4'}, 'Analyzing...') : React.createElement(React.Fragment, null,
                        React.createElement(ScoreDisplay, { scoreItems, feedback: score.feedback }),
                        React.createElement(CorrectAnswerDisplay, { title: 'Correct Sentence:' }, React.createElement('p', { className: 'text-green-700 p-2 bg-green-50 rounded' }, data.sentence))
                    )
                 )
            );
        }
         if (type === 'listening-multiple-choice-multiple') {
            return React.createElement('div', null,
                renderHeader('Multiple Choice, Multiple Answers'),
                React.createElement('div', { className: 'p-6 space-y-2' },
                    data.options.map(opt => {
                        const isSelected = userAnswer.includes(opt);
                        const isCorrect = data.correctAnswers.includes(opt);
                        let className = 'p-3 rounded-md border ';
                        if (isCorrect) className += 'bg-green-100 border-green-300';
                        else if (isSelected) className += 'bg-red-100 border-red-300 line-through';
                        else className += 'bg-gray-50 border-gray-200';
                        return React.createElement('p', { key: opt, className: className }, isSelected ? `☑ ${opt}` : `☐ ${opt}`);
                    })
                )
            );
        }
        if (type === 'fill-in-blanks-listening') {
             return React.createElement('div', null,
                renderHeader('Fill in the Blanks'),
                React.createElement('div', { className: 'p-6' },
                    React.createElement('ul', { className: 'list-decimal list-inside' },
                        data.correctAnswers.map((correct, i) => React.createElement('li', { key: i, className: 'mb-2' },
                           `Correct: `, React.createElement('strong', { className: 'text-green-600' }, correct),
                           ` | Your answer: `, React.createElement('span', { className: (userAnswer[i] && userAnswer[i].toLowerCase() === correct.toLowerCase()) ? 'text-green-600' : 'text-red-600' }, userAnswer[i] || '—')
                        ))
                    )
                 )
             );
        }
        if (type === 'highlight-incorrect-words') {
             const selected = userAnswer.map(w => w.split('-')[0]);
             return React.createElement('div', null,
                renderHeader('Highlight Incorrect Words'),
                React.createElement('div', { className: 'p-6' },
                    React.createElement('p', null, 'Correctly identified incorrect words are in green. Your incorrect selections are struck through in red.'),
                    React.createElement('div', { className: 'mt-4 p-4 bg-gray-50 rounded' }, data.displayedTranscript.split(/(\s+)/).map((word, index) => {
                        if (word.trim() === '') return word;
                        const cleanWord = word.replace(/[.,]/g, '');
                        const isCorrectlyId = data.incorrectWords.includes(cleanWord) && selected.includes(cleanWord);
                        const isIncorrectlyId = !data.incorrectWords.includes(cleanWord) && selected.includes(cleanWord);
                        let className = 'px-1 ';
                        if (isCorrectlyId) className += 'bg-green-200 text-green-800 rounded';
                        else if(isIncorrectlyId) className += 'bg-red-200 text-red-800 rounded line-through';
                        return React.createElement('span', { key: index, className }, word);
                    }))
                )
             );
        }
        return null;
    };
    return React.createElement('div', { className: 'bg-white rounded-xl shadow-md' }, renderContent());
};


const ListeningMockTestResults = ({ navigateTo, results }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [scores, setScores] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!results || !results.questions) {
            setIsLoading(false);
            return;
        }

        const scoreAll = async () => {
            const promises = results.questions.map((q, i) => {
                const ua = results.userAnswers[i];
                if (q.type === 'summarize-spoken-text') return scoreSummarizeSpokenTextAttempt(ua, q.data.transcript);
                if (q.type.startsWith('write-from-dictation')) return scoreWriteFromDictationAttempt(q.data.sentence, ua);
                // For non-AI questions, return a pre-calculated score object
                if (q.type === 'listening-multiple-choice-multiple') {
                    let score = 0;
                    ua.forEach(ans => score += q.data.correctAnswers.includes(ans) ? 1 : -1);
                    return Promise.resolve({ score: Math.max(0, score), maxScore: q.data.correctAnswers.length });
                }
                if (q.type === 'fill-in-blanks-listening') {
                    let score = 0;
                    q.data.correctAnswers.forEach((correct, i) => { if (ua[i] && ua[i].toLowerCase() === correct.toLowerCase()) score++; });
                    return Promise.resolve({ score, maxScore: q.data.correctAnswers.length });
                }
                if (q.type === 'highlight-incorrect-words') {
                    let score = 0;
                    const selected = ua.map(w => w.split('-')[0]);
                    selected.forEach(word => score += q.data.incorrectWords.includes(word) ? 1 : -1);
                    return Promise.resolve({ score: Math.max(0, score), maxScore: q.data.incorrectWords.length });
                }
                return Promise.resolve(null);
            });
            try {
                const allScores = await Promise.all(promises);
                setScores(allScores);
            } catch (err) {
                setError('Failed to get scores. The AI model may be busy.');
            } finally {
                setIsLoading(false);
            }
        };
        scoreAll();
    }, [results]);

    if (!results) {
        return React.createElement('div', { className: 'text-center p-8' },
            React.createElement('p', null, 'No results available.'),
            React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg" }, 'Back to Dashboard')
        );
    }

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Listening Mock Test Results'),
        React.createElement('p', { className: 'text-gray-600 mb-8' }, 'Review your performance and feedback.'),
        error && React.createElement('div', { className: 'text-red-600 bg-red-100 p-4 rounded-lg mb-6' }, error),
        
        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-8 mb-8 text-center' },
            React.createElement('h2', { className: 'text-xl font-semibold text-gray-700' }, isLoading ? 'Scoring in Progress...' : 'Review Complete'),
            React.createElement('p', { className: 'text-lg text-gray-600 mt-2' }, isLoading ? 'Please wait while our AI analyzes your performance.' : 'Your detailed scores and feedback are shown below.'),
            React.createElement('div', { className: 'flex justify-center gap-4 mt-8' },
                 React.createElement('button', { onClick: () => navigateTo('listening-mock-test-player'), className: 'flex items-center px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-md' }, React.createElement(RefreshIcon, { className: 'w-5 h-5 mr-2' }), 'Try Again'),
                 React.createElement('button', { onClick: () => navigateTo('dashboard'), className: 'flex items-center px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg' }, React.createElement(BackIcon, { className: 'w-5 h-5 mr-2' }), 'Back to Dashboard')
            )
        ),
        
        React.createElement('div', { className: 'space-y-6' },
             React.createElement('h2', { className: 'text-2xl font-bold text-gray-800' }, 'Answer Review'),
            results.questions.map((question, index) => React.createElement(QuestionReview, {
                key: `${question.type}-${index}`,
                question: question,
                userAnswer: results.userAnswers[index],
                score: scores[index]
            }))
        )
    );
};

export default ListeningMockTestResults;