import React from 'react';
import { BackIcon, UserIcon } from './icons.js';

const ScoreBar = ({ label, score, color }) => (
    React.createElement('div', { className: 'w-full' },
        React.createElement('div', { className: 'flex justify-between mb-1' },
            React.createElement('span', { className: 'text-sm font-medium text-gray-700' }, label),
            React.createElement('span', { className: 'text-sm font-bold text-gray-700' }, `${score}/90`)
        ),
        React.createElement('div', { className: 'w-full bg-gray-200 rounded-full h-2.5' },
            React.createElement('div', { className: `${color} h-2.5 rounded-full`, style: { width: `${(score / 90) * 100}%` } })
        )
    )
);

const ScoreReportMockup = () => (
    React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200' },
        React.createElement('h3', { className: 'text-2xl font-bold text-gray-800 text-center' }, 'Score Report'),
        React.createElement('div', { className: 'mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start' },
            React.createElement('div', { className: 'col-span-1 flex flex-col items-center' },
                React.createElement('h4', { className: 'font-semibold text-gray-700 mb-2' }, 'Personal Information'),
                React.createElement('div', { className: 'w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2' },
                    React.createElement(UserIcon, { className: 'w-12 h-12 text-gray-400' })
                ),
                React.createElement('p', { className: 'text-sm text-gray-600' }, 'Test Taker: Peter'),
                React.createElement('p', { className: 'text-sm text-gray-600' }, 'Test Date: 01 Jan 2024')
            ),
            React.createElement('div', { className: 'col-span-2 flex flex-col items-center' },
                React.createElement('h4', { className: 'font-semibold text-gray-700' }, 'Overall Score'),
                React.createElement('p', { className: 'text-7xl font-bold text-blue-600 my-2' }, '90'),
                React.createElement('p', { className: 'text-sm text-gray-500' }, 'Score range: 10 - 90')
            )
        ),
        React.createElement('div', { className: 'mt-8 pt-6 border-t' },
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Communicative Skills'),
                    React.createElement('div', { className: 'space-y-4' },
                        React.createElement(ScoreBar, { label: 'Listening', score: 90, color: 'bg-green-500' }),
                        React.createElement(ScoreBar, { label: 'Reading', score: 90, color: 'bg-green-500' }),
                        React.createElement(ScoreBar, { label: 'Speaking', score: 90, color: 'bg-green-500' }),
                        React.createElement(ScoreBar, { label: 'Writing', score: 90, color: 'bg-green-500' })
                    )
                ),
                React.createElement('div', null,
                    React.createElement('h4', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Enabling Skills'),
                    React.createElement('div', { className: 'space-y-4' },
                        React.createElement(ScoreBar, { label: 'Grammar', score: 90, color: 'bg-yellow-500' }),
                        React.createElement(ScoreBar, { label: 'Oral Fluency', score: 90, color: 'bg-yellow-500' }),
                        React.createElement(ScoreBar, { label: 'Pronunciation', score: 90, color: 'bg-yellow-500' }),
                        React.createElement(ScoreBar, { label: 'Spelling', score: 90, color: 'bg-yellow-500' }),
                        React.createElement(ScoreBar, { label: 'Vocabulary', score: 90, color: 'bg-yellow-500' }),
                        React.createElement(ScoreBar, { label: 'Written Discourse', score: 88, color: 'bg-yellow-500' })
                    )
                )
            )
        )
    )
);

const IntegratedScoringTable = () => {
    const data = {
        "Speaking": [
            { task: "Read Aloud", skills: "Speaking, Reading" },
            { task: "Repeat Sentence", skills: "Speaking, Listening" },
            { task: "Describe Image", skills: "Speaking" },
            { task: "Re-tell Lecture", skills: "Speaking, Listening" },
            { task: "Answer Short Question", skills: "Speaking, Listening" },
        ],
        "Writing": [
            { task: "Summarize Written Text", skills: "Writing, Reading" },
            { task: "Write Essay", skills: "Writing" },
        ],
        "Reading": [
            { task: "Fill in the Blanks", skills: "Reading, Writing" },
            { task: "Multiple Choice", skills: "Reading" },
            { task: "Re-order Paragraphs", skills: "Reading" },
        ],
        "Listening": [
            { task: "Summarize Spoken Text", skills: "Listening, Writing" },
            { task: "Fill in the Blanks", skills: "Listening, Writing" },
            { task: "Highlight Incorrect Words", skills: "Listening, Reading" },
            { task: "Write from Dictation", skills: "Listening, Writing" },
        ]
    };

    return React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        Object.entries(data).map(([section, tasks]) => (
            React.createElement('div', { key: section, className: 'bg-white p-6 rounded-lg shadow' },
                React.createElement('h4', { className: 'text-xl font-semibold text-gray-800 mb-3' }, section),
                React.createElement('ul', { className: 'space-y-2' },
                    tasks.map(item => (
                        React.createElement('li', { key: item.task, className: 'flex justify-between items-center text-sm' },
                            React.createElement('span', { className: 'text-gray-700' }, item.task),
                            React.createElement('span', { className: 'font-medium text-blue-600' }, item.skills)
                        )
                    ))
                )
            )
        ))
    );
};

