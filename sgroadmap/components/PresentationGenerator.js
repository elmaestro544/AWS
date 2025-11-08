import React, { useState, useRef, useEffect } from 'react';
import { i18n, PRESENTATION_TEMPLATES } from '../constants.js';
import { Spinner, UploadIcon, PencilIcon, ClipboardTextIcon, FileImportIcon, DownloadIcon, PresentationIcon, SpeakerIcon, StopIcon } from './Shared.js';
import * as apiService from '../services/geminiService.js';

// --- Audio Helper functions ---
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


// --- Extracted Components ---

const StepCard = ({ title, children, isEnabled }) => {
    return React.createElement('div', { className: `border border-slate-200 dark:border-white/10 rounded-lg ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}` },
        React.createElement('div', {
            className: `w-full flex items-center p-4 text-left font-semibold bg-slate-100 dark:bg-brand-blue text-brand-red rounded-t-lg`
        },
            title
        ),
        React.createElement('div', { className: "p-4" }, children)
    );
};

const OutlinePreview = ({ outline, t }) => {
    if (outline.error) return React.createElement('p', { className: 'text-brand-red' }, outline.error);
    return React.createElement('div', { className: "space-y-3" },
        React.createElement('h3', { className: 'text-xl font-bold text-center mb-4' }, 'Presentation Outline'),
        outline.slides?.map(slide => React.createElement('div', { key: slide.slideNumber, className: "slide-preview-item p-4 bg-white dark:bg-card-gradient rounded-lg border border-slate-200 dark:border-white/10 min-h-[450px]" },
            React.createElement('h4', { className: "font-bold text-brand-red" }, `Slide ${slide.slideNumber}: ${slide.title}`),
            React.createElement('p', { className: "text-xs uppercase text-slate-400 dark:text-brand-text-light my-1" }, `Type: ${slide.type}`),
            React.createElement('table', { className: "w-full mt-2 text-sm" },
                React.createElement('tbody', null,
                    slide.content.map((point, i) => React.createElement('tr', { key: i, className: "border-b border-slate-200 dark:border-white/10 last:border-b-0" },
                        React.createElement('td', { className: "py-1.5 pr-2 text-brand-red" }, '•'),
                        React.createElement('td', { className: "py-1.5 text-slate-700 dark:text-brand-text-light" }, point)
                    ))
                )
            )
        ))
    );
};

