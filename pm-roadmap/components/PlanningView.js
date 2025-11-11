

import React, { useState, useEffect } from 'react';
import { i18n } from '../constants.js';
import { generateProjectPlan } from '../services/planningService.js';
import { Spinner, UserIcon, HistoryIcon, PlusIcon, AttachIcon } from './Shared.js';

const GradientButton = ({ onClick, children, disabled = false }) => React.createElement('button', {
    onClick,
    disabled,
    className: "px-6 py-3 font-semibold text-white bg-button-gradient rounded-lg shadow-lg shadow-glow-purple transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
}, children);

const SecondaryButton = ({ onClick, children }) => React.createElement('button', {
    onClick,
    className: "px-6 py-3 font-semibold text-brand-text-light bg-dark-card-solid hover:bg-white/10 border border-dark-border rounded-lg transition-colors"
}, children);

const PlanIcon = ({ className = 'h-16 w-16 text-slate-500' }) => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className, viewBox: "0 0 64 64" },
    React.createElement('path', { d: "M48 14L49.5 10.5L53 9L49.5 7.5L48 4L46.5 7.5L43 9L46.5 10.5L48 14Z", fill: '#5EEAD4' }),
    React.createElement('path', { d: "M16 44L17.5 40.5L21 39L17.5 37.5L16 34L14.5 37.5L11 39L14.5 40.5L16 44Z", fill: '#2DD4BF', opacity: '0.6' }),
    React.createElement('path', { d: "M14 12C14 10.8954 14.8954 10 16 10H38.5858C39.109 10 39.6109 10.2107 40 10.5858L51.4142 22C51.7893 22.3891 52 22.891 52 23.4142V50C52 51.1046 51.1046 52 50 52H16C14.8954 52 14 51.1046 14 50V12Z", fill: '#1E1B2E', stroke: '#0D9488', strokeWidth: '2' }),
    React.createElement('path', { d: "M38 10V23C38 23.5523 38.4477 24 39 24H52", stroke: '#0D9488', strokeWidth: '2' }),
    React.createElement('rect', { x: '20', y: '30', width: '20', height: '3', rx: '1.5', fill: '#115E59' }),
    React.createElement('rect', { x: '20', y: '38', width: '26', height: '3', rx: '1.5', fill: '#115E59' })
);

const IntroView = ({ onGenerateClick }) => (
    React.createElement('div', { className: 'text-center flex flex-col items-center animate-fade-in-up' },
        React.createElement(PlanIcon, null),
        React.createElement('h2', { className: 'text-3xl font-bold mb-2 text-white' }, "Ready to start with an AI-generated plan?"),
        React.createElement('p', { className: 'max-w-md text-brand-text-light mb-6' }, "Save time, reduce setup work, and start managing right away by letting AI instantly build a project plan with tasks and milestones tailored to your goal."),
        React.createElement('div', { className: 'flex gap-4' },
            React.createElement(SecondaryButton, { onClick: () => {} }, "Skip for now"),
            React.createElement(GradientButton, { onClick: onGenerateClick }, "Generate Plan")
        )
    )
);

const InputView = ({ objective, setObjective, onBack, onGenerate, error }) => (
    React.createElement('div', { className: 'w-full max-w-lg text-center animate-fade-in-up' },
        React.createElement(PlanIcon, { className: 'mx-auto' }),
        React.createElement('h2', { className: 'text-3xl font-bold mb-2 text-white' }, "Generate a Project Plan"),
        React.createElement('p', { className: 'text-brand-text-light mb-6' }, "Clearly describe your project goals in detail. The AI will use this to generate a comprehensive Work Breakdown Structure."),
        error && React.createElement('div', { className: "bg-red-500/10 border border-red-500/30 text-center p-2 rounded-md mb-4 text-sm text-red-400 font-semibold" }, error),
        React.createElement('textarea', {
            value: objective,
            onChange: (e) => setObjective(e.target.value),
            placeholder: 'e.g., Launch a campaign to boost brand awareness by 25%',
            rows: 3,
            className: 'w-full p-4 bg-dark-card-solid border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-purple focus:outline-none resize-none text-white'
        }),
        React.createElement('div', { className: 'flex gap-4 mt-6' },
            React.createElement(SecondaryButton, { onClick: onBack }, "Back"),
            React.createElement(GradientButton, { onClick: onGenerate, disabled: !objective.trim() }, "Generate Plan")
        )
    )
);

const LoadingView = ({ progress }) => (
    React.createElement('div', { className: 'text-center flex flex-col items-center' },
        React.createElement(PlanIcon, null),
        React.createElement('h2', { className: 'text-3xl font-bold mb-2 text-white' }, "Generating your project plan"),
        React.createElement('p', { className: 'text-brand-text-light mb-8' }, "AI is creating a comprehensive WBS with tasks, dependencies, and milestones."),
        React.createElement('div', { className: 'w-full max-w-md bg-dark-card-solid rounded-full h-2.5' },
            React.createElement('div', { className: 'bg-brand-purple h-2.5 rounded-full transition-all duration-500', style: { width: `${progress}%` } })
        ),
        React.createElement('p', { className: 'text-brand-purple-light font-semibold mt-2' }, `${progress}%`)
    )
);

