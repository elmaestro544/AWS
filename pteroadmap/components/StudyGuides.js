import React, { useState } from 'react';
import { BackIcon, ChevronRightIcon } from './icons.js';

const AccordionItem = ({ title, children, isOpen, onClick }) => (
    React.createElement('div', { className: 'border-b' },
        React.createElement('button', {
            onClick: onClick,
            className: 'w-full flex justify-between items-center text-left py-4 px-6 focus:outline-none'
        },
            React.createElement('span', { className: 'text-lg font-semibold text-gray-800' }, title),
            React.createElement(ChevronRightIcon, { className: `w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}` })
        ),
        isOpen && React.createElement('div', { className: 'px-6 pb-4' },
            React.createElement('div', { className: "prose prose-sm max-w-none bg-gray-100 p-4 rounded-lg text-gray-700" },
                children
            )
        )
    )
);

const guides = {
    "Speaking": [
        {
            title: "Read Aloud",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "This question type is the 1st one in the Speaking Section. Test takers will see a textual passage before they are given 40 seconds for preparation and another 40 seconds for reading the passage aloud, and their responses will be recorded only once. This question type usually consists of 6 or 7 questions."),
                React.createElement('h4', null, 'Tips'),
                React.createElement('p', null, "This question type is the most difficult one in the Speaking Section, on which test takers are the least likely to achieve improvement. Pearson will put many subtle details into assessment: stress, liaison, loss of plosion and division of sense group."),
                React.createElement('h4', null, 'Time Span'),
                React.createElement('p', null, "The maximum time length for response recording is 40 seconds and when speaking with a normal pace 20 to 30 seconds will be enough for a complete response. If it takes a test taker 40 seconds to finish his or her response, it indicates that he or she has spoken too slowly, and his or her grade in this question type will be rather low."),
            )
        },
        {
            title: "Repeat Sentence",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About the Task'),
                React.createElement('p', null, "You will hear a recording of a sentence once. Repeat what you've heard. You have 15 seconds to answer."),
                React.createElement('h4', null, 'Exam Tips: Method 258'),
                React.createElement('p', null, 'This method helps balance content and fluency.'),
                React.createElement('ul', null,
                    React.createElement('li', null, React.createElement('strong', null, 'Method 2:'), " If the sentence is too hard, repeat 2-4 key words fluently."),
                    React.createElement('li', null, React.createElement('strong', null, 'Method 5:'), " If you can only remember half, focus on repeating one half of the sentence fluently."),
                    React.createElement('li', null, React.createElement('strong', null, 'Method 8:'), " If you understand most of it, repeat about 80% and skip words you don't recall.")
                ),
            )
        },
        {
            title: "Describe Image",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "Task: describe what the graph is showing. You have 25 seconds for preparation and 40 seconds to answer. You will see 3-4 of these questions in the exam."),
                React.createElement('h4', null, 'Exam Tips'),
                React.createElement('p', null, "DI is a relatively simple question type. You can describe the image in all kinds of ways as long as they are relevant. You may talk about the relationships, item names or conclusions. Try to select keywords or phrases from different parts of the graph."),
                React.createElement('p', null, "The difference in marks often does NOT lie in the content you say, but it’s often caused by the differences in fluency and pronunciation. So make sure you speak clearly and fluently."),
            )
        },
        {
            title: "Re-tell Lecture",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "Task: retell what you have heard from the lecture. Audio length: 60-90 seconds. Preparation time: 10 seconds. Answer time: 40 seconds. You will see 1-2 questions in the exam."),
                React.createElement('h4', null, 'Exam Tips'),
                React.createElement('ol', null,
                    React.createElement('li', null, React.createElement('strong', null, 'Listen and Take Notes:'), " Write down as many content words or phrases as you can."),
                    React.createElement('li', null, React.createElement('strong', null, 'Prepare (10s):'), " Quickly review your notes and select key points you can pronounce confidently."),
                    React.createElement('li', null, React.createElement('strong', null, 'Answer:'), " Mention at least 8 keywords/phrases. Focus on fluency and clear pronunciation; perfect grammar is less critical.")
                ),
            )
        },
        {
            title: "Answer Short Question",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "This question type is the 5th one in the Speaking Section. Test takers will be asked with a question about common sense, and are supposed to answer just one word or a very simple phrase. This question type usually consists of 5 to 6 questions."),
                React.createElement('h4', null, 'Tips'),
                React.createElement('p', null, "Do not hesitate in answering, as this question type's points account for a very trivial proportion in the Speaking Section. If you have time, occasionally flick through them in the question bank; otherwise, just skip this question type during PTE preparation."),
            )
        }
    ],
    "Writing": [
        {
            title: "Summarize Written Text",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "Task: read a passage and summarize it into one sentence. The passage length is normally within 300 words, and your answer must be between 5 and 75 words. You will see 1-2 of these questions in the exam."),
                React.createElement('h4', null, 'Exam Tips'),
                React.createElement('p', null, "There are two steps in answering: 1. find key sentences in the passage, and 2. connect key sentences into a grammatically correct sentence."),
                React.createElement('ul', null,
                    React.createElement('li', null, React.createElement('strong', null, 'Rule #1:'), " Find the topic. Sentences not related to the topic are not key."),
                    React.createElement('li', null, React.createElement('strong', null, 'Rule #2:'), " Do not choose examples or elaborative sentences."),
                    React.createElement('li', null, React.createElement('strong', null, 'Rule #3:'), " Choose conclusion sentences and topic sentences that are elaborated on.")
                ),
            )
        },
        {
            title: "Write Essay",
            content: React.createElement(React.Fragment, null,
                 React.createElement('h4', null, 'About'),
                React.createElement('p', null, "Task: write an essay of 200-300 words in 20 minutes. This is an important task, contributing significantly to the writing section. You will get 1-2 essay questions in the exam."),
                React.createElement('h4', null, 'Exam Tips'),
                React.createElement('p', null, "Manage your time well with three steps:"),
                React.createElement('ol', null,
                    React.createElement('li', null, React.createElement('strong', null, 'Think (2-3 mins):'), " Plan your arguments."),
                    React.createElement('li', null, React.createElement('strong', null, 'Write (13-15 mins):'), " Draft the essay."),
                    React.createElement('li', null, React.createElement('strong', null, 'Proofread (2-3 mins):'), " Check for errors.")
                ),
            )
        }
    ],
    "Reading": [
        {
            title: "Fill in Blanks (Dropdown)",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "This task tests reading and writing skills. A passage of 120-200 words will be shown with 4-5 blanks. For each blank, you must select the most appropriate option from a drop-down box."),
                React.createElement('h4', null, 'Tips'),
                React.createElement('p', null, "The clues for a blank are usually in the text immediately before or after it. Focus on context, collocations, and grammar. There's no need to read the entire passage first. Pay attention to words with similar meanings and analyze sentence structure."),
            )
        },
        {
            title: "Multiple Choice, Multiple Answers",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "You will see a passage of 200-300 words with a question and 5-7 choices. You must select all the correct choices. There will be 1-2 of these questions in the exam."),
                React.createElement('h4', null, 'Tips'),
                React.createElement('p', null, "This question type has a low impact on your overall score, so prioritize time management. Aim to finish within 1-2 minutes to save time for more important questions like Fill in the Blanks."),
                React.createElement('p', null, "Scoring is tricky: you get +1 point for a correct choice, but lose 1 point for an incorrect choice (minimum score is 0). Unless you are very sure, it is often safer to select only one answer you are confident about rather than guessing multiple."),
            )
        },
        {
            title: "Re-order Paragraphs",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "You will see a set of shuffled paragraphs. Your task is to drag and drop them into the correct logical order to form a coherent text. This task usually consists of 2-3 questions."),
                React.createElement('h4', null, 'Tips'),
                React.createElement('ul', null,
                    React.createElement('li', null, React.createElement('strong', null, 'Find the Topic Sentence:'), " This is usually the most independent sentence and introduces the main idea."),
                    React.createElement('li', null, React.createElement('strong', null, 'Look for Pronouns:'), " Words like 'he', 'it', 'they' refer to nouns in a previous sentence. Use these links to connect paragraphs."),
                    React.createElement('li', null, React.createElement('strong', null, 'Identify Transition Words:'), " Words like 'However', 'Therefore', 'Firstly' signal the logical relationship between paragraphs."),
                    React.createElement('li', null, React.createElement('strong', null, 'Check the Concluding Sentence:'), " The last paragraph often provides a summary or conclusion.")
                )
            )
        }
    ],
    "Listening": [
        {
            title: "Summarize Spoken Text",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "Summarize Spoken Text is actually a quite easy task in PTE. In exam, test takers will hear a lecture / dialogue（60s - 90s）and then they should write a summary of what they have heard. The word limit for the summary is 50 to 70 words. In exam, there are 1 to 2 SST questions."),
                React.createElement('h4', null, 'Tips'),
                React.createElement('p', null, "While listening, you should note down 5 - 6 key points, including topic phrase / sentence and 4 - 5 main points. Normally 1 main point in every 2 - 3 sentences. Then convert your notes into answers."),
                React.createElement('p', null, "If it is too difficult to determine the key points, note down as many sentences as possible (at least 5) that you can understand."),
                React.createElement('p', null, "Most importantly, do not make any grammar or spelling mistakes in your answer. Always remember to check your answer before submitting."),
                React.createElement('h4', null, 'Time Span'),
                React.createElement('p', null, "The time allowed for each Summarize Spoken Text is 10 minutes. The audio time is included in the 10 minute limit. You can check how much time you are left with at the top right corner of computer screen. Finishing answering with less than 10 minutes would not bring you additional time to next question. Therefore there is no need to rush, and always leave at least 2 – 3 minutes to proofread your answer before submitting."),
                React.createElement('h4', null, 'Practice Task'),
                React.createElement('p', null, "Get familiar with the tips taught in the SST public lesson. Practice 2 or 3 tasks on a daily basis on website")
            )
        },
        {
            title: "Listening Multiple Choices Multiple Answers",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "Test takers will usually hear a lecture/dialogue（40s-90s）before required to accordingly choose 2 or 3 correct answers from given 5 to 7 options. For each wrongly selected option there will be 1 point deducted unless this deduction will make the score of this task below 0. This question type usually consists of 1 or 2 tasks."),
                React.createElement('h4', null, 'Tips'),
                React.createElement('p', null, "Multiple-choice-multiple-answer questions account for a insignificant amount of points in the Listening Section, so they deserve a very low priority in preparation for PTE. Before each audio is played, start reading what is asked and then listen to the audio in a targeted way, which will help to get key information answering to the question."),
                React.createElement('p', null, "According to the grading of this question type test takers achieve 1 point for each correct selection and lose 1 point for each wrong selection. So, do not select more than you are certain of. On the other hand at least 1 option should be chosen."),
                React.createElement('h4', null, 'Time Span'),
                React.createElement('p', null, "Multiple-choice-multiple-answer questions account for a insignificant amount of points in the Listening Section, so finish them as quick as possible, leaving more time to more worthy WFD. If sure to answer correctly, can spend 1.5 minutes at most in each question( with audio playing combined in). If not, do not spend too much time here, just make a rough choice immediately after the audio playing and enter next task."),
                React.createElement('h4', null, 'Practice Task'),
                React.createElement('p', null, "Before mock/ real tests, practice 1 whole set of questions to get familiar with them. And pay attention to time management.")
            )
        },
        {
            title: "Multiple Choices Single Answer Listening",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "Test takers will usually hear a lecture/dialogue（60s-90s）before required to accordingly choose a solely correct answer from given options. This question type usually consists of 1 or 2 tasks."),
                React.createElement('h4', null, 'Time Span'),
                React.createElement('p', null, "Multiple-choice-single-answer questions account for an insignificant amount of points in the Listening Section, so finish them as quick as possible, leaving more time to more worthy WFD. If sure to answer correctly, can spend 1.5 minutes at most in each question( with audio playing combined in). If not, do not spend too much time here, just make a rough choice immediately after the audio playing and enter next"),
                React.createElement('h4', null, 'Practice Goal'),
                React.createElement('p', null, "Multiple-choice-single-answer questions account for a insignificant amount of points in the Listening Section, so they deserve a very low priority in preparation for PTE. Before each audio is played, start reading what is asked and then listen to the audio in a targeted way, which will help to get key information answering to the question."),
                React.createElement('h4', null, 'Practice Task'),
                React.createElement('p', null, "Before mock/ real tests, practice 1 whole set of questions to get familiar with them. And pay attention to time management.")
            )
        },
        {
            title: "Highlight Correct Summary",
            content: React.createElement(React.Fragment, null,
                React.createElement('h4', null, 'About'),
                React.createElement('p', null, "Test takers will usually hear a lecture/dialogue（30s-90s）before required to accordingly choose a solely correct answer from given 3 to 5 options. This question type usually consists of 1 or 2 tasks."),
                React.createElement('h4', null, 'Tips'),
                React.createElement('p', null, "HCS questions account for an insignificant amount of points in the Listening Section, so they deserve a very low priority in preparation for PTE."),
                React.createElement('p', null, "The key to this question type is to understand the audio as a whole, so never get distracted, like reading the question. And the given options differ in main meaning, not trivial details."),
                React.createElement('h4', null, 'Time Span'),
                React.createElement('p', null, "HCS questions account for an insignificant amount of points in the Listening Section, so finish them as quick as possible, leaving more time to more worthy WFD. If sure to answer correctly, can spend 1.5 minutes at most in each question( with audio playing combined in). If not, do not spend too much time here, just make a rough choice immediately after the audio playing and enter next task."),
                React.createElement('h4', null, 'Practice Task'),
                React.createElement('p', null, "Before mock/ real tests, practice 1 whole set of questions to get familiar with them. And pay attention to time management.")
            )
        }
    ]
};