const FinalPresentationPreview = ({ presentation, onListen, speakingSlideIndex, audioLoadingSlideIndex, t }) => {
    if (presentation.error) return React.createElement('p', { className: 'text-brand-red' }, presentation.error);
    
    const VisualSuggestionIcon = () => React.createElement('svg', { 
        xmlns: "http://www.w3.org/2000/svg", 
        fill: "none", 
        viewBox: "0 0 24 24", 
        stroke: "currentColor", 
        strokeWidth: 2,
        width: 24,
        height: 24
    },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" })
    );

    const renderContentBlock = (block, index) => {
        switch (block.type) {
            case 'paragraph':
                return React.createElement('p', { key: index, className: "text-xl" }, block.text);
            case 'bullet':
                return React.createElement('div', { key: index, className: "flex items-start" },
                    React.createElement('span', { className: "mr-3 mt-1.5 text-brand-red flex-shrink-0 text-xl" }, '•'),
                    React.createElement('p', { className: 'text-xl' }, block.text)
                );
            case 'table':
                return React.createElement('table', { key: index, className: "w-full my-2 text-sm border-collapse" },
                    React.createElement('thead', null,
                        React.createElement('tr', null,
                            block.headers.map((header, hIndex) => React.createElement('th', { key: hIndex, className: "p-2 border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-brand-blue text-left" }, header))
                        )
                    ),
                    React.createElement('tbody', null,
                        block.rows.map((row, rIndex) => React.createElement('tr', { key: rIndex, className: "bg-white dark:bg-card-gradient" },
                            row.map((cell, cIndex) => React.createElement('td', { key: cIndex, className: "p-2 border border-slate-200 dark:border-white/10" }, cell))
                        ))
                    )
                );
            case 'visual_suggestion':
                return React.createElement('div', { key: index, className: "my-2 p-3 flex items-center bg-blue-500/10 dark:bg-blue-500/20 rounded-lg text-base text-blue-800 dark:text-blue-300" },
                    React.createElement('div', { className: 'flex-shrink-0 mr-3' }, React.createElement(VisualSuggestionIcon, null)),
                    React.createElement('p', null, React.createElement('strong', null, "Visual Idea: "), block.description)
                );
            case 'infographic_point':
                return React.createElement('div', { key: index, className: "my-2 p-3 text-center bg-slate-100 dark:bg-brand-blue rounded-lg" },
                    React.createElement('p', { className: "text-sm uppercase text-slate-500 dark:text-brand-text-light" }, block.title),
                    React.createElement('p', { className: "text-4xl font-bold text-brand-red my-1" }, block.value),
                    React.createElement('p', { className: "text-sm text-slate-600 dark:text-brand-text" }, block.description)
                );
            default:
                 return React.createElement('div', { key: index, className: "flex items-start" },
                    React.createElement('span', { className: "mr-3 mt-1.5 text-brand-red flex-shrink-0 text-xl" }, '•'),
                    React.createElement('p', { className: 'text-xl' }, block.text || JSON.stringify(block))
                );
        }
    };

    return React.createElement('div', { className: "space-y-4" },
        presentation.slides?.map(slide => {
            const isTitleSlide = slide.type === 'title_slide';

            if (isTitleSlide) {
                const textBlocks = Array.isArray(slide.content)
                    ? slide.content.filter(block => block && (typeof block === 'string' || typeof block.text === 'string'))
                    : [];

                const subtitleText = textBlocks.length > 0
                    ? (typeof textBlocks[0] === 'string' ? textBlocks[0] : textBlocks[0].text)
                    : null;
                
                const detailsTexts = textBlocks.length > 1
                    ? textBlocks.slice(1).map(block => typeof block === 'string' ? block : block.text)
                    : [];

                return React.createElement('div', { 
                    key: slide.slideNumber, 
                    className: "relative slide-preview-item p-6 sm:p-8 bg-white dark:bg-card-gradient rounded-lg shadow-lg min-h-[500px] flex flex-col text-center" 
                },
                    React.createElement('div', { className: 'flex-grow flex flex-col justify-center items-center' },
                        React.createElement('h3', { className: 'text-6xl lg:text-7xl font-bold text-brand-red mb-4' }, slide.title),
                        subtitleText && React.createElement('p', { className: 'text-4xl text-slate-700 dark:text-brand-text-light mt-2' }, subtitleText)
                    ),
                    detailsTexts.length > 0 && React.createElement('div', { className: 'flex-shrink-0 pb-4' },
                        detailsTexts.map((detailText, index) =>
                            React.createElement('p', { key: index, className: 'text-2xl text-slate-500 dark:text-brand-text-light' }, detailText)
                        )
                    )
                );
            }

            // Regular slide rendering
            return React.createElement('div', { key: slide.slideNumber, className: "relative slide-preview-item p-6 sm:p-8 bg-white dark:bg-card-gradient rounded-lg shadow-lg min-h-[500px] flex flex-col justify-center" },
                slide.speakerNotes && React.createElement('button', {
                    onClick: () => onListen(slide.speakerNotes, slide.slideNumber),
                    disabled: audioLoadingSlideIndex !== null,
                    title: t.presentationListenNotes,
                    className: "absolute top-4 right-4 h-9 w-9 flex items-center justify-center bg-slate-200 dark:bg-white/10 rounded-full hover:bg-slate-300 dark:hover:bg-white/20 disabled:opacity-50 z-10"
                },
                    audioLoadingSlideIndex === slide.slideNumber ? React.createElement(Spinner, { size: '5' }) :
                    speakingSlideIndex === slide.slideNumber ? React.createElement(StopIcon, null) :
                    React.createElement(SpeakerIcon, null)
                ),
                React.createElement('h3', { className: `text-3xl lg:text-4xl font-bold text-brand-red mb-6 text-center` }, slide.title),
                React.createElement('div', { className: "text-slate-700 dark:text-brand-text-light space-y-4 px-4" },
                    Array.isArray(slide.content) ?
                        slide.content.map((block, index) => {
                            if (typeof block === 'object' && block.type) {
                                return renderContentBlock(block, index);
                            }
                            if (typeof block === 'string') {
                                return renderContentBlock({ type: 'bullet', text: block }, index);
                            }
                            return null;
                        })
                    : (typeof slide.content === 'string' ? React.createElement('p', null, slide.content) : null)
                )
            );
        })
    );
};

