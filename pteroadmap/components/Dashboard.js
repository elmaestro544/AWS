import React, { useState, useCallback, useEffect } from 'react';
import { InfoIcon, CalendarIcon, ChevronRightIcon, SpeakingColoredIcon, WritingColoredIcon, ReadingColoredIcon, ListeningColoredIcon } from './icons.js';
import { analyzePteScores } from '../services/geminiService.js';
import { studyPlanData } from './studyPlanData.js';

const practiceTypeMap = {
    'read-aloud': 'Read Aloud',
    'repeat-sentence': 'Repeat Sentence',
    'describe-image': 'Describe Image',
    'retell-lecture': 'Re-tell Lecture',
    'answer-short-question': 'Answer Short Question',
    'summarize-written-text': 'Summarize Written Text',
    'write-essay': 'Write Essay',
    'reading-multiple-choice-single': 'Multiple Choice (Single)',
    'reading-multiple-choice-multiple': 'Multiple Choice (Multiple)',
    're-order-paragraphs': 'Re-order Paragraphs',
    'fill-in-blanks-drag-drop': 'Fill in Blanks (Drag & Drop)',
    'fill-in-blanks-dropdown': 'Fill in Blanks (Dropdown)',
    'summarize-spoken-text': 'Summarize Spoken Text',
    'listening-multiple-choice-multiple': 'Multiple Choice (Multiple)',
    'listening-multiple-choice-single': 'Multiple Choice (Single)',
    'highlight-correct-summary': 'Highlight Correct Summary',
    'select-missing-word': 'Select Missing Word',
    'fill-in-blanks-listening': 'Fill in the Blanks',
    'highlight-incorrect-words': 'Highlight Incorrect Words',
    'write-from-dictation': 'Write From Dictation'
};


const ScoreInputSlider = ({ label, score, setScore }) => {
    return React.createElement('div', { className: 'w-full' },
        React.createElement('div', { className: 'flex justify-between mb-1' },
            React.createElement('span', { className: 'text-sm font-medium text-gray-700' }, label),
            React.createElement('span', { className: 'text-sm font-bold text-gray-800' }, `${score} / 90`)
        ),
        React.createElement('input', {
            type: 'range',
            min: '10',
            max: '90',
            value: score,
            onChange: (e) => setScore(Number(e.target.value)),
            className: `w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer`
        })
    );
};