const ScoringContributionMatrix = () => {
    const scoringMatrixData = [
      { serial: 1, type: "RA (Read Aloud)", numQuestions: "6-7", time: "~30s", speaking: "14%", writing: "-", reading: "10%", listening: "-" },
      { serial: 2, type: "RS (Repeat Sentence)", numQuestions: "10-12", time: "~3s", speaking: "-", writing: "-", reading: "-", listening: "19%" },
      { serial: 3, type: "DI (Describe Image)", numQuestions: "3-4", time: "~25s", speaking: "16%", writing: "-", reading: "-", listening: "-" },
      { serial: 4, type: "RL (Retell Lecture)", numQuestions: "1-2", time: "~90s", speaking: "11%", writing: "-", reading: "-", listening: "8%" },
      { serial: 5, type: "ASQ (Answer Short Question)", numQuestions: "5-6", time: "~10s", speaking: "-", writing: "-", reading: "-", listening: "3%" },
      { serial: 6, type: "SWT (Summarize Written Text)", numQuestions: "1-2", time: "10min", speaking: "-", writing: "10%", reading: "4%", listening: "-" },
      { serial: 7, type: "WE (Write Essay)", numQuestions: "1-2", time: "20min", speaking: "-", writing: "14%", reading: "-", listening: "-" },
      { serial: 8, type: "R: MCMA", numQuestions: "1-2", time: "~2min", speaking: "-", writing: "-", reading: "6%", listening: "-" },
      { serial: 9, type: "R: M-CSA", numQuestions: "1-2", time: "~2min", speaking: "-", writing: "-", reading: "3%", listening: "-" },
      { serial: 10, type: "R: Re-order Paragraphs", numQuestions: "2-3", time: "~4min", speaking: "-", writing: "-", reading: "9%", listening: "-" },
      { serial: 11, type: "R: FIB-R", numQuestions: "4-5", time: "~1.5min", speaking: "-", writing: "-", reading: "10%", listening: "-" },
      { serial: 12, type: "R: FIB-R&W", numQuestions: "5-6", time: "~2min", speaking: "-", writing: "15%", reading: "12%", listening: "-" },
      { serial: 13, type: "L: Summarize Spoken Text", numQuestions: "1-2", time: "10min", speaking: "-", writing: "10%", reading: "-", listening: "8%" },
      { serial: 14, type: "L: MCMA", numQuestions: "1-2", time: "~2min", speaking: "-", writing: "-", reading: "-", listening: "6%" },
      { serial: 15, type: "L: M-CSA", numQuestions: "1-2", time: "~2min", speaking: "-", writing: "-", reading: "-", listening: "4%" },
      { serial: 16, type: "L: FIB", numQuestions: "2-3", time: "~1.5min", speaking: "-", writing: "-", reading: "-", listening: "9%" },
      { serial: 17, type: "L: HCS", numQuestions: "1-2", time: "~2min", speaking: "-", writing: "-", reading: "-", listening: "7%" },
      { serial: 18, type: "L: Missing Word", numQuestions: "1-2", time: "~20s", speaking: "-", writing: "-", reading: "-", listening: "5%" },
      { serial: 19, type: "L: Highlight Incorrect Words", numQuestions: "2-3", time: "~2min", speaking: "-", writing: "-", reading: "-", listening: "7%" },
      { serial: 20, type: "L: Write from Dictation", numQuestions: "3-4", time: "~5s", speaking: "-", writing: "15%", reading: "-", listening: "14%" },
    ];
    const headers = ["Serial", "Question Type", "# Qs", "Time/Q", "Speaking", "Writing", "Reading", "Listening"];

    return React.createElement('div', { className: 'overflow-x-auto bg-white rounded-lg shadow' },
        React.createElement('table', { className: 'min-w-full divide-y divide-gray-200' },
            React.createElement('thead', { className: 'bg-gray-50' },
                React.createElement('tr', null,
                    headers.map(header => React.createElement('th', {
                        key: header,
                        scope: 'col',
                        className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    }, header))
                )
            ),
            React.createElement('tbody', { className: 'bg-white divide-y divide-gray-200' },
                scoringMatrixData.map(row => React.createElement('tr', { key: row.serial, className: 'even:bg-gray-50' },
                    React.createElement('td', { className: 'px-4 py-4 whitespace-nowrap text-sm text-gray-700' }, row.serial),
                    React.createElement('td', { className: 'px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900' }, row.type),
                    React.createElement('td', { className: 'px-4 py-4 whitespace-nowrap text-sm text-gray-700' }, row.numQuestions),
                    React.createElement('td', { className: 'px-4 py-4 whitespace-nowrap text-sm text-gray-700' }, row.time),
                    React.createElement('td', { className: 'px-4 py-4 whitespace-nowrap text-sm text-gray-700' }, row.speaking),
                    React.createElement('td', { className: 'px-4 py-4 whitespace-nowrap text-sm text-gray-700' }, row.writing),
                    React.createElement('td', { className: 'px-4 py-4 whitespace-nowrap text-sm text-gray-700' }, row.reading),
                    React.createElement('td', { className: 'px-4 py-4 whitespace-nowrap text-sm text-gray-700' }, row.listening)
                ))
            )
        )
    );
};


