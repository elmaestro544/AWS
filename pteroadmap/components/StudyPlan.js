import React, { useState } from 'react';
import { BackIcon, ChevronRightIcon } from './icons.js';
import Modal from './Modal.js';
import { studyPlanData } from './studyPlanData.js'; // Keeping data in a separate file for clarity

const StudyPlan = ({ navigateTo }) => {
    const [activeWeek, setActiveWeek] = useState('Week 1');
    const [openDay, setOpenDay] = useState('Day 1');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: null });

    const handleViewMaterials = (materials) => {
        setModalContent(materials);
        setIsModalOpen(true);
    };

    const handleToolClick = (toolName) => {
        alert(`This would open the "${toolName}" tool. This feature is for demonstration purposes.`);
    };

    const ActivityItem = ({ activity }) => {
        const { description, tool, navigateToView, materials } = activity;
        return React.createElement('div', { className: 'py-2' },
            React.createElement('p', { className: 'text-gray-700' }, description),
            React.createElement('div', { className: 'flex flex-wrap gap-2 mt-2' },
                tool && React.createElement('button', {
                    onClick: () => handleToolClick(tool),
                    className: 'text-sm bg-purple-100 text-purple-700 font-medium py-1 px-3 rounded-full hover:bg-purple-200 transition-colors'
                }, tool),
                navigateToView && React.createElement('button', {
                    onClick: () => navigateTo(navigateToView),
                    className: 'text-sm bg-blue-100 text-blue-700 font-medium py-1 px-3 rounded-full hover:bg-blue-200 transition-colors'
                }, 'Go to Practice'),
                materials && React.createElement('button', {
                    onClick: () => handleViewMaterials(materials),
                    className: 'text-sm bg-green-100 text-green-700 font-medium py-1 px-3 rounded-full hover:bg-green-200 transition-colors'
                }, 'View Materials')
            )
        );
    };

    return React.createElement('div', { className: 'max-w-5xl mx-auto' },
        React.createElement(Modal, {
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            title: modalContent.title
        }, modalContent.content),
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('div', { className: 'bg-gradient-to-br from-[#3b82f6] to-[#ec4899] text-white p-6 rounded-xl shadow-lg mb-8' },
            React.createElement('h1', { className: 'text-3xl font-bold' }, 'Your 30-Day PTE Mastery Accelerator'),
            React.createElement('p', { className: 'mt-2 text-lg opacity-90' }, 'Follow this plan daily to build skills, strategy, and confidence.')
        ),

        React.createElement('div', { className: 'flex border-b border-gray-200 mb-6' },
            Object.keys(studyPlanData).map(week => React.createElement('button', {
                key: week,
                onClick: () => setActiveWeek(week),
                className: `py-3 px-6 text-lg font-semibold transition-colors ${activeWeek === week ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`
            }, week.replace(/([A-Z])/g, ' $1').trim()))
        ),

        React.createElement('div', { className: 'space-y-4' },
            studyPlanData[activeWeek].map(dayData => (
                React.createElement('div', { key: dayData.day, className: 'bg-white rounded-lg shadow-md overflow-hidden' },
                    React.createElement('button', {
                        onClick: () => setOpenDay(openDay === dayData.day ? null : dayData.day),
                        className: 'w-full flex justify-between items-center text-left p-4 bg-gray-50 hover:bg-gray-100'
                    },
                        React.createElement('div', null,
                            React.createElement('h2', { className: 'text-xl font-bold text-gray-800' }, `Day ${dayData.day}: ${dayData.theme}`),
                            React.createElement('p', { className: 'text-sm text-gray-600 mt-1' }, `Goal: ${dayData.goal}`)
                        ),
                        React.createElement(ChevronRightIcon, { className: `w-6 h-6 transform transition-transform duration-300 ${openDay === dayData.day ? 'rotate-90' : ''}` })
                    ),
                    openDay === dayData.day && React.createElement('div', { className: 'p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6' },
                        dayData.sessions.map(session => (
                            React.createElement('div', { key: session.title, className: 'bg-gray-50 p-4 rounded-lg' },
                                React.createElement('h3', { className: 'font-semibold text-gray-800 border-b pb-2 mb-2' }, `${session.title} (${session.time})`),
                                React.createElement('div', { className: 'space-y-3' },
                                    session.activities.map((activity, index) => React.createElement(ActivityItem, { key: index, activity: activity }))
                                )
                            )
                        ))
                    )
                )
            ))
        )
    );
};

export default StudyPlan;