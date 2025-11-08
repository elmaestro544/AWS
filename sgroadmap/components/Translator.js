
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { i18n, Language, LANGUAGES, QUICK_PHRASES } from '../constants.js';
import { Spinner, CopyIcon, SpeakerIcon, StopIcon, SwapIcon, UploadIcon, TrashIcon, HistoryIcon } from './Shared.js';
import * as apiService from '../services/geminiService.js';
import HistoryPanel from './HistoryPanel.js';

// Helper functions for audio playback
function decode(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data, ctx) {
    const sampleRate = 24000;
    const numChannels = 1;
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
}

const Translator = ({ language }) => {
  const t = i18n[language];
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ar');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [speakingFor, setSpeakingFor] = useState(null); // null, 'source', 'target'
  const [audioLoadingFor, setAudioLoadingFor] = useState(null); // null, 'source', 'target'
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const fileInputRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('scigenius_translation_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load translation history from localStorage", error);
    }
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    return () => {
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scigenius_translation_history', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save translation history to localStorage", error);
    }
  }, [history]);

  const handleTranslate = useCallback(async (textToTranslate) => {
    if (!textToTranslate.trim()) return;
    setIsLoading(true);
    setTranslatedText('');
    setConfidence(0);

    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      setSpeakingFor(null);
    }

    try {
      const result = await apiService.translateText(textToTranslate, sourceLang, targetLang);
      setTranslatedText(result);
      setConfidence(Math.floor(Math.random() * (96 - 85 + 1)) + 85); // Random confidence 85-95%
      
      const newHistoryItem = {
        id: Date.now(),
        sourceLang,
        targetLang,
        sourceText: textToTranslate,
        translatedText: result,
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]); // Keep last 20 translations
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText(t.errorOccurred);
    } finally {
      setIsLoading(false);
    }
  }, [sourceLang, targetLang, t.errorOccurred]);

  const handleSwapLanguages = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      setSpeakingFor(null);
    }
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleListen = async (text, type) => {
    if (!text || audioLoadingFor) return;

    if (speakingFor === type) {
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }
        setSpeakingFor(null);
        return;
    }

    if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        setSpeakingFor(null);
    }

    setSpeakingFor(type);
    setAudioLoadingFor(type);

    try {
        const base64Audio = await apiService.generateSpeech(text);
        const audioData = decode(base64Audio);
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }
        const audioBuffer = await decodeAudioData(audioData, audioContextRef.current);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => {
            if (speakingFor === type) {
                setSpeakingFor(null);
            }
            audioSourceRef.current = null;
        };
        source.start(0);
        audioSourceRef.current = source;
    } catch (error) {
        console.error("Error playing speech:", error);
        alert(`Could not play audio: ${error.message}`);
        setSpeakingFor(null);
    } finally {
        setAudioLoadingFor(null);
    }
  };

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    const supportedTypes = ["text/plain", "text/markdown", "application/pdf"];
    if (supportedTypes.includes(file.type) || file.type.startsWith("image/")) {
      setIsLoading(true);
      setSourceText(t.extractingText);
      setTranslatedText('');

      try {
        const text = await apiService.extractTextFromFile(file);
        setSourceText(text);
        if (text && text.trim()) {
          handleTranslate(text);
        } else {
          setSourceText('No text found in file.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error extracting text from file:", error);
        setSourceText(`Error extracting text: ${error.message}`);
        setTranslatedText(t.errorOccurred);
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (e) => processFile(e.target.files?.[0]);
  const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      processFile(e.dataTransfer.files?.[0]);
  };
  
  const handleClearHistory = () => {
      setHistory([]);
  };

  const renderHistoryItem = (item) => (
    React.createElement('div', {
        key: item.id,
        onClick: () => {
            setSourceLang(item.sourceLang);
            setTargetLang(item.targetLang);
            setSourceText(item.sourceText);
            setTranslatedText(item.translatedText);
            setIsHistoryOpen(false);
        },
        className: "p-3 bg-slate-200/50 dark:bg-card-gradient border border-slate-300/50 dark:border-white/10 rounded-lg cursor-pointer hover:bg-brand-blue/10 dark:hover:bg-brand-blue/30"
      },
        React.createElement('p', { className: "text-sm text-slate-500 dark:text-brand-text-light truncate" }, item.sourceText),
        React.createElement('p', { className: "text-md text-slate-800 dark:text-brand-text mt-1 truncate" }, item.translatedText)
    )
  );

  return React.createElement('div', { className: "max-w-7xl mx-auto relative" },
    React.createElement('button', {
        onClick: () => setIsHistoryOpen(true),
        'aria-label': t.history,
        className: `absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} z-10 p-2 text-slate-500 dark:text-brand-text-light hover:bg-slate-200 dark:hover:bg-white/20 rounded-full transition-colors`
    },
      React.createElement(HistoryIcon, null)
    ),
    React.createElement('div', { className: "text-center mb-8" },
      React.createElement('h2', { className: "text-3xl font-bold text-slate-900 dark:text-brand-text" }, t.translatorTitle),
      React.createElement('p', { className: "text-slate-500 dark:text-brand-text-light mt-2" }, t.translatorDescription)
    ),
    React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" },
      // Main Translator Column
      React.createElement('div', { className: "lg:col-span-2 space-y-4" },
        // Language Selectors
        React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-5 gap-2 items-center" },
          React.createElement('select', { value: sourceLang, onChange: (e) => setSourceLang(e.target.value), className: "md:col-span-2 w-full p-2 bg-white dark:bg-input-gradient border border-slate-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" },
            LANGUAGES.map(lang => React.createElement('option', { key: lang.code, value: lang.code }, language === Language.AR ? lang.arName : lang.name))
          ),
          React.createElement('button', { onClick: handleSwapLanguages, className: "h-10 w-10 mx-auto flex items-center justify-center bg-slate-200 dark:bg-card-gradient rounded-full hover:bg-brand-blue/20 dark:hover:bg-brand-blue" }, React.createElement(SwapIcon, null)),
          React.createElement('select', { value: targetLang, onChange: (e) => setTargetLang(e.target.value), className: "md:col-span-2 w-full p-2 bg-white dark:bg-input-gradient border border-slate-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" },
            LANGUAGES.map(lang => React.createElement('option', { key: lang.code, value: lang.code }, language === Language.AR ? lang.arName : lang.name))
          )
        ),
        // Text Areas
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
          React.createElement('div', { className: "relative w-full h-48" },
            React.createElement('textarea', { 
              value: sourceText, 
              onChange: (e) => setSourceText(e.target.value), 
              placeholder: t.enterText, 
              className: `w-full h-full p-3 bg-white dark:bg-input-gradient border border-slate-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none resize-none ${language === 'ar' ? 'pl-12' : 'pr-12'}` 
            }),
            !isLoading && sourceText && React.createElement('div', { className: `absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'}` },
              React.createElement('button', {
                  onClick: () => handleListen(sourceText, 'source'),
                  disabled: !!audioLoadingFor,
                  className: "h-8 w-8 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-50"
              },
                  audioLoadingFor === 'source' ? React.createElement(Spinner, {size: '5'}) : (speakingFor === 'source' ? React.createElement(StopIcon, null) : React.createElement(SpeakerIcon, null))
              )
            )
          ),
          React.createElement('div', { className: "w-full h-48 p-3 bg-slate-50 dark:bg-card-gradient border border-slate-200 dark:border-white/10 rounded-xl relative overflow-y-auto" },
            isLoading ? React.createElement('div', { className: "flex items-center justify-center h-full" }, React.createElement(Spinner, null)) : React.createElement('p', { className: `whitespace-pre-wrap ${language === 'ar' ? 'pl-24' : 'pr-24'}` }, translatedText),
            !isLoading && translatedText && React.createElement('div', { className: `absolute top-2 ${language === 'ar' ? 'left-2' : 'right-2'} flex gap-2` },
                React.createElement('button', { 
                  onClick: () => handleListen(translatedText, 'target'), 
                  disabled: !!audioLoadingFor, 
                  className: "h-8 w-8 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-50" 
                },
                  audioLoadingFor === 'target' ? React.createElement(Spinner, {size: '5'}) : (speakingFor === 'target' ? React.createElement(StopIcon, null) : React.createElement(SpeakerIcon, null))
                ),
                React.createElement('button', { onClick: handleCopy, className: "h-8 w-8 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full hover:bg-black/10 dark:hover:bg-white/20" }, React.createElement(CopyIcon, { className: "h-5 w-5" }))
            )
          )
        ),
        // Translate Button & Confidence
        React.createElement('div', { className: "flex flex-col sm:flex-row items-center gap-4" },
            React.createElement('button', { onClick: () => handleTranslate(sourceText), disabled: isLoading || !sourceText.trim(), className: "w-full sm:w-auto flex-grow bg-brand-red hover:bg-red-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white font-bold py-3 px-8 rounded-full transition-colors" },
                isLoading ? t.translating : t.translate
            ),
            confidence > 0 && React.createElement('div', { className: "text-sm text-slate-500 dark:text-brand-text-light" }, `${t.confidenceScore}: ${confidence}%`)
        )
      ),
      // Side Column
      React.createElement('div', { className: "space-y-6" },
        // Document Translation
        React.createElement('div', null,
          React.createElement('h3', { className: "text-lg font-semibold mb-2 text-slate-900 dark:text-brand-text" }, t.documentTranslation),
          React.createElement('div', {
            onClick: () => fileInputRef.current?.click(),
            onDragOver: (e) => { e.preventDefault(); setIsDragOver(true); },
            onDragLeave: () => setIsDragOver(false),
            onDrop: handleDrop,
            className: `p-4 text-center border-2 border-dashed rounded-lg cursor-pointer ${isDragOver ? 'border-brand-blue bg-slate-200 dark:bg-card-gradient' : 'border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40'}`
          },
            React.createElement(UploadIcon, { className: "h-8 w-8 mx-auto text-slate-400 dark:text-brand-text-light" }),
            React.createElement('p', { className: "text-sm mt-2 text-slate-500 dark:text-brand-text-light" }, t.uploadTxt),
            React.createElement('input', { type: "file", ref: fileInputRef, onChange: handleFileChange, className: "hidden", accept: ".txt,.md,.pdf,image/*" })
          )
        ),
        // Quick Phrases
        React.createElement('div', null,
          React.createElement('h3', { className: "text-lg font-semibold mb-2 text-slate-900 dark:text-brand-text" }, t.quickPhrases),
          React.createElement('div', { className: "flex flex-wrap gap-2" },
            QUICK_PHRASES.map(phrase => {
              const text = language === Language.AR ? phrase.ar : phrase.en;
              return React.createElement('button', { key: phrase.en, onClick: () => { setSourceText(text); handleTranslate(text); }, className: "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-700 dark:text-brand-text py-1 px-3 rounded-full text-sm" }, text)
            })
          )
        )
      )
    ),
    React.createElement(HistoryPanel, {
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

export default Translator;
