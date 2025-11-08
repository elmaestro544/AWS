import React from 'react';
import { BackIcon, CheckSolidCircleIcon } from './icons.js';

const InfoCard = ({ title, children, details }) => (
    React.createElement('div', { className: 'bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col' },
        React.createElement('h3', { className: 'text-xl font-bold text-gray-900 mb-4' }, title),
        React.createElement('div', { className: 'prose prose-sm max-w-none text-gray-700 flex-grow' }, children),
        React.createElement('ul', { className: 'mt-6 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-700 list-disc list-inside' },
            details.map((detail, index) => (
                React.createElement('li', { key: index },
                    React.createElement('strong', null, `${detail.label} - `),
                    detail.value
                )
            ))
        )
    )
);

const ReadingMockTest = ({ navigateTo }) => {
    const readingSections = [
        {
            title: "Fill in the Blanks – Reading and Writing",
            description: React.createElement(React.Fragment, null,
                React.createElement('p', null, "For this question type, you need to pick the best words from the list provided. Look for the main idea to find the correct answer quickly."),
                React.createElement('p', null, "Having a broad vocabulary is important for this question because many of the words are synonyms, and you have to decide which one fits the blank best.")
            ),
            details: [
                { label: "Length", value: "upto 150 words" },
                { label: "Skills", value: "Writing & Reading" },
                { label: "Number of questions", value: "5-6" }
            ]
        },
        {
            title: "Multiple Choice, Choose Multiple Answers",
            description: React.createElement(React.Fragment, null,
                React.createElement('p', null, "Quickly scan the response options and pay attention to any words that appear more than once, particularly adjectives or nouns."),
                React.createElement('p', null, "If you notice the same phrases repeated across several choices, chances are the correct answer is linked to those terms.")
            ),
            details: [
                { label: "Length", value: "upto 110 words" },
                { label: "Skills", value: "Reading" },
                { label: "Number of questions", value: "1-2" }
            ]
        },
        {
            title: "Sort Paragraphs",
            description: React.createElement(React.Fragment, null,
                React.createElement('p', null, "Before you begin rearranging the text options, make sure to thoroughly read all of them to understand the central theme of the text. You can also determine the topic by noting down important phrases."),
                React.createElement('p', null, "Additionally, look for sentences that contain transition words like “however,” “but,” “although,” and other phrases such as “moreover,” “furthermore,” and “besides.” Take note of the sentence that precedes these transitional phrases.")
            ),
            details: [
                { label: "Length", value: "upto 150 words" },
                { label: "Skills", value: "Reading" },
                { label: "Number of questions", value: "3-4" }
            ]
        },
        {
            title: "Multiple Choice, Choose Single Answers",
            description: React.createElement(React.Fragment, null,
                React.createElement('p', null, "Begin by reading the question to establish your focal point. Once you’ve assessed the question and the options provided, begin reading the content. Pick the choice that you feel the most appropriate."),
                React.createElement('p', null, "Pay attention to frequency words like “always,” “sometimes,” “never,” “many,” “all,” “often,” “only,” and utilize them to eliminate options until you find the correct answer.")
            ),
            details: [
                { label: "Length", value: "upto 110 words" },
                { label: "Skills", value: "Reading" },
                { label: "Number of questions", value: "1-2" }
            ]
        },
        {
            title: "Fill the gap",
            description: React.createElement(React.Fragment, null,
                React.createElement('p', null, "Take the time to grasp the entire sentence with the blank. Decide whether the blank requires a noun, verb, or adjective. Be cautious in selecting your words. Examining the text both before and after the blank will help in determining the correct response.")
            ),
            details: [
                { label: "Length", value: "upto 80 words" },
                { label: "Skills", value: "Reading" },
                { label: "Number of questions", value: "4-5 questions" }
            ]
        }
    ];
    
    const skills = [
        { title: 'Vocabulary skills', description: 'Comprehending vocabulary in context and identifying the correct word formats is easier with consistent pte reading practice.' },
        { title: 'Paraphrasing skills', description: 'Recognize and understand sentences that have synonymous meanings through exercises in a pte reading practice test or reading pte practice materials.' },
        { title: 'Distinguish skills', description: 'Ability to identify key concepts amidst detailed information, which improves significantly with structured pte reading practice sessions.' },
        { title: 'Identify topic sentence', description: 'Identifying the main idea sentences within the text and crafting responses.' },
        { title: 'Recognizing supporting ideas', description: 'Recognize the validating evidence that supports the perspective or argument.' },
        { title: 'Identify topic sentences', description: 'Pinpoint synthesizers that consolidate topic sentences.' }
    ];

    return React.createElement('div', { className: 'max-w-6xl mx-auto' },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-6 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('div', { className: 'text-center mb-12' },
            React.createElement('h1', { className: 'text-3xl md:text-4xl font-bold text-gray-900' }, "PTE Reading Test Patterns & Questions Included In"),
            React.createElement('h2', { className: 'mt-2 text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600' }, "PTE Reading Mock Test:"),
            React.createElement('p', { className: 'mt-4 max-w-4xl mx-auto text-gray-600' }, "Sometimes candidates outperform others in reading texts because they make word estimates based on content. Some people find it more difficult to read in context because they find it difficult to concentrate on lengthy passages or to understand language that gets longer and more complex. Therefore, the following are a few alternatives for answering each question. That’s why consistent pte reading practice using a structured pte reading practice test or reading pte practice Mock Test is essential. These mock tests include various question types designed to improve comprehension, focus, and contextual understanding."),
            React.createElement('button', {
                onClick: () => navigateTo('reading-mock-test-player'),
                className: 'mt-8 px-10 py-4 text-lg font-semibold text-white bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105'
            }, "Start Reading Mock Test")
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16' },
            readingSections.map(section => (
                React.createElement(InfoCard, {
                    key: section.title,
                    title: section.title,
                    details: section.details
                }, section.description)
            ))
        ),
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' },
            React.createElement('div', { className: 'bg-white p-8 rounded-2xl shadow-lg border border-gray-100' },
                React.createElement('h2', { className: 'text-2xl font-bold text-gray-900 mb-2' }, 'PTE Reading Skills:'),
                React.createElement('span', { className: 'text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500' }, 'Essential Skills You Need to Prepare & Score 90 in PTE Exams'),
                React.createElement('div', { className: 'mt-8 space-y-6' },
                    skills.map(skill => (
                        React.createElement('div', { key: skill.title + skill.description, className: 'flex items-start' },
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
                    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop',
                    alt: 'Person studying on a laptop in a modern setting',
                    className: 'relative w-full h-full object-cover' 
                })
            )
        )
    );
};

export default ReadingMockTest;