const ResultsView = ({ plan, onDiscard }) => {
    const renderCardFooter = (item) => React.createElement('div', { className: 'flex items-center justify-between text-brand-text-light mt-4 pt-4 border-t border-dark-border' },
        React.createElement('div', { className: 'flex items-center gap-4 text-sm' },
            React.createElement('div', { className: 'flex items-center gap-1.5', title: 'Assignees' },
                React.createElement(UserIcon, { className: 'h-4 w-4' }),
                React.createElement('span', null, item.assigneeCount || 1)
            ),
            React.createElement('div', { className: 'flex items-center gap-1.5', title: 'Duration' },
                React.createElement(HistoryIcon, { className: 'h-4 w-4' }),
                React.createElement('span', null, `${item.durationInDays || 1} day${item.durationInDays !== 1 ? 's' : ''}`)
            )
        )
    );

    return React.createElement('div', { className: 'w-full h-full flex flex-col p-6 animate-fade-in-up' },
        React.createElement('div', { className: 'flex-shrink-0 flex justify-between items-center mb-6' },
            React.createElement('h2', { className: 'text-2xl font-bold text-white' }, "Generated Project Plan"),
            React.createElement('div', { className: 'flex gap-4' },
                React.createElement(SecondaryButton, { onClick: onDiscard }, "Discard"),
                React.createElement(GradientButton, { onClick: () => alert('Applying plan...') }, "Apply Plan")
            )
        ),
        React.createElement('div', { className: 'flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto' },
            // Work Breakdown Structure Column
            React.createElement('div', null,
                React.createElement('h3', { className: 'text-xl font-semibold mb-4 flex items-center justify-between text-white' },
                    "Work Breakdown Structure",
                    React.createElement('button', { className: 'p-2 rounded-full bg-dark-card-solid hover:bg-white/10' }, React.createElement(PlusIcon, { className: 'h-4 w-4' }))
                ),
                React.createElement('div', { className: 'space-y-4' }, plan.workBreakdownStructure?.map((task, index) =>
                    React.createElement('div', { key: index, className: 'bg-dark-card-solid border border-dark-border rounded-lg p-4' },
                        React.createElement('h4', { className: 'font-bold text-white' }, task.name),
                        React.createElement('p', { className: 'text-sm text-brand-text-light mt-1' }, task.description),
                        task.subtasks && task.subtasks.length > 0 && (
                             React.createElement('div', { className: 'mt-3 space-y-2 text-sm' }, task.subtasks.map((sub, sIndex) =>
                                React.createElement('div', { key: sIndex, className: 'pl-4 border-l-2 border-dark-border' }, sub.name)
                             ))
                        ),
                        renderCardFooter(task),
                         React.createElement('div', { className: 'flex items-center gap-4 text-xs text-brand-text-light mt-2' },
                            React.createElement('button', { className: 'hover:text-white flex items-center gap-1' }, React.createElement(PlusIcon, { className: 'h-3 w-3' }), 'Add subtask'),
                            React.createElement('button', { className: 'hover:text-white flex items-center gap-1' }, React.createElement(AttachIcon, { className: 'h-3 w-3' }), 'Add dependency')
                        )
                    ))
                )
            ),
            // Key Milestones Column
            React.createElement('div', null,
                React.createElement('h3', { className: 'text-xl font-semibold mb-4 flex items-center justify-between text-white' },
                    "Key Milestones",
                    React.createElement('button', { className: 'p-2 rounded-full bg-dark-card-solid hover:bg-white/10' }, React.createElement(PlusIcon, { className: 'h-4 w-4' }))
                ),
                React.createElement('div', { className: 'space-y-4' }, plan.keyMilestones?.map((milestone, index) =>
                    React.createElement('div', { key: index, className: 'bg-dark-card-solid border border-dark-border rounded-lg p-4' },
                        React.createElement('h4', { className: 'font-bold text-white' }, milestone.name),
                        React.createElement('p', { className: 'text-sm text-brand-text-light mt-1' }, milestone.acceptanceCriteria),
                        renderCardFooter(milestone)
                    ))
                )
            )
        )
    );
};


const PlanningView = ({ language }) => {
    const [viewState, setViewState] = useState('intro'); // intro, input, loading, results
    const [objective, setObjective] = useState('');
    const [plan, setPlan] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleGeneratePlan = async () => {
        if (!objective.trim()) return;
        setViewState('loading');
        setError(null);
        setProgress(0);

        try {
            const generatedPlan = await generateProjectPlan(objective);
            setPlan(generatedPlan);
            setViewState('results');
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
            setViewState('input');
        }
    };
    
    useEffect(() => {
        let timer;
        if (viewState === 'loading') {
            setProgress(10); // Start with a small amount
            timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(timer);
                        return prev;
                    }
                    const increment = Math.random() * 10;
                    return Math.min(prev + increment, 95);
                });
            }, 500);
        }
        return () => clearInterval(timer);
    }, [viewState]);

    const resetState = () => {
        setViewState('intro');
        setObjective('');
        setPlan(null);
        setError(null);
    };

    const renderContent = () => {
        switch (viewState) {
            case 'input':
                return React.createElement(InputView, {
                    objective, setObjective,
                    onBack: () => setViewState('intro'),
                    onGenerate: handleGeneratePlan,
                    error
                });
            case 'loading':
                return React.createElement(LoadingView, { progress: Math.round(progress) });
            case 'results':
                return React.createElement(ResultsView, { plan, onDiscard: resetState });
            case 'intro':
            default:
                return React.createElement(IntroView, { onGenerateClick: () => setViewState('input') });
        }
    };
    
    return React.createElement('div', { className: "h-full flex flex-col items-center justify-center text-white" },
       renderContent()
    );
};

export default PlanningView;