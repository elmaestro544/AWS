import React from 'react';

const HistoryPanel = ({ title, items, renderItem, onClear }) => {
    return React.createElement('div', { className: "flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200" },
        React.createElement('div', { className: "p-4 border-b border-slate-200 flex justify-between items-center" },
            React.createElement('h3', { className: "text-lg font-semibold text-slate-900" }, title),
            React.createElement('button', {
                onClick: onClear,
                className: "text-sm text-slate-500 hover:text-red-600 transition-colors"
            }, 'Clear History')
        ),
        React.createElement('div', { className: "flex-grow p-4 space-y-2 overflow-y-auto" },
            items && items.length > 0
                ? items.map(item => renderItem(item))
                : React.createElement('div', { className: "text-center text-slate-400 py-10" },
                    React.createElement('p', null, 'No chat history')
                )
        )
    );
};

export default HistoryPanel;