const AIScoreAnalysis = ({ navigateTo }) => {
    // Initial scores from the user prompt
    const [scores, setScores] = useState({
        listening: 88,
        reading: 72,
        speaking: 79,
        writing: 85,
        grammar: 90,
        oralFluency: 75,
        pronunciation: 72,
        spelling: 88,
        vocabulary: 82,
        writtenDiscourse: 85,
    });
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const handleScoreChange = (skill, value) => {
        setScores(prev => ({ ...prev, [skill]: value }));
        setAnalysis(null); // Reset analysis if scores change
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzePteScores(scores);
            setAnalysis(result);
        } catch (err) {
            setError('Failed to analyze scores. The AI model may be busy. Please try again.');
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return React.createElement('div', { className: 'bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-lg border border-white/30' },
        React.createElement('p', { className: 'text-gray-600 mb-6 text-center' }, 'Enter your official PTE scores or an estimation to receive a personalized analysis and study plan from our AI coach.'),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },
            React.createElement('div', null,
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Communicative Skills'),
                React.createElement('div', { className: 'space-y-4' },
                    React.createElement(ScoreInputSlider, { label: 'Listening', score: scores.listening, setScore: (v) => handleScoreChange('listening', v) }),
                    React.createElement(ScoreInputSlider, { label: 'Reading', score: scores.reading, setScore: (v) => handleScoreChange('reading', v) }),
                    React.createElement(ScoreInputSlider, { label: 'Speaking', score: scores.speaking, setScore: (v) => handleScoreChange('speaking', v) }),
                    React.createElement(ScoreInputSlider, { label: 'Writing', score: scores.writing, setScore: (v) => handleScoreChange('writing', v) })
                )
            ),
            React.createElement('div', null,
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Enabling Skills'),
                React.createElement('div', { className: 'space-y-4' },
                    React.createElement(ScoreInputSlider, { label: 'Grammar', score: scores.grammar, setScore: (v) => handleScoreChange('grammar', v) }),
                    React.createElement(ScoreInputSlider, { label: 'Oral Fluency', score: scores.oralFluency, setScore: (v) => handleScoreChange('oralFluency', v) }),
                    React.createElement(ScoreInputSlider, { label: 'Pronunciation', score: scores.pronunciation, setScore: (v) => handleScoreChange('pronunciation', v) }),
                    React.createElement(ScoreInputSlider, { label: 'Spelling', score: scores.spelling, setScore: (v) => handleScoreChange('spelling', v) }),
                    React.createElement(ScoreInputSlider, { label: 'Vocabulary', score: scores.vocabulary, setScore: (v) => handleScoreChange('vocabulary', v) }),
                    React.createElement(ScoreInputSlider, { label: 'Written Discourse', score: scores.writtenDiscourse, setScore: (v) => handleScoreChange('writtenDiscourse', v) })
                )
            )
        ),
        React.createElement('div', { className: 'mt-8 flex justify-center' },
            React.createElement('button', {
                onClick: handleAnalyze,
                disabled: isAnalyzing,
                className: 'px-8 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-70 disabled:cursor-not-allowed'
            }, isAnalyzing ? 'Analyzing...' : 'Analyze My Scores')
        ),
        isAnalyzing && React.createElement('div', { className: 'mt-8 flex justify-center items-center' },
            React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' }),
            React.createElement('p', { className: 'ml-3 text-gray-600' }, 'Generating your personalized feedback...')
        ),
        error && React.createElement('div', { className: 'mt-6 text-red-600 bg-red-100 p-4 rounded-lg text-center' }, error),
        analysis && !isAnalyzing && React.createElement('div', { className: 'mt-8 pt-6 border-t animate-fade-in' },
            React.createElement('h3', { className: 'text-2xl font-bold text-gray-800 text-center mb-6' }, "Your Personalized Feedback"),
            React.createElement('div', { className: 'bg-gray-50 p-6 rounded-lg' },
                React.createElement('h4', { className: 'text-lg font-semibold text-gray-800 mb-2' }, 'Overall Summary'),
                React.createElement('p', { className: 'text-gray-700' }, analysis.overallSummary)
            ),
            React.createElement('div', { className: 'mt-6' },
                React.createElement('h4', { className: 'text-lg font-semibold text-gray-800 mb-4' }, 'Areas for Improvement'),
                React.createElement('div', { className: 'space-y-4' },
                    analysis.areasForImprovement.map(item => React.createElement('div', { key: item.skill, className: 'bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg' },
                        React.createElement('p', { className: 'font-bold text-gray-800' }, `${item.skill} - Score: ${item.score}/90`),
                        React.createElement('p', { className: 'text-gray-700 my-2' }, item.feedback),
                        React.createElement('div', null,
                            React.createElement('h5', { className: 'text-sm font-semibold text-gray-800 mb-2' }, 'Suggested Practice:'),
                            React.createElement('div', { className: 'flex flex-wrap gap-2' },
                                item.suggestedPractice.map(practiceKey => React.createElement('button', {
                                    key: practiceKey,
                                    onClick: () => navigateTo(practiceKey),
                                    className: 'text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium py-1 px-3 rounded-full transition-colors'
                                },
                                    practiceTypeMap[practiceKey] || practiceKey
                                ))
                            )
                        )
                    ))
                )
            )
        )
    );
};

