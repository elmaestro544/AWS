
import React from 'react';
import { i18n } from '../constants.js';
import { ResearchCopilotIcon, DataAnalysisIcon, InfographicVideoIcon } from './Shared.js';

const Home = ({ language, onNavigateToServices }) => {
    const t = i18n[language];

    const HeroSection = () => (
        React.createElement('section', { className: 'container mx-auto px-6 py-16 md:py-24' },
            React.createElement('div', { className: 'grid md:grid-cols-2 gap-12 items-center' },
                React.createElement('div', { className: `text-center md:text-left ${language === 'ar' ? 'md:text-right' : ''}` },
                    React.createElement('h1', { className: 'text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight' }, 
                        language === 'ar' ? 'عزّز فكرك مع عبقري العلوم' : 'Amplify Your Intellect with SciGenius'
                    ),
                    React.createElement('p', { className: 'mt-6 text-lg text-slate-500 dark:text-light-gray max-w-xl mx-auto md:mx-0' }, 
                        language === 'ar' ? 'منصتك الشاملة للبحث والإبداع والتصميم. حوّل أفكارك إلى نتائج مذهلة بمساعدة الذكاء الاصطناعي.' : 'Your all-in-one AI platform for research, creativity, and design. Transform your ideas into powerful results.'
                    ),
                    React.createElement('div', { className: `mt-8 flex justify-center md:justify-start gap-4 ${language === 'ar' ? 'md:justify-end' : ''}` },
                        React.createElement('button', {
                            onClick: onNavigateToServices,
                            className: 'px-8 py-3 bg-brand-red text-white font-semibold rounded-lg shadow-lg hover:bg-red-500 transition-colors'
                        }, language === 'ar' ? 'ابدأ الآن' : 'Get Started'),
                        React.createElement('button', {
                            className: 'px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white font-semibold rounded-lg transition-colors backdrop-blur-sm'
                        }, language === 'ar' ? 'شاهد الفيديو' : 'Watch Video')
                    )
                ),
                React.createElement('div', { className: 'relative h-80 md:h-full flex items-center justify-center' },
                    // Abstract floating shapes
                    React.createElement('div', { className: 'absolute w-64 h-64 bg-secondary rounded-full opacity-20 dark:opacity-30 filter blur-2xl animate-spin', style: { animationDuration: '20s' } }),
                    React.createElement('div', { className: 'absolute top-0 right-10 w-48 h-48 bg-brand-blue rounded-full opacity-20 dark:opacity-30 filter blur-2xl animate-spin', style: { animationDuration: '25s', animationDirection: 'reverse' } }),
                    React.createElement('div', { className: 'absolute bottom-0 left-10 w-40 h-40 bg-green-500 rounded-full opacity-20 dark:opacity-30 filter blur-2xl animate-spin', style: { animationDuration: '18s' } }),
                    // Central floating element
                    React.createElement('div', { className: 'relative animate-float' },
                        React.createElement('div', { className: 'w-72 h-72 bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl transform rotate-45' }),
                        React.createElement('div', { className: 'absolute inset-4 bg-white/60 dark:bg-dark-card/60 backdrop-blur-md border border-white/20 rounded-lg transform -rotate-45 flex items-center justify-center shadow-xl' },
                            React.createElement('div', { className: 'text-center' },
                                React.createElement('h3', { className: 'text-2xl font-bold text-slate-800 dark:text-white' }, 'SciGenius'),
                                React.createElement('p', { className: 'text-sm text-slate-500 dark:text-light-gray' }, 'AI-Powered Assistant')
                            )
                        )
                    )
                )
            )
        )
    );

    const WhatWeDoSection = () => {
        const services = [
            { icon: ResearchCopilotIcon, title: t.homeCardResearchTitle, desc: t.homeCardResearchDesc },
            { icon: DataAnalysisIcon, title: t.homeCardDataAnalysisTitle, desc: t.homeCardDataAnalysisDesc },
            { icon: InfographicVideoIcon, title: t.homeCardInfographicVideoTitle, desc: t.homeCardInfographicVideoDesc },
        ];
        return React.createElement('section', { className: 'bg-slate-50/80 dark:bg-white/5 backdrop-blur-sm py-20 border-y border-slate-200/50 dark:border-white/5' },
            React.createElement('div', { className: 'container mx-auto px-6' },
                React.createElement('div', { className: 'text-center max-w-3xl mx-auto' },
                    React.createElement('h2', { className: 'text-3xl md:text-4xl font-bold text-slate-900 dark:text-white' }, 
                        language === 'ar' ? 'ماذا نفعل لمساعدة عملائنا على النمو' : 'What we do to help our clients grow'
                    ),
                ),
                React.createElement('div', { className: 'grid md:grid-cols-3 gap-8 mt-12' },
                    services.map((service, index) => 
                        React.createElement('div', { 
                            key: index, 
                            className: 'bg-white/60 dark:bg-dark-bg/60 backdrop-blur-md border border-slate-100 dark:border-white/10 p-8 rounded-2xl shadow-lg text-center transform hover:-translate-y-2 transition-transform'
                        },
                            React.createElement('div', { className: 'inline-block p-4 bg-brand-red/10 rounded-full mb-4' }, 
                                React.cloneElement(service.icon(), { className: 'h-8 w-8 text-brand-red' })
                            ),
                            React.createElement('h3', { className: 'text-xl font-bold text-slate-900 dark:text-white mb-2' }, service.title),
                            React.createElement('p', { className: 'text-slate-500 dark:text-light-gray' }, service.desc)
                        )
                    )
                )
            )
        );
    };

    const ProjectsSection = () => {
        const projects = [
            'https://picsum.photos/seed/project1/600/400',
            'https://picsum.photos/seed/project2/600/400',
            'https://picsum.photos/seed/project3/600/400',
            'https://picsum.photos/seed/project4/600/400',
        ];
        return React.createElement('section', { className: 'py-20' },
            React.createElement('div', { className: 'container mx-auto px-6' },
                React.createElement('div', { className: 'text-center max-w-3xl mx-auto mb-12' },
                    React.createElement('h2', { className: 'text-3xl md:text-4xl font-bold text-slate-900 dark:text-white' }, 
                         language === 'ar' ? 'بعض من مشاريعنا المنجزة' : 'Our Finished Projects'
                    ),
                    React.createElement('p', { className: 'mt-4 text-slate-500 dark:text-light-gray' },
                         language === 'ar' ? 'شاهد كيف ساعدنا الآخرين على تحقيق أفكارهم. من التصاميم الداخلية إلى العروض التقديمية، قدراتنا لا حدود لها.' : 'See how we have helped others bring their ideas to life. From interior designs to presentation slides, the capabilities are endless.'
                    )
                ),
                React.createElement('div', { className: 'grid md:grid-cols-2 gap-8' },
                    projects.map((src, index) =>
                        React.createElement('div', { key: index, className: 'group relative overflow-hidden rounded-2xl shadow-lg border border-slate-200 dark:border-white/10' },
                            React.createElement('img', { src, alt: `Project ${index + 1}`, className: 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' }),
                            React.createElement('div', { className: 'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm' },
                                React.createElement('p', { className: 'text-white text-lg font-bold' }, `Showcase ${index + 1}`)
                            )
                        )
                    )
                )
            )
        );
    };

    const TeamSection = () => {
        const team = [
            { name: 'Dr. Arin', role: language === 'ar' ? 'قائد الذكاء الاصطناعي' : 'AI Lead', img: 'https://i.pravatar.cc/150?u=1' },
            { name: 'Noor', role: language === 'ar' ? 'مهندسة واجهة المستخدم' : 'UX Engineer', img: 'https://i.pravatar.cc/150?u=2' },
            { name: 'Zayn', role: language === 'ar' ? 'باحث رئيسي' : 'Lead Researcher', img: 'https://i.pravatar.cc/150?u=3' },
        ];
         return React.createElement('section', { className: 'bg-slate-50/80 dark:bg-white/5 backdrop-blur-sm py-20 border-y border-slate-200/50 dark:border-white/5' },
            React.createElement('div', { className: 'container mx-auto px-6' },
                React.createElement('div', { className: 'text-center max-w-3xl mx-auto mb-12' },
                    React.createElement('h2', { className: 'text-3xl md:text-4xl font-bold text-slate-900 dark:text-white' }, 
                        language === 'ar' ? 'تعرف على فريقنا الإبداعي' : 'Meet Our Great Creative Teams'
                    ),
                    React.createElement('p', { className: 'mt-4 text-slate-500 dark:text-light-gray' },
                        language === 'ar' ? 'فريقنا المتخصص من الخبراء جاهز لمساعدتك في تحقيق أقصى استفادة من الذكاء الاصطناعي.' : 'Our dedicated team of experts is ready to help you leverage the full potential of AI.'
                    )
                ),
                React.createElement('div', { className: 'grid md:grid-cols-3 gap-8' },
                    team.map((member, index) => 
                        React.createElement('div', { key: index, className: 'text-center bg-white/60 dark:bg-dark-bg/60 backdrop-blur-md border border-slate-100 dark:border-white/10 p-6 rounded-2xl shadow-lg' },
                            React.createElement('img', { src: member.img, alt: member.name, className: 'w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-red shadow-md' }),
                            React.createElement('h3', { className: 'text-xl font-bold text-slate-900 dark:text-white' }, member.name),
                            React.createElement('p', { className: 'text-slate-500 dark:text-light-gray' }, member.role)
                        )
                    )
                )
            )
        );
    };


    return React.createElement('div', { className: "w-full" },
        React.createElement(HeroSection, null),
        React.createElement(WhatWeDoSection, null),
        React.createElement(ProjectsSection, null),
        React.createElement(TeamSection, null)
    );
};

export default Home;
