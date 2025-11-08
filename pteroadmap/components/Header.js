import React from 'react';
import { UserIcon, ChatBubbleLeftRightIcon } from './icons.js';

const Header = ({ navigateTo, isAuthenticated, onLoginClick, onLogout }) => {
    return React.createElement(
        'header',
        { className: 'bg-gray-800 shadow-md h-16 flex items-center justify-between px-4 sm:px-6 z-10' },
        React.createElement(
            'a',
            {
                href: '#',
                onClick: (e) => {
                    e.preventDefault();
                    navigateTo('dashboard');
                },
                className: 'flex items-center',
                title: 'Go to Dashboard'
            },
            React.createElement('div', { className: 'w-8 h-8 bg-gradient-to-br from-blue-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg' }, 'R'),
            React.createElement('span', { className: 'ml-3 text-xl font-bold text-white' }, 'PTE Roadmap')
        ),
        React.createElement(
            'div',
            { className: 'flex items-center space-x-4' },
            React.createElement('button', {
                onClick: () => navigateTo('ai-language-tutor'),
                className: 'p-2 rounded-full hover:bg-gray-700 transition-colors',
                'aria-label': 'AI Conversation Practice'
            }, React.createElement(ChatBubbleLeftRightIcon, { className: 'h-6 w-6 text-gray-300' })),
            isAuthenticated
                ? React.createElement(React.Fragment, null,
                    React.createElement(UserIcon, { className: 'h-6 w-6 text-gray-300' }),
                    React.createElement('button', {
                        onClick: onLogout,
                        className: 'text-sm font-medium text-gray-300 hover:text-white transition-colors',
                        'aria-label': 'Logout'
                    }, 'Logout')
                  )
                : React.createElement('button', {
                    onClick: onLoginClick,
                    className: 'text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                  }, 'Login / Register')
        )
    );
};

export default Header;