const practiceData = [
    {
        title: 'Speaking',
        icon: React.createElement(SpeakingColoredIcon),
        items: [
            { name: 'Read Aloud', view: 'read-aloud', aiScored: true },
            { name: 'Repeat Sentence', view: 'repeat-sentence', aiScored: true },
            { name: 'Describe Image', view: 'describe-image', aiScored: true },
            { name: 'Re-tell Lecture', view: 'retell-lecture', aiScored: true },
            { name: 'Answer Short Question', view: 'answer-short-question', aiScored: true },
        ],
    },
    {
        title: 'Writing',
        icon: React.createElement(WritingColoredIcon),
        items: [
            { name: 'Summarize Written Text', view: 'summarize-written-text', aiScored: true },
            { name: 'Write Essay', view: 'write-essay', aiScored: true },
        ],
    },
    {
        title: 'Reading',
        icon: React.createElement(ReadingColoredIcon),
        items: [
            { name: 'Multiple Choice (Single)', view: 'reading-multiple-choice-single', aiScored: false },
            { name: 'Multiple Choice (Multiple)', view: 'reading-multiple-choice-multiple', aiScored: false },
            { name: 'Re-order Paragraphs', view: 're-order-paragraphs', aiScored: false },
            { name: 'Fill in Blanks (Drag & Drop)', view: 'fill-in-blanks-drag-drop', aiScored: false },
            { name: 'Fill in Blanks (Dropdown)', view: 'fill-in-blanks-dropdown', aiScored: false },
        ],
    },
    {
        title: 'Listening',
        icon: React.createElement(ListeningColoredIcon),
        items: [
            { name: 'Summarize Spoken Text', view: 'summarize-spoken-text', aiScored: true },
            { name: 'Multiple Choice (Multiple)', view: 'listening-multiple-choice-multiple', aiScored: false },
            { name: 'Multiple Choice (Single)', view: 'listening-multiple-choice-single', aiScored: false },
            { name: 'Highlight Correct Summary', view: 'highlight-correct-summary', aiScored: false },
            { name: 'Select Missing Word', view: 'select-missing-word', aiScored: false },
            { name: 'Fill in the Blanks', view: 'fill-in-blanks-listening', aiScored: false },
            { name: 'Highlight Incorrect Words', view: 'highlight-incorrect-words', aiScored: false },
            { name: 'Write From Dictation', view: 'write-from-dictation', aiScored: true },
        ],
    }
];

const ProgressChart = () => {
  const data = [
    { date: '2025-09-01', score: 58 },
    { date: '2025-09-10', score: 65 },
    { date: '2025-09-20', score: 62 },
    { date: '2025-10-01', score: 70 },
    { date: '2025-10-10', score: 75 },
  ];
  
  const width = 500;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const xScale = (index) => padding.left + (index / (data.length - 1)) * chartWidth;
  const yScale = (score) => padding.top + chartHeight - (score / 100) * chartHeight;

  const linePoints = data.map((d, i) => `${xScale(i)},${yScale(d.score)}`).join(' ');

  const yGridLines = [0, 25, 50, 75, 100];

  const yAxisElements = yGridLines.map(value => React.createElement(React.Fragment, { key: `grid-${value}` },
    React.createElement('line', {
        x1: padding.left,
        y1: yScale(value),
        x2: width - padding.right,
        y2: yScale(value),
        className: 'stroke-current text-gray-200',
        strokeWidth: '1'
    }),
    React.createElement('text', {
        x: padding.left - 8,
        y: yScale(value) + 4,
        className: 'text-xs fill-current text-gray-500',
        textAnchor: 'end'
    }, value)
  ));
  
  const xAxisElements = data.map((d, i) => React.createElement('text', {
    key: `label-${i}`,
    x: xScale(i),
    y: height - padding.bottom + 15,
    className: 'text-xs fill-current text-gray-500',
    textAnchor: 'middle'
  }, d.date));
  
  const dataPointElements = data.map((d, i) => React.createElement('circle', {
    key: `point-${i}`,
    cx: xScale(i),
    cy: yScale(d.score),
    r: '4',
    className: 'fill-current text-blue-500 stroke-current text-white',
    strokeWidth: '2'
  }));

  return React.createElement('svg', { 
    viewBox: `0 0 ${width} ${height}`, 
    className: 'w-full h-auto',
    'aria-labelledby': 'progress-chart-title',
    role: 'img'
  },
    React.createElement('title', { id: 'progress-chart-title' }, 'A line chart showing user practice score progress over the last 30 days.'),
    ...yAxisElements,
    ...xAxisElements,
    React.createElement('polyline', {
        fill: 'none',
        className: 'stroke-current text-blue-500',
        strokeWidth: '2',
        points: linePoints
    }),
    ...dataPointElements
  );
};

