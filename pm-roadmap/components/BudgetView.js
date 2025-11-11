

// components/BudgetView.js

import React, { useState, useEffect, useMemo } from 'react';
import { generateProjectBudget } from '../services/budgetService.js';
import { BudgetIcon, Spinner } from './Shared.js';

// --- UI Elements ---
const GradientButton = ({ onClick, children, disabled = false, className = '' }) => React.createElement('button', {
    onClick,
    disabled,
    className: `px-6 py-3 font-semibold text-white bg-button-gradient rounded-lg shadow-lg shadow-glow-purple transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 ${className}`
}, children);

const SecondaryButton = ({ onClick, children, className = '' }) => React.createElement('button', {
    onClick,
    className: `px-6 py-3 font-semibold text-slate-300 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors ${className}`
}, children);

const TornixLogo = () => (
    React.createElement('div', { className: 'flex items-center mb-2' },
        React.createElement('span', {
            className: 'font-bold text-xl bg-gradient-to-r from-cyan-400 via-lime-400 to-yellow-400 text-transparent bg-clip-text'
        }, 'PM Roadmap')
    )
);

const LeftPanel = () => (
    React.createElement('div', { className: 'w-1/3 bg-slate-800/50 rounded-2xl p-8 flex flex-col justify-between' },
        React.createElement('div', null,
            React.createElement(TornixLogo, null),
            React.createElement('p', { className: 'text-2xl font-semibold' }, "Let's make a project with AI")
        ),
        React.createElement('div', { className: 'h-64 bg-slate-700/50 rounded-lg border border-slate-600' },
            // Placeholder for illustration
        )
    )
);

// --- View Components ---

const IntroView = ({ onEstimate, onSkip }) => (
    React.createElement('div', { className: 'text-center flex flex-col items-center' },
        React.createElement(BudgetIcon, { className: 'h-16 w-16 text-slate-500' }),
        React.createElement('h2', { className: 'text-2xl font-bold mt-4 mb-2' }, "Estimate Your Project Budget with AI"),
        React.createElement('p', { className: 'max-w-md text-slate-400 mb-6' }, "Let AI analyze your plan and suggest cost and resource estimates based on similar projects. Avoid overruns, plan smarter, and adjust resources before you start."),
        React.createElement('div', { className: 'flex gap-4' },
            React.createElement(SecondaryButton, { onClick: onSkip }, "Skip for now"),
            React.createElement(GradientButton, { onClick: onEstimate }, "Estimate budget")
        )
    )
);

const InputView = ({ details, setDetails, onBack, onGenerate, error }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };
    
    return React.createElement('div', { className: 'w-full max-w-2xl text-center' },
        React.createElement(BudgetIcon, { className: 'h-16 w-16 text-slate-500 mx-auto' }),
        React.createElement('h2', { className: 'text-2xl font-bold mt-4 mb-2' }, "Project Budget Estimation"),
        React.createElement('p', { className: 'text-slate-400 mb-6' }, "Clearly describe your project goals in detail. The AI will use this to generate a comprehensive Work Breakdown Structure."),
        error && React.createElement('div', { className: "bg-red-500/10 border border-red-500/30 text-center p-2 rounded-md mb-4 text-sm text-red-400 font-semibold" }, error),
        React.createElement('div', { className: 'space-y-4 text-left' },
            React.createElement('input', { name: "objectives", value: details.objectives, onChange: handleInputChange, placeholder: "Project objectives", className: 'w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg' }),
            React.createElement('div', { className: 'grid grid-cols-3 gap-4' },
                React.createElement('input', { name: "currency", value: details.currency, onChange: handleInputChange, placeholder: "Currency", className: 'w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg' }),
                React.createElement('input', { name: "budgetCap", value: details.budgetCap, onChange: handleInputChange, placeholder: "Budget cap (optional)", className: 'w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg' }),
                React.createElement('input', { name: "contingency", value: details.contingency, onChange: handleInputChange, placeholder: "Contingency, %", className: 'w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg' })
            ),
            React.createElement('textarea', { name: "scope", value: details.scope, onChange: handleInputChange, placeholder: "Scope summary (summarize what is included/excluded)", rows: 4, className: 'w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg resize-none' })
        ),
        React.createElement('div', { className: 'flex gap-4 mt-6 justify-center' },
            React.createElement(SecondaryButton, { onClick: onBack }, "Back"),
            React.createElement(GradientButton, { onClick: onGenerate, disabled: !details.objectives.trim() || !details.scope.trim() }, "Estimate budget")
        )
    );
};

