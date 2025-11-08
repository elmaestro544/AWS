import React from 'react';
import { BackIcon, CheckSolidCircleIcon } from './icons.js';

const ListeningMockTest = ({ navigateTo }) => {

    const listeningSections = [
        { title: "Summarize Spoken text", details: { Length: "60-90 seconds", Skills: "Listening & Writing", "Number of questions": "1-2" }, description: "In this segment, candidates will be presented with audio clips lasting approximately 60-90 seconds. After this, you must craft a summary of the spoken material." },
        { title: "Multiple choice: choose multiple answers", details: { Length: "40-90 seconds", Skills: "Listening", "Number of questions": "1-2" }, description: "Pick answers for multiple-choice queries to evaluate your skill in explaining, analyzing, and appraising audio or video content on any academic subject." },
        { title: "Multiple choice choose single answer", details: { Length: "30-60 seconds", Skills: "Listening", "Number of questions": "1-2" }, description: "Analyze and interpret single-option multiple-choice selections and evaluate scientific documentation. Listen attentively to the audio, as it will be played only once." },
        { title: "Highlight correct summary", details: { Length: "15-50 seconds", Skills: "Listening & Reading", "Number of questions": "1-2" }, description: "Evaluate your ability to analyze, comprehend, and integrate information presented in records, with an emphasis on the most accurate interpretation of the data." },
        { title: "Fill in the blanks", details: { Length: "60-90 seconds", Skills: "Listening & Writing", "Number of questions": "1-2" }, description: "The objective of this task is to confirm your skill in listening and completing missing words in the text by listening to the recording." },
        { title: "Select missing word", details: { Length: "20-70 seconds", Skills: "Listening", "Number of questions": "1-2" }, description: "To determine one’s aptitude in predicting a speaker’s intended message, we can utilize the contextual hints provided in the recording." },
        { title: "Highlight incorrect words", details: { Length: "15-50 seconds", Skills: "Listening & Reading", "Number of questions": "2-3" }, description: "Examine your listening aptitude and recognize the difference between transcription and recording." },
        { title: "Write from dictation", details: { Length: "3-5 seconds", Skills: "Listening & Writing", "Number of questions": "3-4" }, description: "Assess your listening, spelling, and sentence recall skills by transcribing sentences word-for-word with correct spelling." }
    ];

    const skills = [
        { title: "Organizing the Data", description: "It's essential to categorize and arrange the information you receive. Practicing with a PTE listening practice test helps you train your mind to filter and organize details just like in the real exam." },
        { title: "Recognize Indicators", description: "Verbal guidance summarizes the key points discussed in the speech. Through consistent PTE listening practice and exposure to real exam-style material, you'll get better at identifying these indicators quickly." },
        { title: "Understand Language", description: "Interpreting metaphorical language and differentiating between factual information from opinions is vital. A PTE listening mock test offers you exam-like scenarios, while a free PTE practice test can help you get started without cost, ensuring you build accuracy and confidence step by step." },
        { title: "Identify explicit details", description: "Identifying the main idea sentences within the text and crafting responses." },
        { title: "Draw conclusions", description: "Use retelling to integrate data from the provided information and make conclusions." },
        { title: "Identifying Definitions", description: "Recognition of definitions, examples, summarization, and key elements of identification." }
    ];

    return React.createElement('div', { className: 'max-w-7xl mx-auto' },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-6 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),

        React.createElement('div', { className: 'text-center mb-12' },
            React.createElement('h1', { className: 'text-3xl md:text-4xl font-bold text-gray-900' }, "PTE Listening Format, Patterns, Modules,"),
            React.createElement('h2', { className: 'mt-2 text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400' }, "Templates In PTE Listening Practice Test:"),
            React.createElement('button', {
                onClick: () => navigateTo('listening-mock-test-player'),
                className: 'mt-8 px-10 py-4 text-lg font-semibold text-white bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105'
            }, "Start Listening Mock Test")
        ),

        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16' },
            listeningSections.map(section => (
                React.createElement('div', { key: section.title, className: 'bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col' },
                    React.createElement('h3', { className: 'text-lg font-bold text-gray-900 mb-3' }, section.title),
                    React.createElement('p', { className: 'text-sm text-gray-600 mb-4 flex-grow' }, section.description),
                    React.createElement('ul', { className: 'space-y-1 text-xs text-gray-700 list-disc list-inside mt-auto' },
                        Object.entries(section.details).map(([key, value]) => React.createElement('li', { key: key }, React.createElement('strong', null, `${key} - `), value))
                    )
                )
            ))
        ),
        
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' },
            React.createElement('div', { className: 'bg-white p-8 rounded-2xl shadow-lg border border-gray-100' },
                React.createElement('h2', { className: 'text-2xl font-bold text-gray-900 mb-2' }, 'Easy 3 Steps On How To Improve Your PTE Listening Score'),
                React.createElement('span', { className: 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400' }, 'In PTE Listening Exam'),
                React.createElement('div', { className: 'mt-8 space-y-6' },
                    skills.map(skill => (
                        React.createElement('div', { key: skill.title, className: 'flex items-start' },
                            React.createElement(CheckSolidCircleIcon, { className: 'w-8 h-8 text-gray-800 mr-4 flex-shrink-0 mt-1' }),
                            React.createElement('div', null,
                                React.createElement('h4', { className: 'font-semibold text-gray-800' }, skill.title),
                                React.createElement('p', { className: 'text-gray-600 text-sm' }, skill.description)
                            )
                        )
                    ))
                ),
                React.createElement('button', {
                    className: 'mt-8 text-sm font-semibold text-white px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                }, 'Read less')
            ),
             React.createElement('div', { className: 'relative h-full min-h-[500px] rounded-2xl overflow-hidden shadow-lg flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-50 to-white' },
                 React.createElement('img', { 
                    src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1887&auto=format&fit=crop',
                    alt: 'Person studying with headphones',
                    className: 'relative w-full h-full object-cover' 
                })
            )
        )
    );
};

export default ListeningMockTest;