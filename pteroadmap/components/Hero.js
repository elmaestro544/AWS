import React from 'react';
import { CheckCircleIcon, CloseIcon } from './icons.js';

const Hero = ({ onPracticeNow, onClose, onLoginClick }) => {
    return React.createElement('div', {
        className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm',
    }, 
    React.createElement('div', {
        className: 'relative w-full max-w-5xl bg-gradient-to-br from-[#3b82f6] to-[#ec4899] text-white rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in'
    },
        React.createElement('button', {
            onClick: onClose,
            className: 'absolute top-4 right-4 text-white/70 hover:text-white transition-colors',
            'aria-label': 'Close introduction'
        }, React.createElement(CloseIcon, { className: 'w-7 h-7' })),
        React.createElement('div', {
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
    },
        // Left side content
        React.createElement('div', { className: 'flex flex-col items-center lg:items-start text-center lg:text-left' },
            React.createElement('div', { className: 'inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6' },
                React.createElement('span', { className: 'mr-2' }, '✨'),
                'New AI-Powered Scoring'
            ),
            React.createElement('h1', { className: 'text-4xl sm:text-5xl font-bold leading-tight' },
                'Practice PTE with AI Scorings for ',
                React.createElement('span', { className: 'text-yellow-300' }, 'FREE')
            ),
            React.createElement('p', { className: 'mt-6 text-lg text-white/80 max-w-xl' },
                'Join 100,000+ PTE test takers to practice with our advanced AI scoring system'
            ),
            React.createElement('div', { className: 'mt-10 flex flex-col sm:flex-row items-center gap-4' },
                React.createElement('button', {
                    onClick: onPracticeNow,
                    className: 'w-full sm:w-auto bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105'
                }, 'Practice Now'),
                 React.createElement('button', {
                    onClick: onLoginClick,
                    className: 'w-full sm:w-auto border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors'
                }, 'Login / Register')
            )
        ),
        // Right side content
        React.createElement('div', { className: 'bg-white/10 backdrop-blur-lg rounded-2xl p-8' },
            React.createElement('ul', { className: 'space-y-4' },
                React.createElement('li', { className: 'flex items-center text-lg' },
                    React.createElement(CheckCircleIcon, { className: 'w-7 h-7 text-green-300 mr-3' }),
                    'AI-powered pronunciation analysis'
                ),
                React.createElement('li', { className: 'flex items-center text-lg' },
                    React.createElement(CheckCircleIcon, { className: 'w-7 h-7 text-green-300 mr-3' }),
                    'Real-time grammar checking'
                ),
                React.createElement('li', { className: 'flex items-center text-lg' },
                    React.createElement(CheckCircleIcon, { className: 'w-7 h-7 text-green-300 mr-3' }),
                    'Instant score reports'
                ),
                React.createElement('li', { className: 'flex items-center text-lg' },
                    React.createElement(CheckCircleIcon, { className: 'w-7 h-7 text-green-300 mr-3' }),
                    'Sync across all devices'
                )
            )
        )
    )));
};

export default Hero;