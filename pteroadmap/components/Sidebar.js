import React, { useState, useEffect } from 'react';
import { HomeIcon, SpeakingIcon, WritingIcon, ReadingIcon, ListeningIcon, ChevronRightIcon, ChartBarIcon, BookOpenIcon, CalendarIcon, ChatBubbleLeftRightIcon, ChevronDoubleLeftIcon } from './icons.js';

const Sidebar = ({ navigateTo, currentView, isCollapsed, toggleCollapse }) => {
  const speakingViews = ['read-aloud', 'repeat-sentence', 'describe-image', 'retell-lecture', 'answer-short-question'];
  const isSpeakingActive = speakingViews.includes(currentView);

  const writingViews = ['summarize-written-text', 'write-essay'];
  const isWritingActive = writingViews.includes(currentView);
  
  const readingViews = ['fill-in-blanks-dropdown', 'reading-multiple-choice-multiple', 're-order-paragraphs', 'reading-multiple-choice-single', 'fill-in-blanks-drag-drop'];
  const isReadingActive = readingViews.includes(currentView);

  const listeningViews = ['summarize-spoken-text', 'listening-multiple-choice-multiple', 'listening-multiple-choice-single', 'fill-in-blanks-listening', 'highlight-correct-summary', 'select-missing-word', 'highlight-incorrect-words', 'write-from-dictation'];
  const isListeningActive = listeningViews.includes(currentView);

  const isStudyGuidesActive = currentView === 'study-guides';

  const [expandedSections, setExpandedSections] = useState({
    speaking: false,
    writing: false,
    reading: false,
    listening: false,
    studyGuides: false,
  });

  useEffect(() => {
    // This effect ensures the correct section is expanded when a view is selected.
    setExpandedSections({
      speaking: isSpeakingActive,
      writing: isWritingActive,
      reading: isReadingActive,
      listening: isListeningActive,
      studyGuides: isStudyGuidesActive,
    });
  }, [isSpeakingActive, isWritingActive, isReadingActive, isListeningActive, isStudyGuidesActive]);

  const toggleSection = (section) => {
    if (isCollapsed) {
        toggleCollapse(); // Expand sidebar first
    }
    setExpandedSections(prev => {
        const isCurrentlyOpen = !!prev[section];
        const shouldOpen = isCollapsed ? true : !isCurrentlyOpen;
        // Reset all sections to false, then set the clicked one
        return {
            speaking: false,
            writing: false,
            reading: false,
            listening: false,
            studyGuides: false,
            [section]: shouldOpen,
        };
    });
  };

  const navLinkClasses = (isActive) =>
    `flex items-center p-2 sm:p-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
      isActive
        ? 'bg-blue-500/10 text-blue-600 font-semibold'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;
  
  const subNavLinkClasses = (isActive) =>
    `flex items-center w-full py-2 px-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
        isActive
        ? 'bg-blue-50 text-blue-600 font-semibold'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return React.createElement('aside', { className: `bg-white text-gray-800 flex flex-col border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16 sm:w-20' : 'w-16 sm:w-64'}` },
    React.createElement('div', { className: "flex-1 flex flex-col overflow-y-auto overscroll-contain" },
        React.createElement('nav', { className: "flex-1 px-2 sm:px-4 py-4 space-y-1" },
          React.createElement('div', {
              className: `${navLinkClasses(currentView === 'dashboard')} justify-between`
          },
              React.createElement('a', {
                  href: "#",
                  onClick: (e) => { 
                    e.preventDefault(); 
                    if (isCollapsed) {
                        toggleCollapse();
                    } else {
                        navigateTo('dashboard');
                    }
                  },
                  title: isCollapsed ? 'Expand menu' : 'Go to Dashboard',
                  className: 'flex items-center flex-grow'
              },
                  React.createElement(HomeIcon, { className: "h-6 w-6" }),
                  React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'Dashboard')
              ),
              React.createElement('button', {
                  onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCollapse();
                  },
                  title: 'Collapse menu',
                  className: `p-1 text-gray-500 rounded-full hover:bg-gray-500/20 transition-colors ${isCollapsed ? 'hidden' : 'hidden sm:inline'}`
              },
                  React.createElement(ChevronDoubleLeftIcon, { className: `h-5 w-5` })
              )
          ),
          React.createElement('a', {
            href: "#",
            onClick: (e) => { e.preventDefault(); navigateTo('full-mock-test-intro'); },
            className: navLinkClasses(currentView === 'full-mock-test-intro')
          },
            React.createElement(BookOpenIcon, { className: "h-6 w-6" }),
            React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'Full Mock Test')
          ),
          React.createElement('a', {
            href: "#",
            onClick: (e) => { e.preventDefault(); navigateTo('ai-language-tutor'); },
            className: navLinkClasses(currentView === 'ai-language-tutor')
          },
            React.createElement(ChatBubbleLeftRightIcon, { className: "h-6 w-6" }),
            React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'AI Conversation Practice')
          ),
          React.createElement('a', {
            href: "#",
            onClick: (e) => { e.preventDefault(); navigateTo('study-plan'); },
            className: navLinkClasses(currentView === 'study-plan')
          },
            React.createElement(CalendarIcon, { className: "h-6 w-6" }),
            React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'Study Plan')
          ),
          React.createElement('a', {
            href: "#",
            onClick: (e) => { e.preventDefault(); navigateTo('pte-score-report'); },
            className: navLinkClasses(currentView === 'pte-score-report')
          },
            React.createElement(ChartBarIcon, { className: "h-6 w-6" }),
            React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'PTE Score Report')
          ),
          React.createElement('div', null,
            React.createElement('button', { 
                onClick: () => toggleSection('studyGuides'),
                className: `${navLinkClasses(isStudyGuidesActive)} w-full justify-between`
            },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement(BookOpenIcon, { className: "h-6 w-6" }),
                React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'Study Guides')
              ),
              React.createElement(ChevronRightIcon, { className: `h-5 w-5 ${isCollapsed ? 'hidden' : 'hidden sm:inline'} transform transition-transform duration-200 ${expandedSections.studyGuides ? 'rotate-90' : ''}` })
            ),
            !isCollapsed && expandedSections.studyGuides && React.createElement('div', { className: "hidden sm:block mt-1 pl-10 space-y-1" },
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('study-guides', 'speaking-guides'); }, className: subNavLinkClasses(false) }, 
                React.createElement(SpeakingIcon, { className: "h-5 w-5 mr-3 text-gray-400" }),
                'Speaking Guides'
              ),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('study-guides', 'writing-guides'); }, className: subNavLinkClasses(false) }, 
                React.createElement(WritingIcon, { className: "h-5 w-5 mr-3 text-gray-400" }),
                'Writing Guides'
              ),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('study-guides', 'reading-guides'); }, className: subNavLinkClasses(false) }, 
                React.createElement(ReadingIcon, { className: "h-5 w-5 mr-3 text-gray-400" }),
                'Reading Guides'
              ),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('study-guides', 'listening-guides'); }, className: subNavLinkClasses(false) }, 
                React.createElement(ListeningIcon, { className: "h-5 w-5 mr-3 text-gray-400" }),
                'Listening Guides'
              )
            )
          ),
          React.createElement('div', null,
            React.createElement('button', { 
                onClick: () => toggleSection('speaking'),
                className: `${navLinkClasses(isSpeakingActive)} w-full justify-between`
            },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement(SpeakingIcon, { className: "h-6 w-6" }),
                React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'Speaking')
              ),
              React.createElement(ChevronRightIcon, { className: `h-5 w-5 ${isCollapsed ? 'hidden' : 'hidden sm:inline'} transform transition-transform duration-200 ${expandedSections.speaking ? 'rotate-90' : ''}` })
            ),
            !isCollapsed && expandedSections.speaking && React.createElement('div', { className: "hidden sm:block mt-1 pl-10 space-y-1" },
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('read-aloud'); }, className: subNavLinkClasses(currentView === 'read-aloud') }, 'Read Aloud'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('repeat-sentence'); }, className: subNavLinkClasses(currentView === 'repeat-sentence') }, 'Repeat Sentence'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('describe-image'); }, className: subNavLinkClasses(currentView === 'describe-image') }, 'Describe Image'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('retell-lecture'); }, className: subNavLinkClasses(currentView === 'retell-lecture') }, 'Re-tell Lecture'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('answer-short-question'); }, className: subNavLinkClasses(currentView === 'answer-short-question') }, 'Answer Short Question')
            )
          ),
          React.createElement('div', null,
            React.createElement('button', {
                onClick: () => toggleSection('writing'),
                className: `${navLinkClasses(isWritingActive)} w-full justify-between`
            },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement(WritingIcon, { className: "h-6 w-6" }),
                React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'Writing')
              ),
              React.createElement(ChevronRightIcon, { className: `h-5 w-5 ${isCollapsed ? 'hidden' : 'hidden sm:inline'} transform transition-transform duration-200 ${expandedSections.writing ? 'rotate-90' : ''}` })
            ),
            !isCollapsed && expandedSections.writing && React.createElement('div', { className: "hidden sm:block mt-1 pl-10 space-y-1" },
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('summarize-written-text'); }, className: subNavLinkClasses(currentView === 'summarize-written-text') }, 'Summarize Written Text'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('write-essay'); }, className: subNavLinkClasses(currentView === 'write-essay') }, 'Write Essay')
            )
          ),
          React.createElement('div', null,
            React.createElement('button', {
                onClick: () => toggleSection('reading'),
                className: `${navLinkClasses(isReadingActive)} w-full justify-between`
            },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement(ReadingIcon, { className: "h-6 w-6" }),
                React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'Reading')
              ),
              React.createElement(ChevronRightIcon, { className: `h-5 w-5 ${isCollapsed ? 'hidden' : 'hidden sm:inline'} transform transition-transform duration-200 ${expandedSections.reading ? 'rotate-90' : ''}` })
            ),
            !isCollapsed && expandedSections.reading && React.createElement('div', { className: "hidden sm:block mt-1 pl-10 space-y-1" },
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('reading-multiple-choice-single'); }, className: subNavLinkClasses(currentView === 'reading-multiple-choice-single') }, 'Multiple Choice (Single)'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('reading-multiple-choice-multiple'); }, className: subNavLinkClasses(currentView === 'reading-multiple-choice-multiple') }, 'Multiple Choice (Multiple)'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('re-order-paragraphs'); }, className: subNavLinkClasses(currentView === 're-order-paragraphs') }, 'Re-order Paragraphs'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('fill-in-blanks-drag-drop'); }, className: subNavLinkClasses(currentView === 'fill-in-blanks-drag-drop') }, 'Fill in Blanks (Drag & Drop)'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('fill-in-blanks-dropdown'); }, className: subNavLinkClasses(currentView === 'fill-in-blanks-dropdown') }, 'Fill in Blanks (Dropdown)')
            )
          ),
          React.createElement('div', null,
            React.createElement('button', {
                onClick: () => toggleSection('listening'),
                className: `${navLinkClasses(isListeningActive)} w-full justify-between`
            },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement(ListeningIcon, { className: "h-6 w-6" }),
                React.createElement('span', { className: `ml-4 whitespace-nowrap ${isCollapsed ? 'hidden' : 'hidden sm:inline'}` }, 'Listening')
              ),
              React.createElement(ChevronRightIcon, { className: `h-5 w-5 ${isCollapsed ? 'hidden' : 'hidden sm:inline'} transform transition-transform duration-200 ${expandedSections.listening ? 'rotate-90' : ''}` })
            ),
            !isCollapsed && expandedSections.listening && React.createElement('div', { className: "hidden sm:block mt-1 pl-10 space-y-1" },
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('summarize-spoken-text'); }, className: subNavLinkClasses(currentView === 'summarize-spoken-text') }, 'Summarize Spoken Text'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('listening-multiple-choice-multiple'); }, className: subNavLinkClasses(currentView === 'listening-multiple-choice-multiple') }, 'Multiple Choice (Multiple)'),
              React.createElement('a', { href: "#", onClick: (e) => { e.preventDefault(); navigateTo('listening-multiple-choice-single'); }, className: subNavLinkClasses(currentView === 'listening-multiple-choice-single') }, 'Multiple Choice (Single)'),
              React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); navigateTo('highlight-correct-summary'); }, className: subNavLinkClasses(currentView === 'highlight-correct-summary') }, 'Highlight Correct Summary'),
              React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); navigateTo('select-missing-word'); }, className: subNavLinkClasses(currentView === 'select-missing-word') }, 'Select Missing Word'),
              React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); navigateTo('fill-in-blanks-listening'); }, className: subNavLinkClasses(currentView === 'fill-in-blanks-listening') }, 'Fill in the Blanks'),
              React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); navigateTo('highlight-incorrect-words'); }, className: subNavLinkClasses(currentView === 'highlight-incorrect-words') }, 'Highlight Incorrect Words'),
              React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); navigateTo('write-from-dictation'); }, className: subNavLinkClasses(currentView === 'write-from-dictation') }, 'Write From Dictation')
            )
          )
        )
    )
  );
};

export default Sidebar;