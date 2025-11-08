import React, { useState } from 'react';
import { MailIcon, LockClosedIcon, UserIcon } from './icons.js';

const AuthPage = ({ onLoginSuccess, isModal = false }) => {
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would perform validation and API calls here.
        // For this demo, we'll just simulate a successful login/registration.
        const email = e.target.email.value;
        const name = e.target.name ? e.target.name.value : 'Peter';
        onLoginSuccess({ email, name });
    };

    const InputField = ({ icon, type, placeholder, id }) => (
        React.createElement('div', { className: 'relative' },
            React.createElement('div', { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
                icon
            ),
            React.createElement('input', {
                type,
                id,
                name: id,
                className: 'w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                placeholder,
                required: true
            })
        )
    );
    
    const formUI = React.createElement(React.Fragment, null,
        React.createElement('h2', { className: 'text-2xl font-bold text-center text-gray-800 mb-2' },
            isRegister ? 'Create Your Account' : 'Welcome Back!'
        ),
        React.createElement('p', { className: 'text-center text-gray-500 mb-8' },
            isRegister ? 'Get started with your personalized PTE journey.' : 'Sign in to track your progress.'
        ),
        React.createElement('form', { onSubmit: handleSubmit, className: 'space-y-6' },
            isRegister && React.createElement(InputField, {
                icon: React.createElement(UserIcon, { className: 'h-5 w-5 text-gray-400' }),
                type: 'text',
                placeholder: 'Peter',
                id: 'name'
            }),
            React.createElement(InputField, {
                icon: React.createElement(MailIcon, { className: 'h-5 w-5 text-gray-400' }),
                type: 'email',
                placeholder: 'peter@example.com',
                id: 'email'
            }),
            React.createElement(InputField, {
                icon: React.createElement(LockClosedIcon, { className: 'h-5 w-5 text-gray-400' }),
                type: 'password',
                placeholder: 'Password',
                id: 'password'
            }),
            isRegister && React.createElement(InputField, {
                icon: React.createElement(LockClosedIcon, { className: 'h-5 w-5 text-gray-400' }),
                type: 'password',
                placeholder: 'Confirm Password',
                id: 'confirm-password'
            }),
            React.createElement('button', {
                type: 'submit',
                className: 'w-full py-3 px-4 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
            }, isRegister ? 'Sign Up' : 'Login'),
            React.createElement('div', { className: 'text-center' },
                React.createElement('button', {
                    type: 'button',
                    onClick: () => setIsRegister(!isRegister),
                    className: 'text-sm font-medium text-blue-600 hover:underline focus:outline-none'
                },
                    isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"
                )
            )
        )
    );

    if (isModal) {
        return formUI;
    }

    return React.createElement('div', { className: 'min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4' },
        React.createElement('div', { className: 'flex items-center mb-8' },
             React.createElement('div', { className: 'w-10 h-10 bg-gradient-to-br from-blue-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl' }, 'R'),
             React.createElement('h1', { className: 'ml-4 text-3xl font-bold text-gray-800' }, 'PTE Roadmap')
        ),
        React.createElement('div', { className: 'w-full max-w-md bg-white rounded-xl p-8' },
            formUI
        )
    );
};

export default AuthPage;