const StudyPlanToday = ({ navigateTo }) => {
    // For demonstration, we'll feature a specific day. Let's pick the start of Week 2.
    const todayData = studyPlanData["Week 2"][0]; // Day 8

    return React.createElement('div', { className: 'bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-lg border border-white/30' },
        // Header
        React.createElement('div', { className: 'flex justify-between items-start mb-4' },
            React.createElement('div', null,
                React.createElement('h3', { className: 'text-2xl font-bold text-gray-800' }, `Today's Focus: Day ${todayData.day}`),
                React.createElement('p', { className: 'text-gray-600 mt-1' }, todayData.theme)
            ),
            React.createElement(CalendarIcon, { className: 'h-10 w-10 text-blue-300' })
        ),
        // Goal
        React.createElement('p', { className: 'mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-r-lg' }, 
            React.createElement('strong', null, 'Goal: '), todayData.goal
        ),

        // Sessions
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
            todayData.sessions.map(session => (
                React.createElement('div', { key: session.title, className: 'bg-gray-50 p-4 rounded-lg' },
                    React.createElement('h4', { className: 'font-semibold text-gray-700 border-b pb-2 mb-3' }, `${session.title} (${session.time})`),
                    React.createElement('ul', { className: 'space-y-4' },
                        session.activities.map((activity, index) => (
                            React.createElement('li', { key: index, className: 'text-sm text-gray-700' },
                                activity.description,
                                activity.navigateToView && React.createElement('button', {
                                    onClick: () => navigateTo(activity.navigateToView),
                                    className: 'flex items-center text-xs bg-blue-100 text-blue-800 font-semibold py-1 px-2 rounded-full hover:bg-blue-200 transition-colors mt-2'
                                }, 'Start Practice ', React.createElement(ChevronRightIcon, { className: 'w-3 h-3 ml-1' }))
                            )
                        ))
                    )
                )
            ))
        ),

        // Footer CTA
        React.createElement('div', { className: 'mt-8 flex justify-center' },
            React.createElement('button', {
                onClick: () => navigateTo('study-plan'),
                className: 'flex items-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-br from-[#3b82f6] to-[#ec4899] rounded-lg shadow-md hover:shadow-lg transition-all'
            },
                'View Full 30-Day Study Plan',
                React.createElement(ChevronRightIcon, { className: 'w-5 h-5 ml-2' })
            )
        )
    );
};

