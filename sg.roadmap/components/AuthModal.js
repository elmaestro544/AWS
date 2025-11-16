import React, { useState, useEffect } from 'react';
import { i18n, AppView } from '../constants.js';
import { CloseIcon, GoogleIcon } from './Shared.js';

// Define ModalContent as a standalone component to prevent re-renders from causing input focus loss.
const ModalContent = ({
  t,
  isLoginView,
  formData,
  error,
  success,
  handleInputChange,
  handleSubmit,
  onClose,
  setIsLoginView,
  onLoginSuccess,
  setView
}) => (
    React.createElement('div', { className: "bg-white dark:bg-card-gradient p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-slate-200 dark:border-white/10" },
      React.createElement('button', { onClick: onClose, className: "absolute top-4 right-4 text-slate-500 dark:text-brand-text-light hover:text-slate-900 dark:hover:text-white transition-colors" },
        React.createElement(CloseIcon, null)
      ),
      React.createElement('h2', { className: "text-2xl font-bold text-center text-slate-900 dark:text-brand-text mb-4" },
        isLoginView ? t.login : t.register
      ),
      
      error && React.createElement('div', {className: "bg-red-500/10 border border-red-500/30 text-center p-2 rounded-md mb-4 text-sm text-brand-red font-semibold"}, error),
      success && React.createElement('div', {className: "bg-green-500/10 border border-green-500/30 text-center p-2 rounded-md mb-4 text-sm text-green-600 dark:text-green-400 font-semibold"}, success),

      React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4" },
        !isLoginView && React.createElement('div', null,
            React.createElement('label', { htmlFor: "fullName", className: "block text-sm font-medium text-slate-600 dark:text-brand-text-light mb-1" }, t.fullName),
            React.createElement('input', {
                type: "text", id: "fullName", name: "fullName", required: true,
                value: formData.fullName, onChange: handleInputChange,
                className: "w-full p-2 bg-white dark:bg-input-gradient border border-slate-300 dark:border-white/20 rounded-full focus:ring-2 focus:ring-brand-blue focus:outline-none"
            })
        ),
        React.createElement('div', null,
          React.createElement('label', { htmlFor: "email", className: "block text-sm font-medium text-slate-600 dark:text-brand-text-light mb-1" }, t.emailAddress),
          React.createElement('input', {
            type: "email", id: "email", name: "email", required: true,
            value: formData.email, onChange: handleInputChange,
            className: "w-full p-2 bg-white dark:bg-input-gradient border border-slate-300 dark:border-white/20 rounded-full focus:ring-2 focus:ring-brand-blue focus:outline-none"
          })
        ),
        React.createElement('div', null,
          React.createElement('label', { htmlFor: "password", className: "block text-sm font-medium text-slate-600 dark:text-brand-text-light mb-1" }, t.password),
          React.createElement('input', {
            type: "password", id: "password", name: "password", required: true,
            value: formData.password, onChange: handleInputChange,
            className: "w-full p-2 bg-white dark:bg-input-gradient border border-slate-300 dark:border-white/20 rounded-full focus:ring-2 focus:ring-brand-blue focus:outline-none"
          })
        ),
        !isLoginView && React.createElement('div', null,
            React.createElement('label', { htmlFor: "confirmPassword", className: "block text-sm font-medium text-slate-600 dark:text-brand-text-light mb-1" }, t.confirmPassword),
            React.createElement('input', {
                type: "password", id: "confirmPassword", name: "confirmPassword", required: true,
                value: formData.confirmPassword, onChange: handleInputChange,
                className: "w-full p-2 bg-white dark:bg-input-gradient border border-slate-300 dark:border-white/20 rounded-full focus:ring-2 focus:ring-brand-blue focus:outline-none"
            })
        ),
        !isLoginView && React.createElement('p', { className: "text-xs text-center text-slate-500 dark:text-brand-text-light pt-2" },
            t.authRegistrationDisclaimer_p1, ' ',
            React.createElement('button', {
                type: 'button',
                onClick: () => { onClose(); setView(AppView.Terms); },
                className: 'font-semibold text-brand-blue hover:underline focus:outline-none'
            }, t.authRegistrationDisclaimer_terms), ' ',
            t.authRegistrationDisclaimer_p2, ' ',
            React.createElement('button', {
                type: 'button',
                onClick: () => { onClose(); setView(AppView.Privacy); },
                className: 'font-semibold text-brand-blue hover:underline focus:outline-none'
            }, t.authRegistrationDisclaimer_privacy),
            t.authRegistrationDisclaimer_p3
        ),
        React.createElement('button', {
          type: "submit",
          className: "w-full bg-brand-red hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-full transition-colors mt-2"
        },
          isLoginView ? t.login : t.createAccount
        )
      ),
      React.createElement('div', { className: "relative my-6" },
        React.createElement('div', { className: "absolute inset-0 flex items-center", "aria-hidden": "true" },
          React.createElement('div', { className: "w-full border-t border-slate-300 dark:border-white/20" })
        ),
        React.createElement('div', { className: "relative flex justify-center text-sm" },
          React.createElement('span', { className: "px-2 bg-white dark:bg-card-gradient text-slate-500 dark:text-brand-text-light" }, "OR")
        )
      ),
      React.createElement('button', {
        onClick: () => onLoginSuccess({ email: 'guest@scigenius.com', fullName: 'Guest User' }), // Simulate google login
        className: "w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-4 rounded-full transition-colors border border-gray-300"
      },
        React.createElement(GoogleIcon, null),
        t.signInWithGoogle
      ),
      React.createElement('p', { className: "mt-6 text-center text-sm text-slate-500 dark:text-brand-text-light" },
        isLoginView ? t.dontHaveAccount : t.alreadyHaveAccount,
        ' ',
        React.createElement('button', { onClick: () => setIsLoginView(!isLoginView), className: "font-medium text-brand-blue hover:underline" },
          isLoginView ? t.register : t.login
        )
      )
    )
);


