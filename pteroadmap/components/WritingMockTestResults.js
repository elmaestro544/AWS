import React, { useState, useEffect } from 'react';
import { scoreSummarizeWrittenTextAttempt, scoreWriteEssayAttempt } from '../services/geminiService.js';
import { BackIcon, RefreshIcon } from './icons.js';
import ScoreDisplay from './ScoreDisplay.js';

const QuestionReview = ({ question, userAnswer, score }) => {
    const { type, data } = question;
    let scoreItems = [];
    
    if (type === 'summarize-written-text' && score) {
        scoreItems = [
            { label: "Content", value: score.content, maxValue: 2 },
            { label: "Form", value: score.form, maxValue: 1 },
            { label: "Grammar", value: score.grammar, maxValue: 2 },
            { label: "Vocabulary", value: score.vocabulary, maxValue: 2 }
        ];
    } else if (type === 'write-essay' && score) {
        scoreItems = [
            { label: "Content", value: score.content, maxValue: 3 },
            { label: "Form", value: score.form, maxValue: 2 },
            { label: "Development", value: score.development, maxValue: 2 },
            { label: "Grammar", value: score.grammar, maxValue: 2 },
            { label: "Linguistic Range", value: score.linguisticRange, maxValue: 2 },
            { label: "Vocabulary", value: score.vocabulary, maxValue: 2 },
            { label: "Spelling", value: score.spelling, maxValue: 2 }
        ];
    }
    
    const questionTitle = type === 'summarize-written-text' ? 'Summarize Written Text' : 'Write Essay';
    const originalContent = type === 'summarize-written-text' ? data.passage : data.prompt;

    return React.createElement('div', { className: 'bg-white rounded-xl shadow-md overflow-hidden' },
        React.createElement('div', { className: 'p-4 bg-gray-50 border-b' },
            React.createElement('h3', { className: 'font-semibold text-lg text-gray-800' }, questionTitle)
        ),
        React.createElement('div', { className: 'p-6' },
            React.createElement('div', { className: 'mb-6' },
                React.createElement('h4', { className: 'font-semibold text-gray-700 mb-2' }, 'Original Prompt/Passage:'),
                React.createElement('div', { className: 'prose prose-sm max-w-none text-gray-600 p-4 bg-gray-100 rounded-md h-40 overflow-y-auto' },
                    originalContent.split('\n').map((p, i) => React.createElement('p', { key: i }, p))
                )
            ),
            React.createElement('div', { className: 'mb-6' },
                React.createElement('h4', { className: 'font-semibold text-gray-700 mb-2' }, 'Your Answer:'),
                React.createElement('div', { className: 'prose prose-sm max-w-none text-gray-800 p-4 bg-blue-50 border border-blue-200 rounded-md h-40 overflow-y-auto' },
                    (userAnswer || "You did not provide an answer.").split('\n').map((p, i) => React.createElement('p', { key: i }, p))
                )
            ),
            !score ? (
                React.createElement('div', { className: 'flex items-center justify-center' },
                    React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500' }),
                    React.createElement('p', { className: 'ml-3 text-gray-600' }, 'Analyzing your response...')
                )
            ) : (
                React.createElement(ScoreDisplay, { scoreItems: scoreItems, feedback: score.feedback })
            )
        )
    );
};

const WritingMockTestResults = ({ navigateTo, results }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [scores, setScores] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const scoreAllAttempts = async () => {
            if (!results || !results.questions) return;
            setIsLoading(true);
            
            const scorePromises = results.questions.map((q, index) => {
                const userAnswer = results.userAnswers[index] || '';
                if (q.type === 'summarize-written-text') {
                    return scoreSummarizeWrittenTextAttempt(q.data.passage, userAnswer);
                }
                if (q.type === 'write-essay') {
                    return scoreWriteEssayAttempt(q.data.prompt, userAnswer);
                }
                return Promise.resolve(null);
            });

            try {
                const allScores = await Promise.all(scorePromises);
                setScores(allScores);
            } catch (err) {
                setError('Failed to get scores for your test. The AI model may be busy. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        scoreAllAttempts();
    }, [results]);

    if (!results) {
        return React.createElement('div', { className: 'text-center' },
            React.createElement('p', null, 'No results available. Please complete a mock test first.'),
            React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg" }, 'Back to Dashboard')
        );
    }

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Writing Mock Test Results'),
        React.createElement('p', { className: 'text-gray-600 mb-8' }, 'Review your AI-powered scores and feedback for each question.'),

        error && React.createElement('div', { className: 'text-red-600 bg-red-100 p-4 rounded-lg mb-6' }, error),

        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-8 mb-8 text-center' },
            React.createElement('h2', { className: 'text-xl font-semibold text-gray-700' }, 'Review Complete'),
             React.createElement('p', { className: 'text-lg text-gray-600 mt-2' }, 'Your detailed scores and feedback are shown below.'),
            React.createElement('div', { className: 'flex justify-center gap-4 mt-8' },
                 React.createElement('button', { onClick: () => navigateTo('writing-mock-test-player'), className: 'flex items-center px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700' }, React.createElement(RefreshIcon, { className: 'w-5 h-5 mr-2' }), 'Try Again'),
                 React.createElement('button', { onClick: () => navigateTo('dashboard'), className: 'flex items-center px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300' }, React.createElement(BackIcon, { className: 'w-5 h-5 mr-2' }), 'Back to Dashboard')
            )
        ),
        
        React.createElement('div', { className: 'space-y-6' },
             React.createElement('h2', { className: 'text-2xl font-bold text-gray-800' }, 'Answer Review'),
            results.questions.map((question, index) => (
                React.createElement(QuestionReview, {
                    key: index,
                    question: question,
                    userAnswer: results.userAnswers[index],
                    score: scores[index]
                })
            ))
        )
    );
};

export default WritingMockTestResults;
