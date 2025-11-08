import React, { useState, useEffect, useCallback } from 'react';
import { generateSummarizeWrittenTextQuestion, scoreSummarizeWrittenTextAttempt } from '../services/geminiService.js';
import { BackIcon, RefreshIcon } from './icons.js';
import ScoreDisplay from './ScoreDisplay.js';

const SummarizeWrittenTextPractice = ({ navigateTo }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [questionPassage, setQuestionPassage] = useState('');
    const [userSummary, setUserSummary] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [score, setScore] = useState(null);
    const [error, setError] = useState(null);

    const fetchNewQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setScore(null);
        setUserSummary('');
        setWordCount(0);
        try {
            const passage = await generateSummarizeWrittenTextQuestion();
            setQuestionPassage(passage);
        } catch (err) {
            setError('Failed to fetch a new passage. Please check your API key and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNewQuestion();
    }, [fetchNewQuestion]);

    const handleSummaryChange = (e) => {
        const text = e.target.value;
        setUserSummary(text);
        const words = text.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
    };

    const handleSubmit = async () => {
        if (wordCount < 5 || wordCount > 75) {
            setError('Your summary must be between 5 and 75 words.');
            return;
        }
        setIsAnalyzing(true);
        setError(null);
        setScore(null);
        try {
            const analysis = await scoreSummarizeWrittenTextAttempt(questionPassage, userSummary);
            setScore(analysis);
        } catch (err) {
            setError('Failed to analyze your summary. The AI model might be busy. Please try again.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderScore = () => {
        if (!score) return null;
        const scoreItems = [
            { label: "Content", value: score.content, maxValue: 2 },
            { label: "Form", value: score.form, maxValue: 1 },
            { label: "Grammar", value: score.grammar, maxValue: 2 },
            { label: "Vocabulary", value: score.vocabulary, maxValue: 2 }
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
        React.createElement('h1', { className: "text-3xl font-bold text-gray-900" }, 'Summarize Written Text'),
        React.createElement('p', { className: "text-gray-600 my-2" }, 'Read the passage below and summarize it in a single sentence. Your summary should be between 5 and 75 words.'),
        
        React.createElement('div', { className: "mt-6 bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/30" },
            isLoading ? (
                React.createElement('div', { className: "flex justify-center items-center h-60" },
                    React.createElement('div', { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" })
                )
            ) : error && !questionPassage ? (
                React.createElement('div', { className: "text-red-600 bg-red-100 p-4 rounded-lg" }, error)
            ) : (
                React.createElement('div', { className: "prose max-w-none text-gray-700 leading-relaxed" }, 
                    questionPassage.split('\n').map((para, index) => React.createElement('p', { key: index }, para))
                )
            )
        ),
        
        React.createElement('div', { className: "mt-6" },
            React.createElement('textarea', {
                value: userSummary,
                onChange: handleSummaryChange,
                className: "w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow",
                rows: "4",
                placeholder: "Write your one-sentence summary here...",
                disabled: isLoading
            }),
            React.createElement('div', { className: `text-sm mt-2 ${wordCount < 5 || wordCount > 75 ? 'text-red-500' : 'text-gray-500'}`},
                 `Word Count: ${wordCount}`
            )
        ),

        React.createElement('div', { className: "mt-6 flex flex-col sm:flex-row items-center justify-center gap-4" },
             React.createElement('button', {
                onClick: handleSubmit,
                disabled: !userSummary || isAnalyzing || isLoading,
                className: "w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
            }, isAnalyzing ? 'Analyzing...' : 'Get Score'),
            React.createElement('button', {
                onClick: fetchNewQuestion,
                disabled: isLoading || isAnalyzing,
                className: "w-full sm:w-auto p-3 text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors",
                'aria-label': "Next Question"
            }, React.createElement(RefreshIcon, { className: "w-6 h-6" }))
        ),
        
        error && questionPassage && (
             React.createElement('div', { className: "mt-4 text-center text-red-600" }, error)
        ),
        
        isAnalyzing && (
            React.createElement('div', { className: "flex justify-center items-center mt-8" },
                React.createElement('div', { className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" }),
                React.createElement('p', { className: "ml-4 text-gray-600" }, 'AI is analyzing your summary...')
            )
        ),
        
        !isAnalyzing && renderScore()
    );
};

export default SummarizeWrittenTextPractice;