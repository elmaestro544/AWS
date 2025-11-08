import React from 'react';
import { BackIcon, ChevronRightIcon, SpeakingColoredIcon, WritingColoredIcon, ReadingColoredIcon, ListeningColoredIcon, ChartBarIcon, BookOpenIcon, UserIcon, InfoIcon } from './icons.js';

const FeatureCard = ({ icon, title, children }) => (
    React.createElement('div', { className: 'bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/30' },
        React.createElement('div', { className: 'flex items-center mb-4' },
            icon,
            React.createElement('h3', { className: 'text-xl font-bold text-gray-900 ml-3' }, title)
        ),
        React.createElement('p', { className: 'text-gray-600' }, children)
    )
);

const SectionCard = ({ icon, title, onClick }) => (
    React.createElement('div', { 
        onClick: onClick, 
        className: "bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
    },
        icon,
        React.createElement('h3', { className: "text-xl font-bold text-gray-900 mt-4" }, title),
        React.createElement('button', {
            className: 'mt-4 text-sm font-semibold text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600'
        }, 'Practice Now')
    )
);


const FullMockTestIntro = ({ navigateTo }) => {
    return React.createElement('div', { className: "max-w-6xl mx-auto" },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-6 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('header', { className: 'text-center mb-12' },
            React.createElement('h1', { className: "text-4xl md:text-5xl font-bold text-gray-900" }, "Comprehensive PTE Practice Tests"),
            React.createElement('p', { className: "mt-4 max-w-3xl mx-auto text-lg text-gray-600" }, "Our tests are structured to mimic the actual PTE Academic exam, ensuring a realistic experience. With AI scoring and detailed analysis, you can track your progress and pinpoint areas for improvement.")
        ),

        React.createElement('section', { className: 'mb-16' },
            React.createElement('div', { className: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl' },
                React.createElement('h2', { className: 'text-3xl font-bold' }, 'PTE Full-Length Mock Test'),
                React.createElement('p', { className: 'mt-2 text-blue-100 max-w-3xl' }, "Get the real exam experience with our full-length PTE mock test, which provides in-depth insights across all four sections—Speaking, Writing, Reading, and Listening."),
                React.createElement('button', {
                    onClick: () => navigateTo('full-mock-test-player'),
                    className: 'mt-6 bg-white text-blue-600 font-bold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105'
                }, 'Start Full 2-Hour Test')
            )
        ),

        React.createElement('section', { className: 'mb-16' },
            React.createElement('h2', { className: "text-3xl font-bold text-gray-800 mb-2 text-center" }, "PTE Practice Tests by Section"),
            React.createElement('p', { className: 'text-center text-gray-600 mb-8 max-w-3xl mx-auto' }, "Refine your skills with section-wise practice tests. These targeted tests allow you to focus on specific modules and strengthen areas where you need improvement."),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' },
                React.createElement(SectionCard, { icon: React.createElement(SpeakingColoredIcon), title: "Speaking Test", onClick: () => navigateTo('speaking-mock-test') }),
                React.createElement(SectionCard, { icon: React.createElement(WritingColoredIcon), title: "Writing Test", onClick: () => navigateTo('writing-mock-test') }),
                React.createElement(SectionCard, { icon: React.createElement(ReadingColoredIcon), title: "Reading Test", onClick: () => navigateTo('reading-mock-test') }),
                React.createElement(SectionCard, { icon: React.createElement(ListeningColoredIcon), title: "Listening Test", onClick: () => navigateTo('listening-mock-test') }),
            )
        ),
        
        React.createElement('section', null,
            React.createElement('h2', { className: "text-3xl font-bold text-gray-800 mb-8 text-center" }, "Features to Boost Your Score"),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                React.createElement(FeatureCard, { icon: React.createElement(BookOpenIcon, { className: 'w-8 h-8 text-green-500' }), title: "Model Answers for PTE Practice" },
                    "Access sample answers to enhance your understanding of ideal responses, helping you refine your own writing and speaking skills."
                ),
                 React.createElement(FeatureCard, { icon: React.createElement(ChartBarIcon, { className: 'w-8 h-8 text-red-500' }), title: "Thorough Analysis of Results" },
                    "Receive an in-depth analysis of your test results, identifying strengths and areas for improvement to tailor your study approach effectively."
                ),
                 React.createElement(FeatureCard, { icon: React.createElement(UserIcon, { className: 'w-8 h-8 text-yellow-500' }), title: "Personalized Recommendations" },
                    "Receive personalized suggestions for improvement based on your performance, guiding you toward achieving your target score in the PTE exam."
                ),
                 React.createElement(FeatureCard, { icon: React.createElement(InfoIcon, { className: 'w-8 h-8 text-purple-500' }), title: "Real-Time Adaptive Feedback" },
                    "For those looking to practice PTE online in real-time, the platform’s adaptive system provides immediate feedback, giving you a clear sense of your strengths and weaknesses."
                )
            )
        )
    );
};

export default FullMockTestIntro;