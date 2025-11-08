import React, { useState, useEffect, useRef } from 'react';
import { 
    scoreReadAloudAttempt,
    scoreRepeatSentenceAttempt,
    scoreDescribeImageAttempt,
    scoreRetellLectureAttempt,
    scoreAnswerShortQuestionAttempt
} from '../services/geminiService.js';
import { BackIcon, RefreshIcon, PlayCircleIcon } from './icons.js';
import ScoreDisplay from './ScoreDisplay.js';

const decode = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

async function decodeAudioData(data, ctx, sampleRate, numChannels) {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


const AudioPlayer = ({ audioBase64, title, encoding = 'webm' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null); // For both WebM and Web Audio API source
    const contextRef = useRef(null);

    useEffect(() => {
        let url;
        let isActive = true;
        
        const setup = async () => {
             if (!audioBase64) return;
             
             if (encoding === 'pcm') {
                if (!contextRef.current) {
                    contextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
                }
                try {
                    const audioBytes = decode(audioBase64);
                    const buffer = await decodeAudioData(audioBytes, contextRef.current, 24000, 1);
                    if (isActive) {
                         audioRef.current = { buffer: buffer };
                    }
                } catch(e) { console.error("Error setting up PCM audio:", e); }

             } else { // webm
                try {
                    const audioBlob = new Blob([decode(audioBase64)], { type: 'audio/webm' });
                    url = URL.createObjectURL(audioBlob);
                    const audio = new Audio(url);
                    audio.onplay = () => setIsPlaying(true);
                    audio.onended = () => setIsPlaying(false);
                    if (isActive) {
                        audioRef.current = audio;
                    }
                } catch (e) { console.error("Error creating blob URL:", e); }
             }
        };

        setup();

        return () => {
            isActive = false;
            if (url) URL.revokeObjectURL(url);
            if (contextRef.current) contextRef.current.close();
        };
    }, [audioBase64, encoding]);

    const play = () => {
        if (isPlaying || !audioRef.current) return;
        
        if (encoding === 'pcm') {
            const { buffer } = audioRef.current;
            if (contextRef.current && buffer) {
                const source = contextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(contextRef.current.destination);
                source.onended = () => setIsPlaying(false);
                source.start();
                setIsPlaying(true);
            }
        } else {
            audioRef.current.play();
        }
    };

    if (!audioBase64) return null;

    return React.createElement('button', { onClick: play, disabled: isPlaying, className: "flex items-center space-x-2 text-sm px-3 py-1 bg-gray-200 text-gray-800 rounded-full" },
        React.createElement(PlayCircleIcon, { className: 'w-5 h-5' }),
        React.createElement('span', null, isPlaying ? 'Playing...' : title)
    );
};

const QuestionReview = ({ question, userRecording, score, index }) => {
    const { type, data } = question;
    const questionTitle = `${type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} #${index}`;

    const renderOriginalContent = () => {
        switch (type) {
            case 'read-aloud': return React.createElement('p', {className: 'italic'}, `"${data.text}"`);
            case 'repeat-sentence':
            case 'retell-lecture':
            case 'answer-short-question': return React.createElement(AudioPlayer, { audioBase64: data.audioBase64, title: "Play Original", encoding: 'pcm' });
            case 'describe-image': return React.createElement('img', { src: `data:image/png;base64,${data.imageBase64}`, className: 'max-h-40 rounded' });
            default: return null;
        }
    };
    
    const scoreItems = score ? [
        { label: "Content", value: score.content, maxValue: 5 },
        { label: "Pronunciation", value: score.pronunciation, maxValue: 5 },
        { label: "Fluency", value: score.fluency, maxValue: 5 }
    ] : [];

    return React.createElement('div', { className: 'bg-white rounded-xl shadow-md' },
        React.createElement('div', { className: 'p-4 bg-gray-50 border-b flex justify-between items-center' },
            React.createElement('h3', { className: 'font-semibold text-lg' }, questionTitle),
            React.createElement(AudioPlayer, { audioBase64: userRecording, title: "Play Your Response", encoding: 'webm' })
        ),
        React.createElement('div', { className: 'p-6' },
            React.createElement('div', { className: 'mb-4' },
                 React.createElement('h4', { className: 'font-semibold text-sm text-gray-600 mb-2' }, 'Original Content:'),
                 renderOriginalContent()
            ),
             !score 
                ? React.createElement('div', {className: 'flex justify-center items-center'}, React.createElement('div', {className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'}), React.createElement('p', {className: 'ml-3'}, 'Analyzing...'))
                : React.createElement(ScoreDisplay, { scoreItems: scoreItems, feedback: score.feedback })
        )
    );
};

const SpeakingMockTestResults = ({ navigateTo, results }) => {
    const [scores, setScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!results || !results.questions) {
            setIsLoading(false);
            return;
        }

        const scoreAll = async () => {
            const scorePromises = results.questions.map((q, i) => {
                switch(q.type) {
                    case 'read-aloud': return scoreReadAloudAttempt(q.data.text);
                    case 'repeat-sentence': return scoreRepeatSentenceAttempt(q.data.text);
                    case 'describe-image': return scoreDescribeImageAttempt();
                    case 'retell-lecture': return scoreRetellLectureAttempt();
                    case 'answer-short-question': return scoreAnswerShortQuestionAttempt(q.data.answer);
                    default: return Promise.resolve(null);
                }
            });

            const allScores = await Promise.allSettled(scorePromises);
            setScores(allScores.map(res => res.status === 'fulfilled' ? res.value : { error: 'Scoring failed' }));
            setIsLoading(false);
        };
        scoreAll();
    }, [results]);
    
    if (!results) {
         return React.createElement('div', { className: 'text-center p-8' },
            React.createElement('p', null, 'No results available. Please complete a mock test first.'),
            React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg" }, 'Back to Dashboard')
        );
    }

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('h1', { className: 'text-3xl font-bold mb-2' }, 'Speaking Mock Test Results'),
        React.createElement('p', { className: 'text-gray-600 mb-8' }, 'Review your AI-powered scores and feedback.'),

        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-8 mb-8 text-center' },
            React.createElement('h2', { className: 'text-xl font-semibold' }, isLoading ? 'Scoring in Progress...' : 'Review Complete'),
            React.createElement('div', { className: 'flex justify-center gap-4 mt-8' },
                React.createElement('button', { onClick: () => navigateTo('speaking-mock-test-player'), className: 'flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg' }, React.createElement(RefreshIcon, { className: 'w-5 h-5 mr-2' }), 'Try Again'),
                React.createElement('button', { onClick: () => navigateTo('dashboard'), className: 'flex items-center px-6 py-3 bg-gray-200 rounded-lg' }, React.createElement(BackIcon, { className: 'w-5 h-5 mr-2' }), 'Dashboard')
            )
        ),

        React.createElement('div', { className: 'space-y-6' },
            React.createElement('h2', { className: 'text-2xl font-bold' }, 'Answer Review'),
            results.questions.map((q, i) => React.createElement(QuestionReview, {
                key: `${q.type}-${i}`,
                question: q,
                userRecording: results.userRecordings[i],
                score: scores[i],
                index: i + 1
            }))
        )
    );
};

export default SpeakingMockTestResults;