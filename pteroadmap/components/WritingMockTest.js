import React from 'react';
import { BackIcon, CheckSolidCircleIcon } from './icons.js';

const WritingMockTest = ({ navigateTo }) => {
    const skills = [
        { title: 'Determine primary goal', description: 'Familiarize yourself with the purpose and vital information contained in the letter as part of consistent PTE writing practice.' },
        { title: 'Include correct paragraph', description: 'Craft introductions and conclusions to establish the proper framework for any PTE writing task.' },
        { title: 'Write illustrative', description: 'Write illustrative content and generate narrative paragraphs and theoretical frameworks while regularly using our PTE writing practice test to refine your skills.' },
        { title: 'Formulate writing framework', description: 'Incorporating compensation statements as an element of supporting viewpoints.' },
        { title: 'Understand the framework', description: 'Understand the structure and craft interconnected contours.' },
        { title: 'Note Writing', description: 'Utilize notes to write a summary of your main concepts.' },
    ];

    return React.createElement('div', { className: 'max-w-6xl mx-auto' },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-6 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),

        React.createElement('div', { className: 'text-center mb-12' },
            React.createElement('h1', { className: 'text-3xl md:text-4xl font-bold text-gray-900' }, "PTE Writing Patterns of Questions in"),
            React.createElement('h2', { className: 'mt-2 text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500' }, "PTE Writing Practice Mock Test:"),
             React.createElement('div', { className: 'mt-6 max-w-4xl mx-auto prose text-gray-600' },
                React.createElement('p', null, "This section familiarizes you with the two question types in the PTE Writing test. Each task has specific requirements for time and word count. When you're ready, start the interactive mock test to simulate real exam conditions and get AI-powered feedback."),
            ),
            React.createElement('button', {
                onClick: () => navigateTo('writing-mock-test-player'),
                className: 'mt-8 px-10 py-4 text-lg font-semibold text-white bg-gradient-to-br from-[#fd746c] to-[#ff9068] rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105'
            }, "Start Writing Mock Test")
        ),

        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-8 mb-16' },
            // Summarize written test card
            React.createElement('div', { className: 'bg-white p-8 rounded-2xl shadow-lg border border-gray-100' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-900 mb-4' }, 'Summarize written test'),
                React.createElement('p', { className: 'text-gray-600 mb-6' }, 'This task measures your skill in analyzing key points and integrating provided information. Your task is to summarize the passage. Start by listing the key points and then craft the summary paragraph accordingly.'),
                React.createElement('ul', { className: 'space-y-2 text-gray-700 list-disc list-inside' },
                    React.createElement('li', null, React.createElement('strong', null, 'Length - '), 'Upto 75 words'),
                    React.createElement('li', null, React.createElement('strong', null, 'Answer Time - '), '10 minutes'),
                    React.createElement('li', null, React.createElement('strong', null, 'Number of questions - '), '1-2')
                )
            ),
            // Write essay card
            React.createElement('div', { className: 'bg-white p-8 rounded-2xl shadow-lg border border-gray-100' },
                React.createElement('h3', { className: 'text-xl font-bold text-gray-900 mb-4' }, 'Write essay'),
                React.createElement('p', { className: 'text-gray-600 mb-6' }, 'The art of essay writing tests your skill in articulating, comprehensive, and convincing arguments concerning a specified topic. Utilizing standard academic language is important for achieving favorable assessments.'),
                 React.createElement('ul', { className: 'space-y-2 text-gray-700 list-disc list-inside' },
                    React.createElement('li', null, React.createElement('strong', null, 'Length - '), '200-300 words'),
                    React.createElement('li', null, React.createElement('strong', null, 'Answer Time - '), '20 minutes'),
                    React.createElement('li', null, React.createElement('strong', null, 'Number of questions - '), '1-2')
                )
            )
        ),

        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' },
            React.createElement('div', { className: 'bg-white p-8 rounded-2xl shadow-lg border border-gray-100' },
                React.createElement('h2', { className: 'text-2xl font-bold text-gray-900 mb-2' }, 'What is the skill set Required for'),
                React.createElement('span', { className: 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500' }, 'PTE writing?'),
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
                    src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop',
                    alt: 'Person studying on a laptop',
                    className: 'relative w-full h-full object-cover' 
                })
            )
        )
    );
};

export default WritingMockTest;
