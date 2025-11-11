

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { i18n } from '../constants.js';
import * as apiService from '../services/geminiService.js';
import * as historyService from '../services/historyService.js';
import { Spinner, SendIcon, AttachIcon, CloseIcon, HistoryIcon } from './Shared.js';
import HistoryPanel from './HistoryPanel.js';


const AiAssistant = ({ language, currentUser }) => {
  const t = i18n[language];
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const SERVICE_ID = 'assistant';
  
  const isGeminiConfigured = apiService.isModelConfigured('gemini');

  useEffect(() => {
    setChat(apiService.createChatSession());
    setMessages([{
        sender: 'model',
        text: t.assistantDescription,
    }]);
  }, [t.assistantDescription]);

  useEffect(() => {
    if (currentUser) {
      setHistory(historyService.getHistory(currentUser.email, SERVICE_ID));
    }
  }, [currentUser]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
    }
  };

  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading) return;
    
    const userMessage = { sender: 'user', text: messageText };
    if (file) {
        userMessage.file = file.name;
    }
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    const currentFile = file;
    setFile(null); 
    setIsLoading(true);

    try {
      const result = await apiService.sendChatMessage(chat, messageText, currentFile, useWebSearch);

      if (result.isStream) {
        let responseText = '';
        setMessages(prev => [...prev, { sender: 'model', text: '' }]);
        for await (const chunk of result.stream) {
          responseText += chunk.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = responseText;
            return newMessages;
          });
        }
        if (currentUser) {
            const historyItem = { user: messageText, model: responseText, file: currentFile ? currentFile.name : null, sources: [] };
            historyService.addHistoryItem(currentUser.email, SERVICE_ID, historyItem);
            setHistory(historyService.getHistory(currentUser.email, SERVICE_ID));
        }
      } else {
        const modelMessage = { sender: 'model', text: result.text, sources: result.sources };
        setMessages(prev => [...prev, modelMessage]);
        if (currentUser) {
            const historyItem = { user: messageText, model: result.text, file: currentFile ? currentFile.name : null, sources: result.sources };
            historyService.addHistoryItem(currentUser.email, SERVICE_ID, historyItem);
            setHistory(historyService.getHistory(currentUser.email, SERVICE_ID));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: 'model', text: t.errorOccurred }]);
    } finally {
      setIsLoading(false);
    }
  }, [chat, file, useWebSearch, isLoading, t.errorOccurred, currentUser]);

  const handleHistoryItemClick = (item) => {
      setChat(apiService.createChatSession());
      const newMessages = [
        { sender: 'user', text: item.user, file: item.file },
        { sender: 'model', text: item.model, sources: item.sources }
      ];
      setMessages(newMessages);
      setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    if (currentUser) {
        setHistory(historyService.clearHistory(currentUser.email, SERVICE_ID));
    }
  };

  const renderHistoryItem = (item) => (
    React.createElement('div', {
        key: item.id,
        onClick: () => handleHistoryItemClick(item),
        className: "p-3 bg-dark-card-solid border border-dark-border rounded-lg cursor-pointer hover:bg-white/10"
      },
        React.createElement('p', { className: "text-sm font-semibold text-brand-text truncate" }, item.user),
        React.createElement('p', { className: "text-xs text-brand-text-light mt-1 truncate" }, item.model)
    )
  );

  return React.createElement('div', { className: "h-full flex flex-col relative" },
    currentUser && React.createElement('button', {
        onClick: () => setIsHistoryOpen(true),
        'aria-label': t.history,
        className: `absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} z-10 p-2 text-brand-text-light hover:bg-white/20 rounded-full transition-colors`
    },
      React.createElement(HistoryIcon, null)
    ),
    React.createElement('div', { className: "text-center mb-6 pt-4" },
      React.createElement('h2', { className: "text-2xl font-bold text-brand-text" }, t.assistantTitle)
    ),
    React.createElement('div', { className: "flex flex-col flex-grow bg-dark-card backdrop-blur-xl rounded-2xl overflow-hidden glow-border" },
        React.createElement('div', { ref: chatContainerRef, className: "flex-grow p-4 space-y-4 overflow-y-auto" },
            messages.map((msg, index) => (
            React.createElement('div', { key: index, className: `flex ${msg.sender === 'user' ? (language === 'ar' ? 'justify-start' : 'justify-end') : (language === 'ar' ? 'justify-end' : 'justify-start')}` },
                React.createElement('div', { className: `relative max-w-xl p-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-brand-purple text-white' : 'bg-dark-card-solid text-brand-text'}` },
                msg.file && React.createElement('div', {className: "text-xs italic opacity-80 mb-1 border-b border-white/20 pb-1"}, `Attached: ${msg.file}`),
                React.createElement('p', { className: `whitespace-pre-wrap` }, msg.text),
                msg.sources && msg.sources.length > 0 && (
                    React.createElement('div', { className: "mt-3 pt-2 border-t border-white/20" },
                    React.createElement('h4', { className: "font-semibold text-sm mb-1" }, t.sources),
                    React.createElement('div', { className: "flex flex-wrap gap-2" },
                        msg.sources.map((source, i) => (
                        React.createElement('a', { key: i, href: source.web?.uri, target: "_blank", rel: "noopener noreferrer", className: "text-xs bg-white/10 hover:bg-white/20 py-1 px-2 rounded-full transition-colors truncate" },
                            source.web?.title || new URL(source.web?.uri || '').hostname
                        )
                        ))
                    )
                    )
                )
                )
            )
            )),
            isLoading && (
            React.createElement('div', { className: "flex justify-start p-4" },
                React.createElement('div', { className: "bg-dark-card-solid p-3 rounded-2xl flex items-center space-x-2" },
                React.createElement(Spinner, { size: "5" }),
                React.createElement('span', { className: "text-brand-text-light" }, t.thinking)
                )
            )
            )
        ),
        React.createElement('div', { className: "p-4 border-t border-dark-border bg-dark-card-solid/50" },
            !isGeminiConfigured && React.createElement('div', { className: "text-center bg-red-500/10 p-2 rounded-md mb-2 text-xs text-red-400 font-semibold" },
                "Gemini API Key is not configured."
            ),
            file && React.createElement('div', { className: "flex items-center justify-between bg-black/20 text-sm py-1 px-3 rounded-md mb-2" },
                React.createElement('span', { className: "truncate" }, file.name),
                React.createElement('button', { onClick: () => setFile(null) }, React.createElement(CloseIcon, { className: "h-4 w-4" }))
            ),
            React.createElement(React.Fragment, null,
                React.createElement('div', { className: `relative flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}` },
                    React.createElement('textarea', {
                        value: userInput, onChange: (e) => setUserInput(e.target.value),
                        onKeyDown: (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(userInput);
                            }
                        }, 
                        placeholder: "Ask about project status...",
                        rows: 1,
                        className: "w-full bg-dark-bg border border-dark-border rounded-full py-2.5 resize-none focus:ring-2 focus:ring-brand-purple focus:outline-none transition-all shadow-inner placeholder-slate-500 text-white",
                        style: language === 'ar' ? { paddingLeft: '3.5rem', paddingRight: '1rem' } : { paddingLeft: '1rem', paddingRight: '3.5rem' },
                        disabled: isLoading || !isGeminiConfigured
                    }),
                    React.createElement('button', {
                        onClick: () => handleSendMessage(userInput), disabled: !userInput.trim() || isLoading || !isGeminiConfigured,
                        className: `absolute h-8 w-8 rounded-full flex items-center justify-center bg-button-gradient hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all ${language === 'ar' ? 'left-2' : 'right-2'}`
                    }, React.createElement(SendIcon, { className: "h-5 w-5 text-white" }))
                ),
                React.createElement('div', { className: `flex items-center justify-between mt-2 px-2 ${language === 'ar' ? 'flex-row-reverse' : ''}` },
                    React.createElement('button', { onClick: () => fileInputRef.current?.click(), className: "flex items-center gap-2 text-sm text-brand-text-light hover:text-white transition-colors"},
                        React.createElement(AttachIcon, { className: "h-5 w-5"}), t.attachFile
                    ),
                    React.createElement('input', { type: "file", ref: fileInputRef, onChange: handleFileChange, className: "hidden" }),
                    React.createElement('div', { className: 'flex items-center gap-2' },
                        React.createElement('label', { htmlFor: "web-search", className: 'text-sm text-brand-text-light cursor-pointer' }, t.searchWeb),
                        React.createElement('input', { type: "checkbox", id: "web-search", checked: useWebSearch, onChange: (e) => setUseWebSearch(e.target.checked),
                            className: "w-4 h-4 rounded text-brand-purple bg-dark-card-solid border-dark-border focus:ring-brand-purple"
                        })
                    )
                )
            )
        )
    ),
    currentUser && React.createElement(HistoryPanel, {
        isOpen: isHistoryOpen,
        onClose: () => setIsHistoryOpen(false),
        title: t.history,
        items: history,
        renderItem: renderHistoryItem,
        onClear: handleClearHistory,
        language: language
    })
  );
};

export default AiAssistant;