const StudyGuides = ({ navigateTo }) => {
    const [openSection, setOpenSection] = useState('Speaking');
    const [openItem, setOpenItem] = useState(null);

    const handleSectionClick = (sectionTitle) => {
        setOpenSection(prev => prev === sectionTitle ? null : sectionTitle);
        setOpenItem(null); // Close any open item when switching sections
    };

    const handleItemClick = (itemTitle) => {
        setOpenItem(prev => prev === itemTitle ? null : itemTitle);
    };

    return React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('button', { onClick: () => navigateTo('dashboard'), className: "flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline" },
            React.createElement(BackIcon, { className: "w-4 h-4 mr-1" }),
            'Back to Dashboard'
        ),
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-6' }, 'PTE Study Guides'),
        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg overflow-hidden' },
            Object.entries(guides).map(([sectionTitle, items]) => (
                 React.createElement('div', { 
                    key: sectionTitle, 
                    id: `${sectionTitle.toLowerCase()}-guides`,
                    className: 'border-b last:border-b-0 scroll-mt-20' 
                },
                    React.createElement('button', {
                        onClick: () => handleSectionClick(sectionTitle),
                        className: 'w-full flex justify-between items-center text-left py-5 px-6 bg-gray-50 hover:bg-gray-100 focus:outline-none'
                    },
                        React.createElement('span', { className: 'text-xl font-bold text-blue-600' }, sectionTitle),
                        React.createElement(ChevronRightIcon, { className: `w-6 h-6 transform transition-transform duration-300 ${openSection === sectionTitle ? 'rotate-90' : ''}` })
                    ),
                    openSection === sectionTitle && React.createElement('div', { className: 'bg-white' },
                        items.map(item =>
                            React.createElement(AccordionItem, {
                                key: item.title,
                                title: item.title,
                                isOpen: openItem === item.title,
                                onClick: () => handleItemClick(item.title)
                            }, item.content)
                        )
                    )
                )
            ))
        )
    );
};

export default StudyGuides;