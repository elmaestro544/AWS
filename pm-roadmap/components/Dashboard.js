

import React, { useState } from 'react';
import { i18n, DASHBOARD_VIEWS } from '../constants.js';
import AiAssistant from './SciGeniusChat.js';
import AuthRequired from './AuthRequired.js';
import UpgradeRequired from './UpgradeRequired.js';
import PlanningView from './PlanningView.js';
import SchedulingView from './SchedulingView.js';
import RiskView from './RiskView.js';
import BudgetView from './BudgetView.js';
import AgentView from './AgentView.js';
import { UserIcon, SidebarToggleIcon } from './Shared.js';

const Sidebar = ({ language, activeView, setActiveView, isExpanded, setExpanded, onLogout, currentUser }) => {
    const t = i18n[language];

    const getButtonClasses = (isActive) => {
        const baseClasses = `w-full flex items-center gap-4 text-left rounded-lg transition-all duration-200 ease-in-out relative`;
        const paddingClass = isExpanded ? 'px-4 py-3' : 'p-3 justify-center';
        const languageClass = language === 'ar' ? 'flex-row-reverse' : '';

        const activeStateClasses = isActive
            ? 'bg-brand-purple/20 text-white font-semibold'
            : 'text-brand-text-light hover:bg-white/10 hover:text-white';
        
        const activeIndicator = isActive ? React.createElement('div', { className: 'absolute left-0 top-0 h-full w-1 bg-brand-purple-light rounded-r-full' }) : null;

        return {
            className: `${baseClasses} ${paddingClass} ${languageClass} ${activeStateClasses}`,
            indicator: activeIndicator
        };
    };

    return React.createElement('aside', {
        className: `relative flex-shrink-0 bg-dark-card-solid flex flex-col transition-all duration-300 ease-in-out sidebar-glow ${isExpanded ? 'w-64' : 'w-20'}`
    },
        React.createElement('div', { className: 'flex-grow p-4 space-y-2' },
            DASHBOARD_VIEWS.map(view => {
                const Icon = view.icon;
                const isActive = activeView === view.id;
                const { className, indicator } = getButtonClasses(isActive);
                return React.createElement('div', { key: view.id, className: "relative group" },
                    indicator,
                    React.createElement('button', {
                        onClick: () => setActiveView(view.id),
                        className: className
                    },
                        React.createElement(Icon, { className: `h-6 w-6 flex-shrink-0` }),
                        isExpanded && React.createElement('span', { className: 'truncate' }, t[view.titleKey])
                    ),
                    !isExpanded && React.createElement('div', {
                        className: `absolute top-1/2 -translate-y-1/2 left-full ml-4 px-2 py-1 bg-dark-card-solid text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 ${language === 'ar' ? 'right-full mr-4 left-auto' : ''}`
                    }, t[view.titleKey])
                )
            })
        ),
        React.createElement('div', { className: 'p-4 border-t border-dark-border' },
            React.createElement('div', { className: `flex items-center gap-3 ${!isExpanded ? 'justify-center' : ''}` },
                React.createElement('div', { className: `p-2 bg-dark-bg rounded-full` }, React.createElement(UserIcon, { className: 'h-5 w-5' })),
                isExpanded && React.createElement('div', { className: 'flex-grow overflow-hidden' },
                    React.createElement('p', { className: 'text-sm font-semibold truncate text-white' }, currentUser?.fullName || 'Guest'),
                    React.createElement('button', { onClick: onLogout, className: 'text-xs text-brand-text-light hover:text-brand-purple-light' }, t.logout)
                )
            )
        ),
        React.createElement('div', { className: 'p-2 border-t border-dark-border' },
            React.createElement('button', {
                onClick: () => setExpanded(!isExpanded),
                'aria-label': isExpanded ? 'Collapse sidebar' : 'Expand sidebar',
                className: `w-full flex items-center p-2 text-left rounded-lg transition-colors text-brand-text-light hover:bg-white/10 ${isExpanded ? 'justify-end' : 'justify-center'}`
            },
                React.createElement(SidebarToggleIcon, { isExpanded: isExpanded })
            )
        )
    );
};

const PlaceholderView = ({ title, message, icon: Icon, showUpgrade, setView, language }) => {
    if (showUpgrade) {
        return React.createElement(UpgradeRequired, { language, setView });
    }
    return React.createElement('div', { className: "flex flex-col items-center justify-center h-full text-center p-8" },
        React.createElement('div', { className: "w-16 h-16 mb-4 text-slate-600" }, Icon && React.createElement(Icon, { className: "w-full h-full" })),
        React.createElement('h3', { className: "text-2xl font-bold text-white" }, title),
        React.createElement('p', { className: "text-brand-text-light mt-2 max-w-md" }, message)
    );
};


const Dashboard = ({ language, setView, currentUser, onLogout, onLoginClick }) => {
  const [activeView, setActiveView] = useState('agents');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const t = i18n[language];
  
  if (!currentUser) {
      return React.createElement('div', {className: 'container mx-auto p-4 md:p-8'}, React.createElement(AuthRequired, { language, onLoginClick }));
  }

  const renderActiveView = () => {
    if (activeView === 'planning') {
        return React.createElement(PlanningView, { language, currentUser });
    }
    if (activeView === 'scheduling') {
        return React.createElement(SchedulingView, { language, currentUser });
    }
    if (activeView === 'risk') {
        return React.createElement(RiskView, { language, currentUser });
    }
    if (activeView === 'budget') {
        return React.createElement(BudgetView, { language, currentUser });
    }
    if (activeView === 'agents') {
        return React.createElement(AgentView, { language, currentUser });
    }

    const viewConfig = DASHBOARD_VIEWS.find(v => v.id === activeView);
    const isPremiumFeature = false; // Temporarily disable premium checks for promotion
    const userIsFree = currentUser.plan === 'free' || !currentUser.plan;

    return React.createElement(PlaceholderView, {
        title: t[viewConfig.titleKey],
        message: `This is the ${t[viewConfig.titleKey]} section. Full functionality coming soon.`,
        icon: viewConfig.icon,
        showUpgrade: isPremiumFeature && userIsFree,
        setView: setView,
        language: language
    });
  };

  return React.createElement('div', { className: 'flex h-screen bg-dark-bg overflow-hidden' },
    React.createElement(Sidebar, { language, activeView, setActiveView, isExpanded: isSidebarExpanded, setExpanded: setIsSidebarExpanded, onLogout, currentUser }),
    React.createElement('div', { className: 'flex-1 flex flex-col min-w-0' },
        React.createElement('main', { className: 'flex-1 p-6 overflow-y-auto' },
            React.createElement('div', { className: "h-full bg-dark-card backdrop-blur-xl rounded-2xl glow-border" },
                renderActiveView()
            )
        ),
        React.createElement('div', { className: 'h-[400px] flex-shrink-0 px-6 pb-6' },
            React.createElement(AiAssistant, { language, currentUser })
        )
    )
  );
};

export default Dashboard;