const PTEScoreReport = ({ navigateTo }) => {
    return React.createElement('div', { className: "max-w-4xl mx-auto" },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('div', { className: 'space-y-12' },
            React.createElement('header', null,
                React.createElement('h1', { className: "text-4xl font-bold text-gray-900" }, 'PTE Score Information'),
                React.createElement('p', { className: "mt-2 text-lg text-gray-600" }, "Understand the PTE scoring system.")
            ),

            React.createElement('section', { 'aria-labelledby': 'integrated-scoring-title' },
                React.createElement('h2', { id: 'integrated-scoring-title', className: "text-2xl font-bold text-gray-800 mb-4" }, "PTE's Integrated Score System"),
                React.createElement('div', { className: 'prose max-w-none text-gray-700' },
                    React.createElement('p', null, "Some question types in the PTE test more than one skill area at a time (listening, speaking, reading, and writing). For example, Read Aloud, the first question type in the Speaking Section, tests not only speaking but also reading. This scoring system provides a more objective and comprehensive assessment of your English language abilities."),
                    React.createElement('h3', { className: 'mt-6' }, "Scoring Breakdown by Task"),
                    React.createElement('p', null, "Below is a simplified breakdown of which tasks contribute to which skill scores:")
                ),
                React.createElement('div', { className: 'mt-6' },
                    React.createElement(IntegratedScoringTable)
                ),
                React.createElement('h3', { className: 'text-xl font-bold text-gray-800 mt-12 mb-4' }, "Detailed Scoring Contribution"),
                  React.createElement('div', { className: 'prose max-w-none text-gray-700 mb-6' },
                      React.createElement('p', null, "The following table shows the approximate weight of each question type towards your final communicative skill scores.")
                  ),
                React.createElement(ScoringContributionMatrix, null)
            ),

            React.createElement('section', { 'aria-labelledby': 'score-report-title' },
                React.createElement('h2', { id: 'score-report-title', className: "text-2xl font-bold text-gray-800 mb-4" }, 'Anatomy of a PTE Score Report'),
                 React.createElement('div', { className: 'prose max-w-none text-gray-700 mb-6' },
                    React.createElement('p', null, "An official PTE score report consists of three main parts. Here is a sample report to illustrate:")
                ),
                React.createElement(ScoreReportMockup),
                 React.createElement('div', { className: 'mt-6 prose max-w-none text-gray-700 space-y-4' },
                    React.createElement('h3', null, 'a. Personal Information'),
                    React.createElement('p', null, "This section shows your personal information and a photo of you that was taken on-site just before the exam."),
                    React.createElement('h3', null, 'b. Overall Score'),
                    React.createElement('p', null, "The overall score is a summary of your performance, ranging from 10 to 90 points. In this example, the score is 90."),
                    React.createElement('h3', null, 'c. Detailed Scores'),
                    React.createElement('p', null, "Your performance is broken down into two parts: communicative skills and enabling skills."),
                    React.createElement('h4', null, 'Communicative Skills'),
                    React.createElement('p', null, "These four scores (Listening, Reading, Speaking, Writing) are directly related to your language competence and are the primary scores considered for visa or university applications. For example, while applying for Australia's Permanent Residency, a score of 65 in each of the four communicative skills will add 10 points in its points-tested system."),
                    React.createElement('h4', null, 'Enabling Skills'),
                    React.createElement('p', null, "These scores are not directly assessed in visa or university applications, but they provide a detailed analysis of your performance in speaking and writing. The scores for pronunciation and fluency relate to your overall speaking score, while spelling, grammar, vocabulary, and written discourse reflect your performance in writing and listening tasks like Summarize Spoken Text.")

                )
            )
        )
    );
};

export default PTEScoreReport;