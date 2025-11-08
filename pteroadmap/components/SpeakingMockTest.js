import React from 'react';
import { BackIcon, CheckSolidCircleIcon } from './icons.js';

const SpeakingMockTest = ({ navigateTo }) => {
    const speakingSections = [
        {
            title: "Read Aloud",
            description: "It aims to assess your reading and speaking abilities, ensuring you can read the text with correct intonation and pronunciation. Engage in multiple practice sessions before the exam to maintain your reading pace and fluency in speaking.",
            details: [
                { label: "Length", value: "Upto 60 words" },
                { label: "Answer Time", value: "60 seconds" },
                { label: "Number of questions", value: "1-2" }
            ]
        },
        {
            title: "Sentence Repeat",
            description: "In PTE sentence repeat, it demonstrates your ability to comprehend and recall spoken sentences accurately. You are required to repeat the sentence with a precise accent and pronunciation without replaying the audio.",
            details: [
                { label: "Length", value: "3-9 seconds" },
                { label: "Answer Time", value: "15 seconds" },
                { label: "Number of questions", value: "10-12" }
            ]
        },
        {
            title: "Describe Picture",
            description: "In this, you have to describe an image and you're allotted 25 seconds to capture its essence. Then a tap on the mic signifies the moment to deliver a meaningful explanation.",
            details: [
                { label: "Length", value: "25 seconds" },
                { label: "Answer Time", value: "40 seconds" },
                { label: "Number of questions", value: "3-4" }
            ]
        },
        {
            title: "Re-tell Lecture",
            description: "Your speaking and listening proficiencies are evaluated here. You'll listen to a voice prompt of up to 90 seconds and then rephrase it within a 40-second timeframe.",
            details: [
                { label: "Length", value: "upto 90 seconds" },
                { label: "Answer Time", value: "40 seconds" },
                { label: "Number of questions", value: "1-2" }
            ]
        },
        {
            title: "Answer short questions",
            description: "In this, you must respond to the question with one or multiple words. Your answer should be delivered clearly and loudly within a 3-second timeframe.",
            details: [
                { label: "Length", value: "3-9 seconds" },
                { label: "Answer Time", value: "10 seconds" },
                { label: "Number of questions", value: "5-6" }
            ]
        }
    ];

    const skills = [
        { title: 'Pronunciation', description: 'Your capability includes pronouncing the correct words and phrases clearly, ensuring accurate sentence formation during PTE speaking practice and PTE speaking mock tests.' },
        { title: 'Intonation', description: 'For your speech to be effective, it\'s imperative to maintain proper intonation and stress of every syllable throughout the PTE speaking test.' },
        { title: 'Fluency', description: 'Oral fluency is enhanced by speaking in a regular, audible tone, which improves performance in PTE speaking practice and PTE speaking mock tests.' },
        { title: 'Better Understanding', description: 'Rearrange the key points from the image format to enhance your comprehension.' },
        { title: 'Discourse', description: 'Ensure proper grammar and pronunciation are utilized to comprehend native speakers.' },
        { title: 'Structure', description: 'Arrange your thoughts using appropriate structure and formatting.' },
    ];


    return React.createElement('div', { className: 'max-w-6xl mx-auto' },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-6 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),

        React.createElement('div', { className: 'text-center mb-12' },
            React.createElement('h1', { className: 'text-3xl md:text-4xl font-bold text-gray-900' }, "Patterns of Questions in"),
            React.createElement('h2', { className: 'mt-2 text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' }, "PTE Speaking Practice Test"),
            React.createElement('div', { className: 'mt-6 max-w-4xl mx-auto prose text-gray-600' },
                React.createElement('p', null, "This section familiarizes you with the various question types in the PTE Speaking test. Each task evaluates different aspects of your spoken English. When you're ready, start the interactive mock test to get AI-powered feedback on your fluency and pronunciation."),
            ),
            React.createElement('button', {
                onClick: () => navigateTo('speaking-mock-test-player'),
                className: 'mt-8 px-10 py-4 text-lg font-semibold text-white bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105'
            }, "Start Speaking Mock Test")
        ),

        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16' },
            speakingSections.map(section => (
                React.createElement('div', { key: section.title, className: 'bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col' },
                    React.createElement('h3', { className: 'text-lg font-bold text-gray-900 mb-3' }, section.title),
                    React.createElement('p', { className: 'text-sm text-gray-600 mb-4 flex-grow' }, section.description),
                    React.createElement('ul', { className: 'space-y-1 text-sm text-gray-700 list-disc list-inside mt-auto' },
                        section.details.map(detail => React.createElement('li', { key: detail.label }, React.createElement('strong', null, `${detail.label} - `), detail.value))
                    )
                )
            ))
        ),
        
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' },
            React.createElement('div', { className: 'bg-white p-8 rounded-2xl shadow-lg border border-gray-100' },
                React.createElement('h2', { className: 'text-2xl font-bold text-gray-900 mb-2' }, 'What is the skill set required for'),
                React.createElement('span', { className: 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' }, 'the PTE speaking?'),
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
                    src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop',
                    alt: 'Person studying on a laptop',
                    className: 'relative w-full h-full object-cover' 
                })
            )
        )
    );
};

export default SpeakingMockTest;