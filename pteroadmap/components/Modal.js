import React from 'react';
import { CloseIcon } from './icons.js';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) {
        return null;
    }

    return React.createElement(
        'div',
        {
            className: 'fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4',
            onClick: onClose,
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'modal-title'
        },
        React.createElement(
            'div',
            {
                className: 'bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col',
                onClick: (e) => e.stopPropagation() // Prevent closing when clicking inside
            },
            React.createElement(
                'div',
                { className: 'flex justify-between items-center p-4 border-b' },
                React.createElement(
                    'h2',
                    { id: 'modal-title', className: 'text-xl font-semibold text-gray-800' },
                    title
                ),
                React.createElement(
                    'button',
                    { onClick: onClose, className: 'text-gray-500 hover:text-gray-800', 'aria-label': 'Close modal' },
                    React.createElement(CloseIcon, { className: 'w-6 h-6' })
                )
            ),
            React.createElement(
                'div',
                { className: 'p-6 overflow-y-auto' },
                children
            )
        )
    );
};

export default Modal;
