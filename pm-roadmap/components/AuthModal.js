
import React, { useState, useEffect } from 'react';
import { i18n, AppView } from '../constants.js';
import { CloseIcon, GoogleIcon, Spinner } from './Shared.js';
import { signIn, signUp } from '../services/supabaseClient.js';

const ModalContent = ({
  t,
  isLoginView,
  formData,
  error,
  success,
  loading,
  handleInputChange,
  handleSubmit,
  onClose,
  setIsLoginView,
  setView
}) => (
    React.createElement('div', { className: "bg-dark-card backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md relative glow-border" },
      React.createElement('button', { onClick: onClose, className: "absolute top-4 right-4 text-brand-text-light hover:text-white transition-colors" },
        React.createElement(CloseIcon, null)
      ),
      React.createElement('h2', { className: "text-2xl font-bold text-center text-brand-text mb-4" },
        isLoginView ? t.login : t.register
      ),
      
      error && React.createElement('div', {className: "bg-red-500/10 border border-red-500/30 text-center p-2 rounded-md mb-4 text-sm text-red-400 font-semibold"}, error),
      success && React.createElement('div', {className: "bg-green-500/10 border border-green-500/30 text-center p-2 rounded-md mb-4 text-sm text-green-400 font-semibold"}, success),

      React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4" },
        !isLoginView && React.createElement('div', null,
            React.createElement('label', { htmlFor: "fullName", className: "block text-sm font-medium text-brand-text-light mb-1" }, t.fullName),
            React.createElement('input', {
                type: "text", id: "fullName", name: "fullName", required: true,
                value: formData.fullName, onChange: handleInputChange,
                className: "w-full p-2 bg-dark-card-solid border border-dark-border rounded-full focus:ring-2 focus:ring-brand-purple focus:outline-none text-white"
            })
        ),
        React.createElement('div', null,
          React.createElement('label', { htmlFor: "email", className: "block text-sm font-medium text-brand-text-light mb-1" }, t.emailAddress),
          React.createElement('input', {
            type: "email", id: "email", name: "email", required: true,
            value: formData.email, onChange: handleInputChange,
            className: "w-full p-2 bg-dark-card-solid border border-dark-border rounded-full focus:ring-2 focus:ring-brand-purple focus:outline-none text-white"
          })
        ),
        React.createElement('div', null,
          React.createElement('label', { htmlFor: "password", className: "block text-sm font-medium text-brand-text-light mb-1" }, t.password),
          React.createElement('input', {
            type: "password", id: "password", name: "password", required: true,
            value: formData.password, onChange: handleInputChange,
            className: "w-full p-2 bg-dark-card-solid border border-dark-border rounded-full focus:ring-2 focus:ring-brand-purple focus:outline-none text-white"
          })
        ),
        !isLoginView && React.createElement('div', null,
            React.createElement('label', { htmlFor: "confirmPassword", className: "block text-sm font-medium text-brand-text-light mb-1" }, t.confirmPassword),
            React.createElement('input', {
                type: "password", id: "confirmPassword", name: "confirmPassword", required: true,
                value: formData.confirmPassword, onChange: handleInputChange,
                className: "w-full p-2 bg-dark-card-solid border border-dark-border rounded-full focus:ring-2 focus:ring-brand-purple focus:outline-none text-white"
            })
        ),
        !isLoginView && React.createElement('p', { className: "text-xs text-center text-brand-text-light pt-2" },
            t.authRegistrationDisclaimer_p1, ' ',
            React.createElement('button', {
                type: 'button',
                onClick: () => { onClose(); setView(AppView.Terms); },
                className: 'font-semibold text-brand-purple-light hover:underline focus:outline-none'
            }, t.authRegistrationDisclaimer_terms), ' ',
            t.authRegistrationDisclaimer_p2, ' ',
            React.createElement('button', {
                type: 'button',
                onClick: () => { onClose(); setView(AppView.Privacy); },
                className: 'font-semibold text-brand-purple-light hover:underline focus:outline-none'
            }, t.authRegistrationDisclaimer_privacy),
            t.authRegistrationDisclaimer_p3
        ),
        React.createElement('button', {
          type: "submit",
          disabled: loading,
          className: "w-full bg-button-gradient text-white font-bold py-2.5 px-4 rounded-full transition-opacity hover:opacity-90 mt-2 shadow-md shadow-brand-purple/20 flex justify-center items-center"
        },
          loading ? React.createElement(Spinner, { size: '5' }) : (isLoginView ? t.login : t.createAccount)
        )
      ),
      React.createElement('div', { className: "relative my-6" },
        React.createElement('div', { className: "absolute inset-0 flex items-center", "aria-hidden": "true" },
          React.createElement('div', { className: "w-full border-t border-dark-border" })
        ),
        React.createElement('div', { className: "relative flex justify-center text-sm" },
          React.createElement('span', { className: "px-2 bg-dark-card text-brand-text-light" }, "OR")
        )
      ),
      React.createElement('p', { className: "mt-6 text-center text-sm text-brand-text-light" },
        isLoginView ? t.dontHaveAccount : t.alreadyHaveAccount,
        ' ',
        React.createElement('button', { onClick: () => setIsLoginView(!isLoginView), className: "font-medium text-brand-purple-light hover:underline" },
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
    setSuccess('');
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
  }, [isLoginView, isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
        if (isLoginView) {
            // LOGIN
            const { data, error } = await signIn(formData.email, formData.password);
            if (error) throw error;
            if (data?.user) {
                // onLoginSuccess handled by App.js auth listener mostly, but we can trigger close
                onClose();
            }
        } else {
            // REGISTER
            if (formData.password !== formData.confirmPassword) {
                throw new Error(t.errorPasswordMismatch);
            }
            if (formData.password.length < 6) {
                 throw new Error(t.errorPasswordLength);
            }
            const { data, error } = await signUp(formData.email, formData.password, formData.fullName);
            if (error) throw error;
            setSuccess("Registration successful! Please check your email to verify your account, or log in.");
            setTimeout(() => setIsLoginView(true), 2000);
        }
    } catch (err) {
        setError(err.message || t.errorOccurred);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    React.createElement('div', {
        className: "fixed inset-0 bg-black/80 z-[100] flex justify-center items-center backdrop-blur-sm transition-opacity",
        onClick: onClose,
    },
      React.createElement('div', { onClick: (e) => e.stopPropagation(), className: "transform transition-all" },
        React.createElement(ModalContent, {
          t,
          isLoginView,
          formData,
          error,
          success,
          loading,
          handleInputChange,
          handleSubmit,
          onClose,
          setIsLoginView,
          setView
        })
      )
    )
  );
};

export default AuthModal;
