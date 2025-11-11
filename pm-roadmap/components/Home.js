
import React from 'react';
import { i18n, AppView } from '../constants.js';
import { PlanningIcon, RiskIcon, BudgetIcon, AgentIcon, ScheduleIcon, CheckIcon } from './Shared.js';

// --- New Motion Graphic Component ---
const MotionGraphic = () => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // --- Iconic Tower Animation Settings ---
        const TOWER_COLORS = ['#2DD4BF', '#A3E635', '#FACC15']; // turquoise, green, yellow
        const TOWER_BASE_WIDTH_FACTOR = 0.15; // Width at the base as a factor of canvas width
        const TOWER_TOP_WIDTH_FACTOR = 0.02;  // Width at the top
        const TOWER_HEIGHT_FACTOR = 0.9;      // Max height as a factor of canvas height
        const BUILD_SPEED = 0.005;            // Speed of tower growth (factor of height per frame)
        const RESET_DELAY = 120; // Frames to wait before restarting

        let towerHeight = 0;
        let animationState = 'building'; // building, complete, resetting
        let resetTimer = 0;
        let particles = [];

        const setCanvasSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const resetAnimation = () => {
            towerHeight = 0;
            animationState = 'building';
            resetTimer = 0;
            particles = [];
        };

        const createParticle = (x, y) => {
            particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: 1,
                color: TOWER_COLORS[Math.floor(Math.random() * TOWER_COLORS.length)],
                life: Math.random() * 50 + 20
            });
        };

        const drawTower = () => {
            const centerX = canvas.width / 2;
            const baseY = canvas.height;
            const maxHeight = canvas.height * TOWER_HEIGHT_FACTOR;
            const currentAbsoluteHeight = towerHeight * maxHeight;
            
            const baseWidth = canvas.width * TOWER_BASE_WIDTH_FACTOR;
            const topWidth = canvas.width * TOWER_TOP_WIDTH_FACTOR;

            // --- Draw Main Structure (Facade) ---
            const gradient = ctx.createLinearGradient(centerX, baseY, centerX, baseY - currentAbsoluteHeight);
            gradient.addColorStop(0, 'rgba(45, 212, 191, 0)');
            gradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.2)');
            gradient.addColorStop(1, 'rgba(163, 230, 53, 0.4)');

            ctx.beginPath();
            const currentTopY = baseY - currentAbsoluteHeight;
            const currentWidth = baseWidth - (baseWidth - topWidth) * towerHeight;
            ctx.moveTo(centerX - baseWidth / 2, baseY);
            ctx.lineTo(centerX - currentWidth / 2, currentTopY);
            ctx.lineTo(centerX + currentWidth / 2, currentTopY);
            ctx.lineTo(centerX + baseWidth / 2, baseY);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();

            // --- Draw Crane/Core Line ---
            if (animationState === 'building') {
                ctx.beginPath();
                ctx.moveTo(centerX, baseY);
                ctx.lineTo(centerX, currentTopY);
                ctx.strokeStyle = '#FACC15';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#FACC15';
                ctx.shadowBlur = 15;
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Create particles at the crane tip
                if (Math.random() > 0.7) {
                    createParticle(centerX, currentTopY);
                }
            }
            
            // --- Draw Horizontal Floor Lines ---
            const numLines = 20;
            for (let i = 0; i < numLines; i++) {
                const progress = i / numLines;
                if (progress <= towerHeight) {
                    const y = baseY - (progress * currentAbsoluteHeight);
                    const lineWidth = baseWidth - (baseWidth - topWidth) * progress;
                    
                    ctx.beginPath();
                    ctx.moveTo(centerX - lineWidth / 2, y);
                    ctx.lineTo(centerX + lineWidth / 2, y);
                    ctx.strokeStyle = `rgba(163, 230, 53, ${0.1 + progress * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // --- Draw Spire ---
             if (towerHeight > 0.95) {
                const spireStart = baseY - maxHeight * 0.95;
                const spireEnd = currentTopY;
                ctx.beginPath();
                ctx.moveTo(centerX, spireStart);
                ctx.lineTo(centerX, spireEnd);
                ctx.strokeStyle = '#FACC15';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#FACC15';
                ctx.shadowBlur = 20;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        };
        
        const drawParticles = () => {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.02;
                p.life--;

                if (p.alpha <= 0 || p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        };
        
        setCanvasSize();

        const animate = () => {
            ctx.fillStyle = 'rgba(13, 12, 19, 0.15)'; // dark-bg with alpha for motion blur
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawTower();
            drawParticles();

            switch (animationState) {
                case 'building':
                    if (towerHeight < 1) {
                        towerHeight += BUILD_SPEED;
                    } else {
                        towerHeight = 1;
                        animationState = 'complete';
                    }
                    break;
                case 'complete':
                    if (resetTimer < RESET_DELAY) {
                        resetTimer++;
                    } else {
                        animationState = 'resetting';
                    }
                    break;
                case 'resetting':
                     if (towerHeight > 0) {
                        towerHeight -= BUILD_SPEED * 3; // Reset faster
                    } else {
                        resetAnimation();
                    }
                    break;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        
        const resizeObserver = new ResizeObserver(() => {
            cancelAnimationFrame(animationFrameId);
            setCanvasSize();
            resetAnimation();
            animate();
        });

        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };

    }, []);

    return React.createElement('canvas', { 
        ref: canvasRef,
        className: 'absolute inset-0 w-full h-full z-0'
    });
};


const Home = ({ language, setView }) => {
    const t = i18n[language];

    const HeroSection = () => (
        React.createElement('section', { className: 'relative overflow-hidden' },
            React.createElement(MotionGraphic, null),
            React.createElement('div', { className: 'container mx-auto px-6 py-20 md:py-32' },
                 React.createElement('div', { className: 'relative z-10 grid md:grid-cols-2 gap-12 items-center' },
                    // Left: AI Planning Engine Card
                    React.createElement('div', { className: 'animate-slide-in-up' },
                        React.createElement('div', { className: 'bg-dark-card backdrop-blur-xl rounded-2xl p-6 glow-border' },
                            React.createElement('div', { className: 'flex justify-between items-center' },
                                React.createElement('h3', { className: 'text-2xl font-bold text-white' }, t.capability1Title),
                                React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: 'h-6 w-6 text-brand-purple-light', fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }))
                            ),
                            React.createElement('p', { className: 'text-brand-text-light mt-2' }, t.capability1Desc),
                            // Dummy plan UI
                            React.createElement('div', { className: 'mt-6 bg-dark-card-solid p-4 rounded-lg border border-dark-border space-y-3' },
                                React.createElement('div', { className: 'flex justify-between items-center bg-dark-bg p-3 rounded' },
                                    React.createElement('p', { className: 'text-sm' }, "Task: Market Research"),
                                    React.createElement('div', { className: 'w-24 h-2 bg-dark-card-solid rounded-full' }, React.createElement('div', { className: 'w-1/2 h-2 bg-brand-purple rounded-full' }))
                                ),
                                React.createElement('div', { className: 'flex justify-between items-center bg-dark-bg p-3 rounded opacity-70' },
                                     React.createElement('p', { className: 'text-sm' }, "Task: UI/UX Design"),
                                     React.createElement('div', { className: 'w-24 h-2 bg-dark-card-solid rounded-full' }, React.createElement('div', { className: 'w-1/4 h-2 bg-brand-purple rounded-full' }))
                                ),
                                React.createElement('div', { className: 'flex justify-between items-center bg-dark-bg p-3 rounded opacity-50' },
                                     React.createElement('p', { className: 'text-sm' }, "Task: Development"),
                                     React.createElement('div', { className: 'w-24 h-2 bg-dark-card-solid rounded-full' })
                                )
                            )
                        )
                    ),
                    // Right: Hero Text
                    React.createElement('div', { className: 'text-center md:text-left animate-slide-in-up', style: { animationDelay: '0.2s' } },
                        React.createElement('h1', { className: 'text-4xl md:text-6xl font-extrabold text-white leading-tight' }, 
                            t.homeHeroTitle
                        ),
                        React.createElement('p', { className: 'mt-6 text-lg text-brand-text-light' }, 
                            t.homeHeroDescription
                        ),
                        React.createElement('div', { className: 'mt-8 flex justify-center md:justify-start' },
                            React.createElement('button', {
                                onClick: () => setView(AppView.Pricing),
                                className: 'px-8 py-4 bg-cta-gradient text-white font-semibold rounded-lg shadow-lg shadow-brand-purple/30 transition-all transform hover:scale-105 hover:shadow-brand-purple/50'
                            }, t.getStarted)
                        )
                    )
                 )
            )
        )
    );

    const CapabilitiesSection = () => {
        const capabilities = [
            { icon: PlanningIcon, title: t.whyChoose1Title, desc: t.whyChoose1Desc },
            { icon: ScheduleIcon, title: t.capability2Title, desc: t.capability2Desc },
            { icon: RiskIcon, title: t.capability4Title, desc: t.capability4Desc },
            { icon: BudgetIcon, title: t.capability5Title, desc: t.capability5Desc },
        ];

        return React.createElement('section', { id: 'features', className: 'py-16 md:py-24' },
            React.createElement('div', { className: 'container mx-auto px-6' },
                React.createElement('div', { className: 'text-center max-w-3xl mx-auto mb-12' },
                    React.createElement('h2', { className: 'text-3xl md:text-4xl font-bold text-white' }, t.capabilitiesTitle),
                    React.createElement('p', { className: 'mt-4 text-lg text-brand-text-light' }, t.capabilitiesDescription)
                ),
                React.createElement('div', { className: 'grid md:grid-cols-2 lg:grid-cols-4 gap-8' },
                    capabilities.map((feature, index) =>
                        React.createElement('div', { 
                            key: index, 
                            className: 'bg-dark-card backdrop-blur-xl p-6 rounded-xl text-center glow-border transition-all duration-300 hover:-translate-y-2' 
                        },
                            React.createElement('div', { className: 'flex justify-center mb-4 text-brand-purple-light' }, React.createElement(feature.icon, { className: 'h-10 w-10' })),
                            React.createElement('h3', { className: 'text-xl font-bold text-white mb-2' }, feature.title),
                            React.createElement('p', { className: 'text-brand-text-light' }, feature.desc)
                        )
                    )
                )
            )
        );
    };
    
    const IndustriesSection = () => {
        const industries = [
            { title: t.industry1Title, desc: t.industry1Desc, features: [t.industry1Feature1, t.industry1Feature2, t.industry1Feature3] },
            { title: t.industry2Title, desc: t.industry2Desc, features: [t.industry2Feature1, t.industry2Feature2, t.industry2Feature3] },
            { title: t.industry3Title, desc: t.industry3Desc, features: [t.industry3Feature1, t.industry3Feature2, t.industry3Feature3] },
        ];
        return React.createElement('section', { id: 'industries', className: 'py-16 md:py-24 bg-dark-card-solid' },
            React.createElement('div', { className: 'container mx-auto px-6' },
                React.createElement('div', { className: 'text-center max-w-3xl mx-auto mb-12' },
                    React.createElement('h2', { className: 'text-3xl md:text-4xl font-bold text-white' }, t.industriesTitle),
                    React.createElement('p', { className: 'mt-4 text-lg text-brand-text-light' }, t.industriesDescription)
                ),
                React.createElement('div', { className: 'grid md:grid-cols-1 lg:grid-cols-3 gap-8' },
                    industries.map((industry, i) => 
                        React.createElement('div', { key: i, className: 'bg-dark-card backdrop-blur-xl rounded-xl p-8 flex flex-col glow-border' },
                            React.createElement('h3', { className: 'text-2xl font-bold text-white' }, industry.title),
                            React.createElement('p', { className: 'text-brand-text-light mt-2 mb-6 flex-grow' }, industry.desc),
                            React.createElement('ul', { className: 'space-y-3' },
                                industry.features.map((feat, fi) => React.createElement('li', { key: fi, className: 'flex items-start gap-3' },
                                    React.createElement('div', { className: 'w-5 h-5 flex-shrink-0 mt-1 flex items-center justify-center rounded-full bg-brand-purple text-white' }, React.createElement(CheckIcon, { className: 'w-3 h-3' })),
                                    React.createElement('span', { className: 'text-brand-text-light' }, feat)
                                ))
                            )
                        )
                    )
                )
            )
        )
    };

    return React.createElement('div', null,
        React.createElement(HeroSection, null),
        React.createElement(CapabilitiesSection, null),
        React.createElement(IndustriesSection, null)
    );
};

export default Home;
