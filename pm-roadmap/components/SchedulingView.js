

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { generateScheduleFromObjective } from '../services/schedulingService.js';
import { ScheduleIcon, Spinner } from './Shared.js';

// --- Helper Functions ---
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const getDaysDiff = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start/end day
};

// --- Sub-Components ---
const IntroView = ({ onGenerateClick }) => (
    React.createElement('div', { className: 'text-center flex flex-col items-center animate-fade-in-up' },
        React.createElement(ScheduleIcon, null),
        React.createElement('h2', { className: 'text-3xl font-bold mt-4 mb-2 text-white' }, "Dynamic Scheduling Engine"),
        React.createElement('p', { className: 'max-w-md text-slate-400 mb-6' }, "Instantly adapt your project timeline. Generate a detailed Gantt chart from a high-level objective and see real-time updates when things change."),
        React.createElement('button', {
            onClick: onGenerateClick,
            className: "px-6 py-3 font-semibold text-white bg-cta-gradient rounded-lg shadow-lg shadow-glow-purple transition-opacity transform hover:scale-105"
        }, "Generate Example Schedule")
    )
);

const LoadingView = () => (
     React.createElement('div', { className: 'text-center flex flex-col items-center' },
        React.createElement(ScheduleIcon, { className: 'animate-pulse' }),
        React.createElement('h2', { className: 'text-3xl font-bold mt-4 mb-2 text-white' }, "Building Your Timeline..."),
        React.createElement('p', { className: 'text-slate-400 mb-8' }, "AI is calculating task dates and dependencies."),
        React.createElement(Spinner, { size: '12' })
    )
);

