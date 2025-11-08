import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import Dashboard from './components/Dashboard.js';
import ReadAloudPractice from './components/ReadAloudPractice.js';
import RepeatSentencePractice from './components/RepeatSentencePractice.js';
import DescribeImagePractice from './components/DescribeImagePractice.js';
import RetellLecturePractice from './components/RetellLecturePractice.js';
import AnswerShortQuestionPractice from './components/AnswerShortQuestionPractice.js';
import SummarizeWrittenTextPractice from './components/SummarizeWrittenTextPractice.js';
import WriteEssayPractice from './components/WriteEssayPractice.js';
import FillInBlanksDropdownPractice from './components/FillInBlanksDropdownPractice.js';
import ReadingMultipleChoiceMultiplePractice from './components/ReadingMultipleChoiceMultiplePractice.js';
import ReorderParagraphsPractice from './components/ReorderParagraphsPractice.js';
import SummarizeSpokenTextPractice from './components/SummarizeSpokenTextPractice.js';
import ListeningMultipleChoiceMultiplePractice from './components/ListeningMultipleChoiceMultiplePractice.js';
import FillInBlanksListeningPractice from './components/FillInBlanksListeningPractice.js';
import HighlightCorrectSummaryPractice from './components/HighlightCorrectSummaryPractice.js';
import ListeningMultipleChoiceSinglePractice from './components/ListeningMultipleChoiceSinglePractice.js';
import PTEScoreReport from './components/PTEScoreReport.js';
import ReadingMultipleChoiceSinglePractice from './components/ReadingMultipleChoiceSinglePractice.js';
import FillInBlanksDragDropPractice from './components/FillInBlanksDragDropPractice.js';
import SelectMissingWordPractice from './components/SelectMissingWordPractice.js';
import HighlightIncorrectWordsPractice from './components/HighlightIncorrectWordsPractice.js';
import WriteFromDictationPractice from './components/WriteFromDictationPractice.js';
import StudyGuides from './components/StudyGuides.js';
import StudyPlan from './components/StudyPlan.js';
import AILanguageTutorPractice from './components/AILanguageTutorPractice.js';
import AuthPage from './components/AuthPage.js';
import ReadingMockTest from './components/ReadingMockTest.js';
import ReadingMockTestPlayer from './components/ReadingMockTestPlayer.js';
import ReadingMockTestResults from './components/ReadingMockTestResults.js';
import WritingMockTest from './components/WritingMockTest.js';
import WritingMockTestPlayer from './components/WritingMockTestPlayer.js';
import WritingMockTestResults from './components/WritingMockTestResults.js';
import SpeakingMockTest from './components/SpeakingMockTest.js';
import SpeakingMockTestPlayer from './components/SpeakingMockTestPlayer.js';
import SpeakingMockTestResults from './components/SpeakingMockTestResults.js';
import ListeningMockTest from './components/ListeningMockTest.js';
import ListeningMockTestPlayer from './components/ListeningMockTestPlayer.js';
import ListeningMockTestResults from './components/ListeningMockTestResults.js';
import FullMockTestIntro from './components/FullMockTestIntro.js';
import FullMockTestPlayer from './components/FullMockTestPlayer.js';
import FullMockTestResults from './components/FullMockTestResults.js';
import Modal from './components/Modal.js';
import Hero from './components/Hero.js';