const LoadingView = ({ progress }) => (
    React.createElement('div', { className: 'text-center flex flex-col items-center w-full max-w-lg' },
        React.createElement(BudgetIcon, { className: 'h-16 w-16 text-slate-500' }),
        React.createElement('h2', { className: 'text-2xl font-bold mt-4 mb-2 text-brand-cyan' }, "Estimating your project's budget"),
        React.createElement('p', { className: 'text-slate-400 mb-8' }, "AI is creating a smart budget breakdown with resources and expenses."),
        React.createElement('div', { className: 'w-full bg-slate-700 rounded-full h-2.5' },
            React.createElement('div', { className: 'bg-brand-purple h-2.5 rounded-full transition-all duration-500', style: { width: `${progress}%` } })
        ),
        React.createElement('p', { className: 'font-semibold mt-2' }, `Analyzing your objectives... ${progress}%`)
    )
);

const ResultsView = ({ data, onDiscard, onSave }) => {
    const [forecastType, setForecastType] = useState('Basic');

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

    const summary = useMemo(() => {
        if (!data?.budgetItems) return { total: 0, labor: 0, material: 0, contingency: 0 };
        const totalLabor = data.budgetItems.reduce((sum, item) => sum + item.laborCost, 0);
        const totalMaterial = data.budgetItems.reduce((sum, item) => sum + item.materialsCost, 0);
        const totalContingency = data.budgetItems.reduce((sum, item) => sum + ((item.laborCost + item.materialsCost) * (item.contingencyPercent / 100)), 0);
        const totalProject = totalLabor + totalMaterial + totalContingency;
        return { total: totalProject, labor: totalLabor, material: totalMaterial, contingency: totalContingency };
    }, [data]);

    const SummaryCard = ({ title, value, icon, colorClass }) => (
        React.createElement('div', { className: 'bg-slate-800/50 p-4 rounded-lg flex items-center gap-4' },
            React.createElement('div', null,
                React.createElement('p', { className: 'text-slate-400 text-sm' }, title),
                React.createElement('p', { className: 'text-white text-2xl font-bold' }, formatCurrency(value))
            )
        )
    );

    return React.createElement('div', { className: 'w-full h-full flex flex-col p-6' },
        React.createElement('div', { className: 'flex-shrink-0 flex justify-between items-center mb-6' },
            React.createElement('h2', { className: 'text-2xl font-bold' }, "AI-Powered Budget Estimation"),
            React.createElement('div', { className: 'flex items-center gap-2 p-1 bg-slate-800/50 rounded-lg' },
                 ['Optimistic', 'Basic', 'Pessimistic'].map(type =>
                    React.createElement('button', {
                        key: type,
                        onClick: () => setForecastType(type),
                        className: `px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${forecastType === type ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`
                    }, type)
                )
            )
        ),
        React.createElement('div', { className: 'grid grid-cols-4 gap-4 mb-6' },
            React.createElement(SummaryCard, { title: 'Total Project Cost', value: summary.total }),
            React.createElement(SummaryCard, { title: 'Total Labor Cost', value: summary.labor }),
            React.createElement(SummaryCard, { title: 'Total Material Cost', value: summary.material }),
            React.createElement(SummaryCard, { title: 'Total Contingency', value: summary.contingency })
        ),
        React.createElement('div', { className: 'flex-grow overflow-y-auto bg-slate-800/50 rounded-lg' },
            React.createElement('table', { className: 'w-full text-sm text-left' },
                React.createElement('thead', null,
                    React.createElement('tr', { className: 'text-slate-400 border-b border-slate-700' },
                        ['Category', 'Description', 'Labor (hrs)', 'Labor Cost', 'Materials', 'Contingency', 'Total'].map(header =>
                            React.createElement('th', { key: header, className: 'p-3' }, header)
                        )
                    )
                ),
                React.createElement('tbody', null,
                    data.budgetItems?.map((item, index) => {
                        const itemContingency = (item.laborCost + item.materialsCost) * (item.contingencyPercent / 100);
                        const itemTotal = item.laborCost + item.materialsCost + itemContingency;
                        return React.createElement('tr', { key: index, className: 'border-b border-slate-700/50' },
                            React.createElement('td', { className: 'p-3 font-semibold' }, item.category),
                            React.createElement('td', { className: 'p-3 text-slate-300' }, item.description),
                            React.createElement('td', { className: 'p-3' }, item.laborHours > 0 ? item.laborHours.toLocaleString() : '–'),
                            React.createElement('td', { className: 'p-3' }, item.laborCost > 0 ? formatCurrency(item.laborCost) : '–'),
                            React.createElement('td', { className: 'p-3' }, item.materialsCost > 0 ? formatCurrency(item.materialsCost) : '–'),
                            React.createElement('td', { className: 'p-3' }, `${item.contingencyPercent}% (${formatCurrency(itemContingency)})`),
                            React.createElement('td', { className: 'p-3 font-semibold' }, formatCurrency(itemTotal))
                        );
                    })
                )
            )
        ),
        React.createElement('div', { className: 'flex-shrink-0 flex justify-end items-center gap-4 mt-6' },
            React.createElement(SecondaryButton, { onClick: onDiscard }, "Discard"),
            React.createElement(GradientButton, { onClick: onSave }, "Save")
        )
    );
};