const Dashboard = ({ navigateTo }) => {
    const [examDate, setExamDate] = useState(null);
    const [daysUntilExam, setDaysUntilExam] = useState(null);
    const [isSettingDate, setIsSettingDate] = useState(false);
    const [dateInputValue, setDateInputValue] = useState('');

    useEffect(() => {
        if (examDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const exam = new Date(examDate);
            exam.setHours(0, 0, 0, 0);

            const diffTime = exam.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysUntilExam(diffDays);
            
            // Format date for input field
            const year = exam.getFullYear();
            const month = (exam.getMonth() + 1).toString().padStart(2, '0');
            const day = exam.getDate().toString().padStart(2, '0');
            setDateInputValue(`${year}-${month}-${day}`);
        } else {
            setDaysUntilExam(null);
            setDateInputValue('');
        }
    }, [examDate]);
    
    const handleSetDateClick = () => {
        setIsSettingDate(true);
    };
    
    const handleCancelSetDate = () => {
        setIsSettingDate(false);
         if (examDate) {
            const year = examDate.getFullYear();
            const month = (examDate.getMonth() + 1).toString().padStart(2, '0');
            const day = examDate.getDate().toString().padStart(2, '0');
            setDateInputValue(`${year}-${month}-${day}`);
         } else {
            setDateInputValue('');
         }
    };
    
    const handleSaveDate = () => {
        if (dateInputValue) {
            const [year, month, day] = dateInputValue.split('-').map(Number);
            const newDate = new Date(year, month - 1, day);
            setExamDate(newDate);
        } else {
            setExamDate(null);
        }
        setIsSettingDate(false);
    };

    const handleClearDate = () => {
        setExamDate(null);
    };
    
    const renderCountdownModule = () => {
        const content = isSettingDate
            ? React.createElement(React.Fragment, null,
                React.createElement('label', { htmlFor: 'examDateInput', className: 'text-sm font-medium' }, 'Select your exam date:'),
                React.createElement('input', {
                    id: 'examDateInput',
                    type: 'date',
                    value: dateInputValue,
                    onChange: (e) => setDateInputValue(e.target.value),
                    className: 'bg-white/20 border border-white/30 rounded-md px-2 py-1 text-white'
                }),
                React.createElement('div', { className: 'flex gap-2 mt-2' },
                    React.createElement('button', { onClick: handleSaveDate, className: 'text-xs bg-white text-blue-600 font-semibold px-3 py-1 rounded-md hover:bg-gray-100' }, 'Save'),
                    React.createElement('button', { onClick: handleCancelSetDate, className: 'text-xs bg-transparent text-white font-semibold px-3 py-1 rounded-md hover:bg-white/10' }, 'Cancel')
                )
            )
            : React.createElement(React.Fragment, null,
                React.createElement('div', { className: 'flex items-center gap-6' },
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('p', { className: `text-5xl font-bold ${daysUntilExam !== null && daysUntilExam < 0 ? 'text-red-300' : ''}` }, daysUntilExam ?? '--'),
                        React.createElement('p', { className: 'text-xs opacity-80 uppercase tracking-wider' }, 'days until exam')
                    ),
                    React.createElement('div', { className: 'text-center' },
                        React.createElement('p', { className: 'text-2xl font-bold' }, '85%'),
                        React.createElement('p', { className: 'text-xs opacity-80 uppercase tracking-wider mt-1' }, 'Ready'),
                        React.createElement('div', { className: 'w-16 bg-white/30 rounded-full h-1.5 mt-2 mx-auto' },
                            React.createElement('div', { className: 'bg-green-400 h-1.5 rounded-full', style: { width: '85%' } })
                        )
                    )
                ),
                React.createElement('div', { className: 'flex flex-col gap-2 mt-4' },
                    React.createElement('button', {
                        onClick: handleSetDateClick,
                        className: 'bg-white/90 text-blue-700 font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-white transition-transform transform hover:scale-105'
                    }, examDate ? 'Reschedule' : 'Set Exam Date'),
                     examDate && React.createElement('button', {
                        onClick: handleClearDate,
                        className: 'text-xs text-white/80 hover:text-white hover:underline'
                    }, 'Clear Date')
                )
            );
            
        return React.createElement('div', { className: 'bg-black/20 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center' }, content);
    };

    return React.createElement('div', { className: "space-y-8" },
        React.createElement('div', { className: 'bg-gradient-to-br from-[#3b82f6] to-[#ec4899] text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center' },
            React.createElement('div', { className: 'text-center md:text-left mb-6 md:mb-0' },
                React.createElement('h1', { className: 'text-3xl font-bold' }, 'Welcome!'),
                React.createElement('p', { className: 'mt-2 text-lg opacity-90' },
                    'Your comprehensive PTE practice roadmap.'
                )
            ),
            renderCountdownModule()
        ),
         React.createElement('section', { 
            'aria-labelledby': 'full-mock-test-title', 
            onClick: () => navigateTo('full-mock-test-intro'),
            className: "bg-gradient-to-r from-purple-600 to-blue-500 text-white p-8 rounded-xl shadow-xl cursor-pointer hover:shadow-2xl transition-shadow transform hover:-translate-y-1"
        },
            React.createElement('h2', { id: 'full-mock-test-title', className: "text-3xl font-bold" }, "New! Full-Length Mock Test"),
            React.createElement('p', { className: 'mt-2 text-lg opacity-90 max-w-3xl' }, "Experience the real 2-hour PTE exam with our comprehensive, AI-scored full mock test covering all four sections."),
            React.createElement('div', { className: 'mt-4 font-semibold flex items-center' }, 'Learn More & Start ', React.createElement(ChevronRightIcon, { className: 'w-5 h-5 ml-1' }))
        ),
        React.createElement('section', { 'aria-labelledby': 'quick-practice-title' },
            React.createElement('h2', { id: 'quick-practice-title', className: "text-2xl font-bold text-gray-800 mb-4" }, "Quick Practice"),
            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                practiceData.map((category) => {
                    return React.createElement('div', { key: category.title, className: "bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/30" },
                        React.createElement('div', { className: "p-6" },
                            React.createElement('div', { className: 'flex items-center mb-4' },
                                category.icon,
                                React.createElement('h3', { className: "text-xl font-bold text-gray-900 ml-3" }, category.title)
                            ),
                            React.createElement('div', { className: "flex flex-wrap gap-2" },
                                category.items.map((item) => (
                                    React.createElement('button', {
                                        key: item.view,
                                        onClick: () => navigateTo(item.view),
                                        className: "flex items-center bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium py-2 px-4 rounded-full transition-colors text-sm"
                                    },
                                        item.name,
                                        item.aiScored && React.createElement('span', {
                                            className: "ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                        }, "AI Score")
                                    )
                                ))
                            )
                        )
                    );
                })
            )
        ),
        React.createElement('section', { 'aria-labelledby': 'mock-tests-title' },
            React.createElement('h2', { id: 'mock-tests-title', className: "text-2xl font-bold text-gray-800 mb-4" }, "Mock Tests"),
            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" },
                React.createElement('div', { 
                    onClick: () => navigateTo('reading-mock-test'), 
                    className: "bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
                },
                    React.createElement(ReadingColoredIcon),
                    React.createElement('h3', { className: "text-xl font-bold text-gray-900 mt-4" }, "PTE Reading Mock Test"),
                    React.createElement('p', { className: "text-sm text-gray-600 mt-1" }, "Understand the patterns and question types for the reading section.")
                ),
                 React.createElement('div', { 
                    onClick: () => navigateTo('writing-mock-test'), 
                    className: "bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
                },
                    React.createElement(WritingColoredIcon),
                    React.createElement('h3', { className: "text-xl font-bold text-gray-900 mt-4" }, "PTE Writing Mock Test"),
                    React.createElement('p', { className: "text-sm text-gray-600 mt-1" }, "Learn about the essay and summary tasks and what skills are required.")
                ),
                React.createElement('div', { 
                    onClick: () => navigateTo('speaking-mock-test'), 
                    className: "bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
                },
                    React.createElement(SpeakingColoredIcon),
                    React.createElement('h3', { className: "text-xl font-bold text-gray-900 mt-4" }, "PTE Speaking Mock Test"),
                    React.createElement('p', { className: "text-sm text-gray-600 mt-1" }, "Practice all speaking tasks and see the skills you need to master.")
                ),
                 React.createElement('div', { 
                    onClick: () => navigateTo('listening-mock-test'), 
                    className: "bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
                },
                    React.createElement(ListeningColoredIcon),
                    React.createElement('h3', { className: "text-xl font-bold text-gray-900 mt-4" }, "PTE Listening Mock Test"),
                    React.createElement('p', { className: "text-sm text-gray-600 mt-1" }, "Discover all listening tasks and the skills needed to succeed.")
                )
            )
        ),
        React.createElement('section', { 'aria-labelledby': 'ai-analysis-title' },
            React.createElement('h2', { id: 'ai-analysis-title', className: "text-2xl font-bold text-gray-800 mb-4" }, "AI Score Report Analysis"),
            React.createElement(AIScoreAnalysis, { navigateTo: navigateTo })
        ),
        React.createElement('section', { 'aria-labelledby': 'study-plan-title' },
            React.createElement(StudyPlanToday, { navigateTo: navigateTo })
        ),
        React.createElement('section', { 'aria-labelledby': 'progress-title' },
            React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                React.createElement('div', null,
                    React.createElement('h2', { id: 'progress-title', className: "text-2xl font-bold text-gray-800" }, "Your Progress"),
                    React.createElement('p', { className: 'text-sm text-gray-500' }, 'Last 30 days')
                ),
                React.createElement('div', { className: 'text-right' },
                     React.createElement('p', { className: 'text-lg font-semibold text-gray-800' }, 'Current average: 66'),
                     React.createElement('p', { className: 'text-sm text-gray-500' }, 'Overall Score')
                )
            ),
            React.createElement('div', { className: 'bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/30' },
                React.createElement(ProgressChart, null)
            )
        )
    );
};

export default Dashboard;