const PreviewPanel = React.forwardRef(({ generatedOutline, finalPresentation, t, onListen, speakingSlideIndex, audioLoadingSlideIndex }, ref) => (
    React.createElement('div', { ref: ref, id: 'presentation-preview', className: "h-full bg-slate-200/50 dark:bg-brand-dark rounded-xl border border-slate-200 dark:border-white/10 p-4 overflow-y-auto" },
        !generatedOutline && !finalPresentation && React.createElement('div', { className: "flex flex-col h-full items-center justify-center text-center text-slate-500 dark:text-brand-text-light" }, 
            React.createElement(PresentationIcon, {}),
            React.createElement('p', { className: "mt-2 font-semibold" }, t.preview),
            React.createElement('p', { className: "text-sm" }, t.previewPlaceholder)
        ),
        generatedOutline && !finalPresentation && React.createElement(OutlinePreview, { outline: generatedOutline, t: t }),
        finalPresentation && React.createElement(FinalPresentationPreview, { 
            presentation: finalPresentation, 
            onListen: onListen,
            speakingSlideIndex: speakingSlideIndex,
            audioLoadingSlideIndex: audioLoadingSlideIndex,
            t: t
        })
    )
));

// --- Main Component ---

const PresentationGenerator = ({ language, theme }) => {
    const t = i18n[language];
    
    // State for workflow & data
    const [creationMethod, setCreationMethod] = useState('prompt');
    const [userInput, setUserInput] = useState({ prompt: '', text: '', file: null });
    const [slideCount, setSlideCount] = useState(10);
    const [generatedOutline, setGeneratedOutline] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(PRESENTATION_TEMPLATES[0]);
    const [finalPresentation, setFinalPresentation] = useState(null);
    
    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

    // Audio State
    const [speakingSlideIndex, setSpeakingSlideIndex] = useState(null);
    const [audioLoadingSlideIndex, setAudioLoadingSlideIndex] = useState(null);
    
    const fileInputRef = useRef(null);
    const previewRef = useRef(null);
    const audioContextRef = useRef(null);
    const audioSourceRef = useRef(null);
    
    useEffect(() => {
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

    // --- Core Logic ---

    const processFile = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) return resolve('');
            const reader = new FileReader();
            reader.onerror = reject;
            if (file.type === 'application/pdf') {
                reader.onload = async (e) => {
                    try {
                        const typedarray = new Uint8Array(e.target.result);
                        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
                        let text = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            text += content.items.map(item => item.str).join(' ');
                        }
                        resolve(text);
                    } catch (error) { reject(error); }
                };
                reader.readAsArrayBuffer(file);
            } else { // txt, md
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsText(file);
            }
        });
    };

    const handleGenerateOutline = async () => {
        let content = '';
        if (creationMethod === 'prompt') content = userInput.prompt;
        else if (creationMethod === 'text') content = userInput.text;
        else if (creationMethod === 'import' && userInput.file) {
             setIsLoading(true);
             setLoadingMessage(t.extractingText);
             try { content = await processFile(userInput.file); } catch (error) {
                 console.error("File processing error:", error);
                 alert(t.errorOccurred);
                 setIsLoading(false);
                 return;
             }
        }
        if (!content.trim()) return;

        setIsLoading(true);
        setLoadingMessage(t.generatingOutline);
        setFinalPresentation(null); // Clear previous final presentation
        try {
            const resultJson = await apiService.generatePresentationOutline({ method: creationMethod, content, slideCount, language });
            setGeneratedOutline(JSON.parse(resultJson));
        } catch (error) {
            console.error("Outline generation error:", error);
            setGeneratedOutline({ error: t.errorOccurred });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateFullPresentation = async () => {
        if (!generatedOutline) return;
        setIsLoading(true);
        setLoadingMessage(t.generatingFullPresentation);
        try {
            const resultJson = await apiService.generateFullPresentationContent(JSON.stringify(generatedOutline), language);
            setFinalPresentation(JSON.parse(resultJson));
        } catch (error) {
            console.error("Full presentation generation error:", error);
            setFinalPresentation({ error: t.errorOccurred });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadPdf = async () => {
        const previewElement = previewRef.current;
        if (!previewElement || !(finalPresentation || generatedOutline)) return;

        setIsLoading(true);
        setLoadingMessage(t.generatingPDF);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
    
        const slideElements = previewElement.querySelectorAll('.slide-preview-item');
    
        for (let i = 0; i < slideElements.length; i++) {
            const slideElement = slideElements[i];
            const canvas = await html2canvas(slideElement, { scale: 2, useCORS: true, backgroundColor: theme === 'dark' ? '#08154A' : '#FFFFFF' });
            const imgData = canvas.toDataURL('image/png');
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
    
        pdf.save('SciGenius-Presentation.pdf');
        setIsLoading(false);
    };

    const handleDownloadMarkdown = () => {
        const content = finalPresentation || generatedOutline;
        if (!content?.slides) return;

        let mdContent = `# ${userInput.prompt || userInput.file?.name || 'Presentation'}\n\n`;
        content.slides.forEach(slide => {
            mdContent += `---\n\n## Slide ${slide.slideNumber}: ${slide.title}\n\n`;
            if (Array.isArray(slide.content)) {
                 slide.content.forEach(block => {
                    if (typeof block === 'string') { // Fallback for old outline format
                        mdContent += `* ${block}\n`;
                        return;
                    }
                    switch (block.type) {
                        case 'paragraph':
                            mdContent += `${block.text}\n\n`;
                            break;
                        case 'bullet':
                            mdContent += `* ${block.text}\n`;
                            break;
                        case 'table':
                            mdContent += `| ${block.headers.join(' | ')} |\n`;
                            mdContent += `| ${block.headers.map(() => '---').join(' | ')} |\n`;
                            block.rows.forEach(row => {
                                mdContent += `| ${row.join(' | ')} |\n`;
                            });
                            mdContent += '\n';
                            break;
                        case 'visual_suggestion':
                            mdContent += `> **Visual Idea:** ${block.description}\n\n`;
                            break;
                        case 'infographic_point':
                            mdContent += `**${block.title}**: **${block.value}** - ${block.description}\n\n`;
                            break;
                        default:
                            mdContent += `* ${block.text || JSON.stringify(block)}\n`;
                    }
                });
            }
            if(slide.speakerNotes) {
                mdContent += `\n**Speaker Notes:**\n> ${slide.speakerNotes.replace(/\n/g, '\n> ')}\n`;
            }
            mdContent += `\n`;
        });
        
        const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'presentation.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadPptx = async () => {
        if (!finalPresentation?.slides || !window.PptxGenJS) return;
    
        setIsLoading(true);
        setLoadingMessage(t.generatingPPTX);
        
        try {
            const pptx = new window.PptxGenJS();
            pptx.author = 'SciGenius';
            pptx.company = 'AI Roadmap Co.';
            pptx.title = finalPresentation.slides[0]?.title || 'SciGenius Presentation';
    
            const getTemplateStyles = (templateId, theme) => {
                const isDark = theme === 'dark';
                let styles = {
                    titleFont: { fontFace: 'Arial', fontSize: 32, bold: true, color: isDark ? 'F1F1F1' : '333333' },
                    bodyFont: { fontFace: 'Arial', fontSize: 18, color: isDark ? 'E1E1E1' : '666666' },
                    subtitleFont: { fontFace: 'Arial', fontSize: 24, color: isDark ? 'C1C1C1' : '555555' },
                    bgColor: isDark ? '08154A' : 'FFFFFF',
                    accentColor: 'EF4444',
                };
    
                switch (templateId) {
                    case 'professional':
                        styles.titleFont.fontFace = 'Georgia';
                        styles.bodyFont.fontFace = 'Georgia';
                        styles.accentColor = '005A9C';
                        styles.bgColor = isDark ? '1D2C3B' : 'F4F7FA';
                        break;
                    case 'vibrant':
                        styles.titleFont.fontFace = 'Verdana';
                        styles.accentColor = 'FF6B6B';
                        styles.bgColor = isDark ? '2A2A2A' : 'FFF9F3';
                        break;
                    case 'dark_mode':
                        styles.bgColor = '1A1A1A';
                        styles.titleFont.color = 'FFFFFF';
                        styles.bodyFont.color = 'CCCCCC';
                        styles.subtitleFont.color = 'AAAAAA';
                        styles.accentColor = '4A90E2';
                        break;
                    case 'creative':
                        styles.titleFont.fontFace = 'Courier New';
                        styles.bodyFont.fontFace = 'Courier New';
                        styles.bgColor = isDark ? '2C2C2E' : 'FAF8F2';
                        styles.accentColor = 'DAA520';
                        break;
                    case 'corporate':
                         styles.titleFont.fontFace = 'Helvetica';
                         styles.bodyFont.fontFace = 'Helvetica';
                         styles.bgColor = isDark ? '222831' : 'FFFFFF';
                         styles.accentColor = '00ADB5';
                         break;
                }
                return styles;
            };
            
            const styles = getTemplateStyles(selectedTemplate.id, theme);
    
            pptx.defineSlideMaster({
                title: 'TITLE_SLIDE',
                background: { color: styles.bgColor },
                objects: [
                    { 'rect': { x: 0, y: '85%', w: '100%', h: '15%', fill: { color: styles.accentColor } } },
                    { 'text': { text: 'SciGenius', options: { x: 0.5, y: '90%', w: '90%', align: 'center', color: 'FFFFFF', fontSize: 14 } } },
                    { 'placeholder': {
                        options: { name: 'title', type: 'title', x: 0.5, y: 1.5, w: 9, h: 1.5, ...styles.titleFont, fontSize: 44, align: 'center' },
                        text: ''
                    }},
                    { 'placeholder': {
                        options: { name: 'subtitle', type: 'body', x: 1, y: 3.2, w: 8, h: 1, ...styles.subtitleFont, align: 'center' },
                        text: ''
                    }},
                ],
            });
    
            pptx.defineSlideMaster({
                title: 'CONTENT_SLIDE',
                background: { color: styles.bgColor },
                objects: [
                    { 'rect': { x: 0, y: '92%', w: '100%', h: '8%', fill: { color: styles.accentColor } } },
                    { 'placeholder': {
                        options: { name: 'footer', type: 'footer', x: 0.5, y: '94%', w: 9, h: 0.5, align: 'right', color: 'FFFFFF', fontSize: 10 },
                        text: ''
                     }},
                    { 'placeholder': {
                        options: { name: 'title', type: 'title', x: 0.5, y: 0.2, w: 9, h: 1, ...styles.titleFont },
                        text: ''
                    }},
                    { 'placeholder': {
                        options: { name: 'body', type: 'body', x: 0.5, y: 1.2, w: 9, h: 5.5, ...styles.bodyFont },
                        text: ''
                    }},
                ],
            });
            
            for (const [index, slideData] of finalPresentation.slides.entries()) {
                let slide;
                let bodyContent = [];
    
                if (slideData.type === 'title_slide') {
                    slide = pptx.addSlide({ masterName: 'TITLE_SLIDE' });
                    slide.addText(slideData.title, { placeholder: 'title' });
                    const subtitle = slideData.content?.find(c => c.type === 'paragraph')?.text || '';
                    slide.addText(subtitle, { placeholder: 'subtitle' });
                } else {
                    slide = pptx.addSlide({ masterName: 'CONTENT_SLIDE' });
                    slide.addText(slideData.title, { placeholder: 'title' });
                    slide.addText(String(index + 1), { placeholder: 'footer' });

                    for(const block of slideData.content) {
                         let text = block.text;
                        if (typeof block === 'string') text = block;
    
                        if (block.type === 'bullet' || typeof block === 'string') {
                            bodyContent.push({ text, options: { bullet: true, indentLevel: block.indentLevel || 0 } });
                        } else if (block.type === 'paragraph') {
                             bodyContent.push({ text: block.text });
                        } else if (block.type === 'infographic_point') {
                            bodyContent.push({ text: `${block.title}: ${block.value}`, options: { bold: true, fontSize: 22 } });
                            bodyContent.push({ text: block.description, options: { indentLevel: 1 } });
                        } else if (block.type === 'visual_suggestion') {
                             bodyContent.push({ text: `[Visual Idea: ${block.description}]`, options: { color: '888888', italic: true } });
                        } else if (block.type === 'table') {
                            const tableRows = [block.headers.map(h => ({ text: h, options: { bold: true, fill: { color: styles.accentColor, alpha: 20 } } }))];
                            tableRows.push(...block.rows);
                            slide.addTable(tableRows, { x: 0.5, y: 2.5, w: 9, autoPage: true, ...styles.bodyFont, fontSize: 14, border: { type: 'solid', pt: 1, color: styles.accentColor + '80' } });
                        }
                    }
                    if (bodyContent.length > 0) {
                       slide.addText(bodyContent, { placeholder: 'body' });
                    }
                }
                
                if(slideData.speakerNotes) {
                    slide.addNotes(slideData.speakerNotes);
                }
            }
    
            await pptx.writeFile({ fileName: 'SciGenius-Presentation.pptx' });
    
        } catch (error) {
            console.error("Error generating PPTX:", error);
            alert(t.errorOccurred);
        } finally {
            setIsLoading(false);
        }
    };


    const handleListen = async (text, slideIndex) => {
        if (!text || audioLoadingSlideIndex !== null) return;
    
        if (speakingSlideIndex === slideIndex) {
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
            }
            setSpeakingSlideIndex(null);
            return;
        }
    
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }
        
        setSpeakingSlideIndex(slideIndex);
        setAudioLoadingSlideIndex(slideIndex);
    
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
                if (speakingSlideIndex === slideIndex) {
                    setSpeakingSlideIndex(null);
                }
                audioSourceRef.current = null;
            };
            
            source.start(0);
            audioSourceRef.current = source;
        } catch (error) {
            console.error("Error playing speech:", error);
            alert(`Could not play audio: ${error.message}`);
            setSpeakingSlideIndex(null);
        } finally {
            setAudioLoadingSlideIndex(null);
        }
    };


    return React.createElement('div', { className: "max-w-7xl mx-auto" },
        isLoading && React.createElement('div', { className: "fixed inset-0 bg-white/80 dark:bg-black/80 z-50 flex flex-col justify-center items-center backdrop-blur-sm" },
            React.createElement(Spinner, { size: '12' }),
            React.createElement('p', { className: "text-lg text-slate-700 dark:text-brand-text-light mt-4" }, loadingMessage)
        ),
        React.createElement('div', { className: "text-center mb-8" },
            React.createElement('h2', { className: "text-3xl font-bold text-slate-900 dark:text-brand-text" }, t.presentationGeneratorTitle),
            React.createElement('p', { className: "text-slate-500 dark:text-brand-text-light mt-2" }, t.presentationGeneratorDescription)
        ),

        React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" },
            // --- Left Panel: Controls ---
            React.createElement('div', { className: "lg:col-span-1 space-y-4" },
                React.createElement(StepCard, { 
                    title: t.presentationStep1,
                    isEnabled: true
                },
                    React.createElement('div', { className: "flex justify-around" },
                        React.createElement('button', { onClick: () => setCreationMethod('prompt'), className: `p-2 rounded-lg ${creationMethod === 'prompt' ? 'bg-brand-red/20' : ''}` }, React.createElement(PencilIcon, null), React.createElement('span', {className: 'text-xs'}, t.methodFromPrompt)),
                        React.createElement('button', { onClick: () => setCreationMethod('text'), className: `p-2 rounded-lg ${creationMethod === 'text' ? 'bg-brand-red/20' : ''}` }, React.createElement(ClipboardTextIcon, null), React.createElement('span', {className: 'text-xs'}, t.methodFromText)),
                        React.createElement('button', { onClick: () => setCreationMethod('import'), className: `p-2 rounded-lg ${creationMethod === 'import' ? 'bg-brand-red/20' : ''}` }, React.createElement(FileImportIcon, null), React.createElement('span', {className: 'text-xs'}, t.methodFromFile))
                    )
                ),
                React.createElement(StepCard, {
                    title: t.presentationStep2,
                    isEnabled: !!creationMethod
                },
                    React.createElement('div', { className: "space-y-4" },
                        creationMethod === 'prompt' && React.createElement('input', { type: "text", value: userInput.prompt, onChange: e => setUserInput({...userInput, prompt: e.target.value}), placeholder: t.enterTopicPrompt, className: "w-full p-2 bg-slate-100 dark:bg-input-gradient border border-slate-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" }),
                        creationMethod === 'text' && React.createElement('textarea', { value: userInput.text, onChange: e => setUserInput({...userInput, text: e.target.value}), placeholder: t.pasteTextPrompt, className: "w-full p-2 h-28 bg-slate-100 dark:bg-input-gradient border border-slate-300 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none resize-none" }),
                        creationMethod === 'import' && React.createElement('div', { onClick: () => fileInputRef.current?.click(), onDragOver: (e) => { e.preventDefault(); setIsDragOver(true); }, onDragLeave: () => setIsDragOver(false), onDrop: (e) => { e.preventDefault(); setIsDragOver(false); setUserInput({...userInput, file: e.dataTransfer.files?.[0]}); }, className: `p-4 text-center border-2 border-dashed rounded-lg cursor-pointer ${isDragOver ? 'border-brand-blue' : 'border-slate-300 dark:border-white/20'}` }, 
                            React.createElement(UploadIcon, { className: "h-6 w-6 mx-auto text-slate-400" }),
                            React.createElement('p', { className: "text-xs mt-1 text-slate-500 dark:text-brand-text-light truncate" }, userInput.file ? userInput.file.name : t.importFilePrompt)
                        ),
                        React.createElement('input', { type: "file", ref: fileInputRef, onChange: (e) => setUserInput({...userInput, file: e.target.files?.[0]}), className: "hidden", accept: ".pdf,.txt,.md" }),
                        React.createElement('div', { className: "flex items-center gap-2" },
                            React.createElement('label', { htmlFor: "slide-count", className: "text-sm font-medium" }, t.slideCount),
                            React.createElement('input', { type: "range", id: "slide-count", min: "5", max: "25", step: "1", value: slideCount, onChange: e => setSlideCount(e.target.value), className: "w-full" }),
                            React.createElement('span', { className: "font-bold text-slate-900 dark:text-white w-8 text-center" }, slideCount)
                        ),
                        React.createElement('button', { onClick: handleGenerateOutline, className: "w-full bg-brand-red hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full transition-colors" }, t.generateOutline)
                    )
                ),
                React.createElement(StepCard, {
                    title: t.presentationStep3,
                    isEnabled: !!generatedOutline
                },
                    React.createElement('div', { className: 'space-y-4' },
                        React.createElement('div', { className: "grid grid-cols-2 gap-2" },
                            PRESENTATION_TEMPLATES.map(template => React.createElement('div', { key: template.id, onClick: () => setSelectedTemplate(template), className: `relative rounded-lg overflow-hidden cursor-pointer aspect-video ${selectedTemplate.id === template.id ? 'ring-2 ring-brand-red' : ''}` },
                                React.createElement('img', { src: template.imageUrl, alt: template.name[language], className: "w-full h-full object-cover" }),
                                React.createElement('div', { className: "absolute inset-0 bg-black/40 flex items-end p-1" }, React.createElement('p', { className: "text-white text-[10px] font-bold" }, template.name[language]))
                            ))
                        ),
                        React.createElement('button', { onClick: handleGenerateFullPresentation, className: "w-full bg-brand-red hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full transition-colors" }, t.generateFullPresentation)
                    )
                ),
                 React.createElement(StepCard, {
                    title: t.presentationStep4,
                    isEnabled: !!finalPresentation
                 },
                    React.createElement('div', { className: 'space-y-3' },
                        React.createElement('p', {className: 'text-sm text-center text-slate-500 dark:text-brand-text-light'}, 'Your presentation is ready! Download it in your preferred format.'),
                        React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2' },
                            React.createElement('button', { onClick: handleDownloadPdf, className: "flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-brand-blue dark:hover:bg-brand-light-dark dark:text-brand-text font-bold py-2 px-4 rounded-full transition-colors" }, React.createElement(DownloadIcon, null), t.downloadPDF),
                            React.createElement('button', { onClick: handleDownloadPptx, className: "flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-brand-blue dark:hover:bg-brand-light-dark dark:text-brand-text font-bold py-2 px-4 rounded-full transition-colors" }, React.createElement(DownloadIcon, null), t.downloadPPTX),
                            React.createElement('button', { onClick: handleDownloadMarkdown, className: "sm:col-span-2 lg:col-span-1 flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-brand-blue dark:hover:bg-brand-light-dark dark:text-brand-text font-bold py-2 px-4 rounded-full transition-colors" }, React.createElement(DownloadIcon, null), t.downloadMarkdown)
                        )
                    )
                )
            ),

            // --- Right Panel: Preview ---
            React.createElement('div', { className: "lg:col-span-2 h-[80vh]" },
                React.createElement(PreviewPanel, {
                    ref: previewRef,
                    generatedOutline: generatedOutline,
                    finalPresentation: finalPresentation,
                    t: t,
                    onListen: handleListen,
                    speakingSlideIndex: speakingSlideIndex,
                    audioLoadingSlideIndex: audioLoadingSlideIndex
                })
            )
        )
    );
};

export default PresentationGenerator;