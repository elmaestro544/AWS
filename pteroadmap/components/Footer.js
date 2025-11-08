import React from 'react';
import { EmailIcon, TelegramIcon } from './icons.js';

const Footer = () => {
    return React.createElement(
        'footer',
        { className: 'bg-gray-900 border-t border-gray-700' },
        React.createElement('div', { className: 'max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8' },
            React.createElement('div', { className: 'flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0' },
                // Copyright
                React.createElement('div', { className: 'text-sm text-gray-400 order-3 md:order-1 mt-4 md:mt-0' },
                    '© 2024 PTE Roadmap. All rights reserved.'
                ),
                // Legal Links
                React.createElement('div', { className: 'flex space-x-6 order-2' },
                     React.createElement('a', { href: '#', onClick: (e) => e.preventDefault(), className: 'text-sm text-gray-400 hover:text-white transition-colors' }, 'Privacy Policy'),
                     React.createElement('a', { href: '#', onClick: (e) => e.preventDefault(), className: 'text-sm text-gray-400 hover:text-white transition-colors' }, 'Terms of Use')
                ),
                // Contact Us
                React.createElement('div', { className: 'flex items-center space-x-4 order-1 md:order-3' },
                    React.createElement('span', { className: 'text-sm font-medium text-gray-300' }, 'Contact Us:'),
                    React.createElement('a', { href: 'mailto:roadmap.casa@gmail.com', 'aria-label': 'Email support', className: 'text-gray-400 hover:text-white transition-colors' },
                        React.createElement(EmailIcon, { className: 'h-6 w-6' })
                    ),
                    React.createElement('a', { href: '#', onClick: (e) => e.preventDefault(), 'aria-label': 'Telegram support', className: 'text-gray-400 hover:text-white transition-colors' },
                        React.createElement(TelegramIcon, { className: 'h-6 w-6' })
                    )
                )
            )
        )
    );
};

export default Footer;