const GanttChart = ({ data, onReset }) => {
    const [collapsed, setCollapsed] = useState({});
    
    // Refs for scroll synchronization
    const taskListRef = useRef(null);
    const timelineRef = useRef(null);
    const isSyncingRef = useRef(false);
    const timeoutRef = useRef(null);

    const { projectStart, projectEnd, totalDays, phases } = useMemo(() => {
        if (!data || data.length === 0) return { phases: new Map() };
        
        const dates = data.flatMap(t => [new Date(t.start), new Date(t.end)]);
        const projectStart = new Date(Math.min(...dates));
        const projectEnd = new Date(Math.max(...dates));
        const totalDays = getDaysDiff(projectStart, projectEnd);

        const phases = new Map();
        data.forEach(task => {
            if (task.type === 'project') {
                phases.set(task.id, task);
            }
        });
        
        return { projectStart, projectEnd, totalDays, phases };
    }, [data]);

    // Effect for handling scroll synchronization
    useEffect(() => {
        const taskListEl = taskListRef.current;
        const timelineEl = timelineRef.current;

        const syncScrolls = (scrolledElement, targetElement) => {
            if (isSyncingRef.current) return;

            isSyncingRef.current = true;
            targetElement.scrollTop = scrolledElement.scrollTop;

            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                isSyncingRef.current = false;
            }, 50); // A short delay to unlock and prevent feedback loops
        };

        const handleTaskListScroll = () => syncScrolls(taskListEl, timelineEl);
        const handleTimelineScroll = () => syncScrolls(timelineEl, taskListEl);

        if (taskListEl && timelineEl) {
            taskListEl.addEventListener('scroll', handleTaskListScroll);
            timelineEl.addEventListener('scroll', handleTimelineScroll);
        }

        return () => {
            if (taskListEl && timelineEl) {
                taskListEl.removeEventListener('scroll', handleTaskListScroll);
                timelineEl.removeEventListener('scroll', handleTimelineScroll);
            }
            clearTimeout(timeoutRef.current);
        };
    }, []);

    const dayWidth = 40;

    const dateHeaders = Array.from({ length: totalDays }, (_, i) => {
        const date = addDays(projectStart, i);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            isToday: new Date().toDateString() === date.toDateString(),
        };
    });

    const getTaskPosition = (task) => {
        const left = getDaysDiff(projectStart, new Date(task.start)) * dayWidth - dayWidth;
        const width = getDaysDiff(new Date(task.start), new Date(task.end)) * dayWidth;
        return { left, width };
    };
    
    const toggleCollapse = (phaseId) => {
        setCollapsed(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
    };

    const phaseColors = ['#2DD4BF', '#A3E635', '#FACC15', '#FB923C', '#22D3EE']; // Turquoise, Green, Yellow, Orange, Cyan
    const phaseColorMap = new Map(Array.from(phases.keys()).map((id, i) => [id, phaseColors[i % phaseColors.length]]));

    const visibleTasks = data.filter(task => !task.project || !collapsed[task.project]);
    const timelineContentHeight = visibleTasks.length * 41; // Explicit height for scroll container

    return React.createElement('div', { className: 'w-full h-full flex flex-col bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden animate-fade-in-up' },
        React.createElement('div', { className: 'flex-shrink-0 p-4 border-b border-slate-700 flex justify-between items-center' },
            React.createElement('h3', { className: 'text-xl font-bold text-white' }, "Project Schedule"),
            React.createElement('button', {
                onClick: onReset,
                className: 'px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-md text-white'
            }, "Generate New")
        ),
        React.createElement('div', { className: 'flex-grow flex overflow-hidden' },
            // Task List
            React.createElement('div', { ref: taskListRef, className: 'w-[450px] flex-shrink-0 border-r border-slate-700 overflow-y-auto' },
                React.createElement('div', { className: 'grid grid-cols-[3fr,1fr,1fr,1fr,1fr] text-xs font-bold text-slate-400 p-2 sticky top-0 bg-slate-800 z-10' },
                    React.createElement('div', { className: 'pl-6' }, "Task"),
                    React.createElement('div', null, "Start"),
                    React.createElement('div', null, "End"),
                    React.createElement('div', null, "Days"),
                    React.createElement('div', { className: 'pr-2' }, "Progress")
                ),
                visibleTasks.map(task => {
                    const isPhase = task.type === 'project';
                    const duration = getDaysDiff(task.start, task.end);
                    const isCollapsed = collapsed[task.id];
                    return React.createElement('div', {
                        key: task.id,
                        className: `grid grid-cols-[3fr,1fr,1fr,1fr,1fr] text-sm items-center p-2 h-[41px] border-t border-slate-700/50 ${isPhase ? 'bg-slate-700/30 font-semibold' : ''} ${task.project ? 'pl-10' : 'pl-2'}`
                    },
                        React.createElement('div', { className: 'truncate flex items-center gap-2' },
                            isPhase && React.createElement('button', { onClick: () => toggleCollapse(task.id), className: 'transition-transform text-slate-400', style: { transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' } }, React.createElement('svg', {className: "w-4 h-4", fill: "currentColor", viewBox:"0 0 16 16"}, React.createElement('path', {d:"M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"}))),
                            task.name
                        ),
                        React.createElement('div', null, new Date(task.start).toLocaleDateString()),
                        React.createElement('div', null, new Date(task.end).toLocaleDateString()),
                        React.createElement('div', null, `${duration}d`),
                        React.createElement('div', { className: 'w-full bg-slate-600 rounded-full h-4 relative' },
                            React.createElement('div', {
                                className: 'h-full rounded-full',
                                style: { width: `${task.progress}%`, backgroundColor: phaseColorMap.get(task.project || task.id) }
                            }),
                             React.createElement('span', {className: 'absolute inset-0 text-center text-xs font-bold text-white' }, `${task.progress}%`)
                        )
                    );
                })
            ),
            // Timeline
            React.createElement('div', { ref: timelineRef, className: 'flex-grow overflow-auto relative' },
                React.createElement('div', { style: { width: totalDays * dayWidth } },
                    React.createElement('div', { className: 'sticky top-0 bg-slate-800 z-10 h-12 flex' },
                        dateHeaders.map((header, i) => React.createElement('div', {
                            key: i, style: { width: dayWidth },
                            className: `flex-shrink-0 text-center border-r border-slate-700`
                        },
                            React.createElement('div', { className: 'text-xs text-slate-400' }, i === 0 || header.day === 1 ? header.month : ''),
                            React.createElement('div', { className: `font-semibold ${header.isToday ? 'text-brand-cyan' : 'text-white'}` }, header.day)
                        ))
                    ),
                    React.createElement('div', { className: 'absolute top-12 left-0 h-full w-full' },
                        dateHeaders.map((header, i) => React.createElement('div', {
                            key: i, style: { left: i * dayWidth, width: dayWidth },
                            className: `absolute top-0 h-full border-r border-slate-700/50 ${header.isWeekend ? 'bg-slate-700/20' : ''}`
                        }))
                    ),
                    React.createElement('div', { className: 'relative', style: { height: `${timelineContentHeight}px` } },
                        visibleTasks.map((task, index) => {
                            const { left, width } = getTaskPosition(task);
                            const top = index * 41 + 4;
                            const barColor = phaseColorMap.get(task.project || task.id) || '#3B82F6';

                            if (task.type === 'milestone') {
                                return React.createElement('div', {
                                    key: task.id, title: task.name,
                                    className: 'absolute h-6 w-6 -translate-x-1/2 rotate-45',
                                    style: { left: left + dayWidth, top: top + 8, backgroundColor: barColor },
                                });
                            }

                            return React.createElement('div', {
                                key: task.id, title: `${task.name} (${task.progress}%)`,
                                className: 'absolute h-8 rounded-md flex items-center group',
                                style: { left, width, top, backgroundColor: barColor, opacity: task.type === 'project' ? 0.8 : 1 }
                            },
                                React.createElement('div', { className: 'absolute left-0 top-0 h-full bg-black/20 rounded-md', style: { width: `${task.progress}%` } }),
                                task.type !== 'project' && React.createElement('span', { className: 'relative text-xs font-bold text-white truncate px-2' }, `${task.name}`)
                            );
                        })
                    )
                )
            )
        )
    );
};


const SchedulingView = () => {
    const [viewState, setViewState] = useState('intro'); // intro, loading, results
    const [scheduleData, setScheduleData] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setViewState('loading');
        setError(null);
        setScheduleData(null);
        try {
            const objective = "Develop and launch a new mobile banking application for iOS and Android within 6 months, focusing on user-friendly design, secure transactions, and integration with existing bank systems.";
            const data = await generateScheduleFromObjective(objective);
            setScheduleData(data);
            setViewState('results');
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
            setViewState('intro');
        }
    };

    const renderContent = () => {
        if (error) {
             return React.createElement('div', { className: "bg-red-500/10 border border-red-500/30 text-center p-4 rounded-md text-red-400" },
                React.createElement('p', {className: "font-bold"}, "Generation Failed"),
                React.createElement('p', {className: "text-sm"}, error),
                React.createElement('button', {
                    onClick: () => { setError(null); setViewState('intro'); },
                    className: "mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-md"
                }, "Try Again")
             );
        }

        switch (viewState) {
            case 'loading':
                return React.createElement(LoadingView, null);
            case 'results':
                return React.createElement(GanttChart, { data: scheduleData, onReset: () => setViewState('intro') });
            case 'intro':
            default:
                return React.createElement(IntroView, { onGenerateClick: handleGenerate });
        }
    };

    return React.createElement('div', { className: "h-full flex flex-col items-center justify-center" },
        renderContent()
    );
};

export default SchedulingView;