const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [readingMockTestResult, setReadingMockTestResult] = useState(null);
  const [writingMockTestResult, setWritingMockTestResult] = useState(null);
  const [speakingMockTestResult, setSpeakingMockTestResult] = useState(null);
  const [listeningMockTestResult, setListeningMockTestResult] = useState(null);
  const [fullMockTestResult, setFullMockTestResult] = useState(null);


  const navigateTo = useCallback((view, anchor = null) => {
    const performScroll = () => {
        if (anchor) {
            const element = document.getElementById(anchor);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.warn(`Anchor element with ID "${anchor}" not found.`);
            }
        }
    };
    
    if (currentView === view) {
        performScroll();
    } else {
        setCurrentView(view);
        setTimeout(performScroll, 100);
    }
  }, [currentView]);

  const handleCloseHero = () => {
    setShowHero(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const toggleSidebar = () => {
      setIsSidebarCollapsed(prev => !prev);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return React.createElement(Dashboard, { navigateTo: navigateTo });
      case 'pte-score-report':
        return React.createElement(PTEScoreReport, { navigateTo: navigateTo });
      case 'study-guides':
        return React.createElement(StudyGuides, { navigateTo: navigateTo });
      case 'study-plan':
        return React.createElement(StudyPlan, { navigateTo: navigateTo });
      case 'ai-language-tutor':
        return React.createElement(AILanguageTutorPractice, { currentUser: currentUser });
      case 'read-aloud':
        return React.createElement(ReadAloudPractice, { navigateTo: navigateTo });
      case 'repeat-sentence':
        return React.createElement(RepeatSentencePractice, { navigateTo: navigateTo });
      case 'describe-image':
        return React.createElement(DescribeImagePractice, { navigateTo: navigateTo });
      case 'retell-lecture':
        return React.createElement(RetellLecturePractice, { navigateTo: navigateTo });
      case 'answer-short-question':
        return React.createElement(AnswerShortQuestionPractice, { navigateTo: navigateTo });
      case 'summarize-written-text':
        return React.createElement(SummarizeWrittenTextPractice, { navigateTo: navigateTo });
      case 'write-essay':
        return React.createElement(WriteEssayPractice, { navigateTo: navigateTo });
      case 'fill-in-blanks-dropdown':
        return React.createElement(FillInBlanksDropdownPractice, { navigateTo: navigateTo });
      case 'reading-multiple-choice-multiple':
        return React.createElement(ReadingMultipleChoiceMultiplePractice, { navigateTo: navigateTo });
      case 're-order-paragraphs':
        return React.createElement(ReorderParagraphsPractice, { navigateTo: navigateTo });
      case 'summarize-spoken-text':
        return React.createElement(SummarizeSpokenTextPractice, { navigateTo: navigateTo });
      case 'listening-multiple-choice-multiple':
        return React.createElement(ListeningMultipleChoiceMultiplePractice, { navigateTo: navigateTo });
      case 'listening-multiple-choice-single':
        return React.createElement(ListeningMultipleChoiceSinglePractice, { navigateTo: navigateTo });
      case 'fill-in-blanks-listening':
        return React.createElement(FillInBlanksListeningPractice, { navigateTo: navigateTo });
      case 'highlight-correct-summary':
        return React.createElement(HighlightCorrectSummaryPractice, { navigateTo: navigateTo });
      case 'reading-multiple-choice-single':
        return React.createElement(ReadingMultipleChoiceSinglePractice, { navigateTo: navigateTo });
      case 'fill-in-blanks-drag-drop':
        return React.createElement(FillInBlanksDragDropPractice, { navigateTo: navigateTo });
      case 'select-missing-word':
        return React.createElement(SelectMissingWordPractice, { navigateTo: navigateTo });
      case 'highlight-incorrect-words':
        return React.createElement(HighlightIncorrectWordsPractice, { navigateTo: navigateTo });
      case 'write-from-dictation':
        return React.createElement(WriteFromDictationPractice, { navigateTo: navigateTo });
      case 'reading-mock-test':
        return React.createElement(ReadingMockTest, { navigateTo: navigateTo });
       case 'speaking-mock-test':
        return React.createElement(SpeakingMockTest, { navigateTo: navigateTo });
      case 'writing-mock-test':
        return React.createElement(WritingMockTest, { navigateTo: navigateTo });
      case 'listening-mock-test':
        return React.createElement(ListeningMockTest, { navigateTo: navigateTo });
      case 'reading-mock-test-player':
        return React.createElement(ReadingMockTestPlayer, { navigateTo: navigateTo, setMockTestResult: setReadingMockTestResult });
      case 'reading-mock-test-results':
        return React.createElement(ReadingMockTestResults, { navigateTo: navigateTo, results: readingMockTestResult });
      case 'writing-mock-test-player':
        return React.createElement(WritingMockTestPlayer, { navigateTo: navigateTo, setMockTestResult: setWritingMockTestResult });
      case 'writing-mock-test-results':
        return React.createElement(WritingMockTestResults, { navigateTo: navigateTo, results: writingMockTestResult });
      case 'speaking-mock-test-player':
        return React.createElement(SpeakingMockTestPlayer, { navigateTo: navigateTo, setMockTestResult: setSpeakingMockTestResult });
      case 'speaking-mock-test-results':
        return React.createElement(SpeakingMockTestResults, { navigateTo: navigateTo, results: speakingMockTestResult });
      case 'listening-mock-test-player':
        return React.createElement(ListeningMockTestPlayer, { navigateTo: navigateTo, setMockTestResult: setListeningMockTestResult });
      case 'listening-mock-test-results':
        return React.createElement(ListeningMockTestResults, { navigateTo: navigateTo, results: listeningMockTestResult });
      case 'full-mock-test-intro':
        return React.createElement(FullMockTestIntro, { navigateTo: navigateTo });
      case 'full-mock-test-player':
        return React.createElement(FullMockTestPlayer, { navigateTo: navigateTo, setMockTestResult: setFullMockTestResult });
      case 'full-mock-test-results':
        return React.createElement(FullMockTestResults, { navigateTo: navigateTo, results: fullMockTestResult });
      default:
        return React.createElement(Dashboard, { navigateTo: navigateTo });
    }
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col min-h-screen' },
    showHero && React.createElement(Hero, { onPracticeNow: handleCloseHero, onClose: handleCloseHero, onLoginClick: handleLoginClick }),
    React.createElement(Modal, {
        isOpen: isLoginModalOpen,
        onClose: () => setIsLoginModalOpen(false),
        title: "Login to Track Your Progress"
    }, React.createElement(AuthPage, { onLoginSuccess: handleLoginSuccess, isModal: true })),
    React.createElement(Header, {
        navigateTo: navigateTo,
        isAuthenticated: isAuthenticated,
        onLoginClick: handleLoginClick,
        onLogout: handleLogout
    }),
    React.createElement('div', {className: 'flex flex-1 overflow-hidden' },
      React.createElement(Sidebar, { navigateTo: navigateTo, currentView: currentView, isCollapsed: isSidebarCollapsed, toggleCollapse: toggleSidebar }),
      React.createElement(
        'main',
        { className: 'flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto' },
        renderContent()
      )
    ),
    React.createElement(Footer, null)
  );
};

export default App;