const BudgetView = () => {
    const [viewState, setViewState] = useState('intro'); // intro, input, loading, results
    const [projectDetails, setProjectDetails] = useState({
        objectives: '', currency: 'USD', budgetCap: '', contingency: '10', scope: ''
    });
    const [budgetData, setBudgetData] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleGenerate = async () => {
        setViewState('loading');
        setError(null);
        try {
            const data = await generateProjectBudget(projectDetails);
            setBudgetData(data);
            setViewState('results');
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
            setViewState('input');
        }
    };
    
    useEffect(() => {
        let timer;
        if (viewState === 'loading') {
            setProgress(10);
            timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) { clearInterval(timer); return prev; }
                    return Math.min(prev + (Math.random() * 10), 95);
                });
            }, 400);
        }
        return () => clearInterval(timer);
    }, [viewState]);

    const resetState = () => {
        setViewState('intro');
        setProjectDetails({ objectives: '', currency: 'USD', budgetCap: '', contingency: '10', scope: '' });
        setBudgetData(null);
        setError(null);
    };

    const renderCenterContent = () => {
        switch (viewState) {
            case 'input':
                return React.createElement(InputView, {
                    details: projectDetails, setDetails: setProjectDetails,
                    onBack: () => setViewState('intro'), onGenerate: handleGenerate, error
                });
            case 'loading':
                return React.createElement(LoadingView, { progress: Math.round(progress) });
            case 'intro':
            default:
                return React.createElement(IntroView, {
                    onEstimate: () => setViewState('input'), onSkip: resetState
                });
        }
    };

    if (viewState === 'results') {
        return React.createElement(ResultsView, { data: budgetData, onDiscard: resetState, onSave: () => alert('Budget Saved!') });
    }

    return React.createElement('div', { className: "h-full flex text-white p-6 gap-6" },
        React.createElement(LeftPanel, null),
        React.createElement('div', { className: "w-2/3 flex flex-col items-center justify-center" },
            renderCenterContent()
        )
    );
};

export default BudgetView;