import React from 'react';

const ScoreCircle = ({ label, value, maxValue }) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;
    
    const getColor = () => {
        if (percentage >= 80) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return React.createElement('div', { className: "flex flex-col items-center text-center" },
        React.createElement('div', { className: "relative w-28 h-28" },
            React.createElement('svg', { className: "w-full h-full", viewBox: "0 0 100 100" },
                React.createElement('circle', { className: "text-gray-200", strokeWidth: "10", stroke: "currentColor", fill: "transparent", r: "45", cx: "50", cy: "50" }),
                React.createElement('circle', {
                    className: getColor(),
                    strokeWidth: "10",
                    strokeDasharray: circumference,
                    strokeDashoffset: offset,
                    strokeLinecap: "round",
                    stroke: "currentColor",
                    fill: "transparent",
                    r: "45",
                    cx: "50",
                    cy: "50",
                    style: { transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }
                })
            ),
            React.createElement('div', { className: `absolute inset-0 flex items-center justify-center text-2xl font-bold ${getColor()}` },
                `${value}/${maxValue}`
            )
        ),
        React.createElement('p', { className: "mt-2 text-sm font-semibold text-gray-600" }, label)
    );
};

const ScoreDisplay = ({ scoreItems, feedback }) => {
    return React.createElement('div', { className: "bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg animate-fade-in border border-white/30" },
        React.createElement('h2', { className: "text-2xl font-bold text-center text-gray-800 mb-6" }, 'Your Score Report'),
        React.createElement('div', { className: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-8 justify-center` },
            scoreItems.map(item => 
                React.createElement(ScoreCircle, { key: item.label, label: item.label, value: item.value, maxValue: item.maxValue })
            )
        ),
        React.createElement('div', null,
            React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-2" }, 'AI Feedback:'),
            React.createElement('div', { className: "bg-gray-100 p-4 rounded-lg" },
                React.createElement('p', { className: "text-gray-700 leading-relaxed" }, feedback)
            )
        )
    );
};

export default ScoreDisplay;