const AuthModal = ({ isOpen, onClose, onLoginSuccess, language, setView }) => {
  const t = i18n[language];
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setError('');
    setSuccess('');
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
  }, [isLoginView, isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const ADMIN_PASSWORD = "5431";

    if (isLoginView && formData.password === ADMIN_PASSWORD) {
        onLoginSuccess({
            email: formData.email,
            fullName: 'Admin',
            isAdmin: true,
        });
        return;
    }

    const getStoredUsers = () => {
        try {
            const users = localStorage.getItem('scigenius_users');
            return users ? JSON.parse(users) : [];
        } catch (err) {
            return [];
        }
    };
    
    const setStoredUsers = (users) => {
        localStorage.setItem('scigenius_users', JSON.stringify(users));
    };

    if (isLoginView) {
        const users = getStoredUsers();
        const foundUser = users.find(user => user.email === formData.email && user.password === formData.password);
        if (foundUser) {
            onLoginSuccess({ email: foundUser.email, fullName: foundUser.fullName });
        } else {
            setError(t.errorInvalidCredentials);
        }
    } else {
        const { fullName, email, password, confirmPassword } = formData;
        if (!fullName.trim()) { setError(t.errorFullNameRequired); return; }
        if (!validateEmail(email)) { setError(t.errorInvalidEmail); return; }
        if (password.length < 8) { setError(t.errorPasswordLength); return; }
        if (password !== confirmPassword) { setError(t.errorPasswordMismatch); return; }

        const users = getStoredUsers();
        if (users.some(user => user.email === email)) {
            setError(t.errorUserExists);
            return;
        }

        const newUser = { fullName, email, password };
        setStoredUsers([...users, newUser]);
        
        setSuccess(t.registrationSuccess);
        setTimeout(() => {
            setIsLoginView(true);
        }, 2000);
    }
  };

  if (!isOpen) return null;
  
  const modalContainerProps = {
    className: "fixed inset-0 bg-slate-900/60 dark:bg-black/80 z-[100] flex justify-center items-center backdrop-blur-sm transition-opacity",
    onClick: onClose,
    role: "dialog",
    "aria-modal": "true"
  };

  return (
    React.createElement('div', modalContainerProps,
      React.createElement('div', { onClick: (e) => e.stopPropagation(), className: "transform transition-all" },
        React.createElement(ModalContent, {
          t,
          isLoginView,
          formData,
          error,
          success,
          handleInputChange,
          handleSubmit,
          onClose,
          setIsLoginView,
          onLoginSuccess,
          setView
        })
      )
    )
  );
};

export default AuthModal;