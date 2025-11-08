

import React, { useState, useEffect, useRef } from 'react';
import { Language, i18n } from './constants.js';
import { Logo, SunIcon, MoonIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, BulbIcon, PuzzleIcon, UsersIcon, SparklesIcon, DocumentTextIcon, BookOpenIcon, AcademicCapIcon, BriefcaseIcon, ArrowTrendingUpIcon, LinkIcon, XIcon, FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, AvatarIcon, TargetIcon, EyeIcon, BuildingOfficeIcon, GlobeAltIcon, ComputerDesktopIcon } from './components/Shared.js';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfPoGQ7SnFbewD0Fmds6GF5NdzaAU9wUePO5PVY8kqEhv8uig/viewform?usp=dialog';

// A simple utility to create URL-friendly slugs from strings
const slugify = (text) => text
  .toString()
  .toLowerCase()
  .replace(/\s+/g, '-')        // Replace spaces with -
  .replace(/[^\w-]+/g, '')   // Remove all non-word chars
  .replace(/--+/g, '-')        // Replace multiple - with single -
  .replace(/^-+/, '')          // Trim - from start of text
  .replace(/-+$/, '');         // Trim - from end of text

// Header Component
const Header = ({ language, setLanguage, theme, toggleTheme, onNavigateHome, onNavigateToSpecializedPrograms, onNavigateToServices, onNavigateToSpecificService }) => {
  const t = i18n[language];
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const servicesMenuTimeoutRef = useRef(null);

  const handleServicesMenuEnter = () => {
    clearTimeout(servicesMenuTimeoutRef.current);
    setIsServicesMenuOpen(true);
  };

  const handleServicesMenuLeave = () => {
    servicesMenuTimeoutRef.current = setTimeout(() => {
      setIsServicesMenuOpen(false);
    }, 200);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(servicesMenuTimeoutRef.current);
    };
  }, []);

  return React.createElement('header', { className: 'fixed top-0 w-full z-40 bg-light-bg-secondary/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-light-border/50 dark:border-dark-border' },
    React.createElement('nav', { className: 'container mx-auto px-6 py-4 flex justify-between items-center' },
      React.createElement('div', { className: 'flex items-center gap-8' },
        React.createElement('a', { href: '#', onClick: (e) => {e.preventDefault(); onNavigateHome(); }}, React.createElement(Logo, { className: 'h-10 w-auto' }))
      ),
      React.createElement('div', { className: 'hidden md:flex items-center gap-6' },
          React.createElement('div', { 
            className: 'relative',
            onMouseEnter: handleServicesMenuEnter,
            onMouseLeave: handleServicesMenuLeave
          },
            React.createElement('a', { href: '#services', onClick: (e) => { e.preventDefault(); onNavigateToServices(); }, className: 'flex items-center gap-1 text-light-text dark:text-dark-text hover:text-primary dark:hover:text-primary-light transition-colors cursor-pointer' }, t.navServices, React.createElement(ChevronDownIcon, { className: 'h-4 w-4' })),
            isServicesMenuOpen && React.createElement('div', {
              className: 'absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-light-bg-secondary/95 dark:bg-dark-bg/95 backdrop-blur-lg rounded-lg shadow-xl border border-light-border dark:border-dark-border overflow-hidden animate-fade-in'
            },
              React.createElement('ul', { className: 'py-2' },
                t.ourServices.services.map(service => React.createElement('li', { key: service.title },
                  React.createElement('a', {
                    href: `#${slugify(service.title)}`,
                    onClick: (e) => {
                      e.preventDefault();
                      const serviceId = `service-${slugify(service.title)}`;
                      onNavigateToSpecificService(serviceId);
                      setIsServicesMenuOpen(false);
                    },
                    className: 'block px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full text-left'
                  }, service.title)
                ))
              )
            )
          ),
          React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); onNavigateToSpecializedPrograms(); }, className: 'text-light-text dark:text-dark-text hover:text-primary dark:hover:text-primary-light transition-colors' }, t.navSpecializedPrograms)
      ),
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('button', {
            onClick: toggleTheme,
            'aria-label': 'Toggle theme',
            className: 'text-light-text dark:text-dark-text hover:bg-gray-200/50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors'
        }, theme === 'light' ? React.createElement(MoonIcon, {className: 'h-5 w-5'}) : React.createElement(SunIcon, {className: 'h-5 w-5'})),
        React.createElement('button', {
          onClick: () => setLanguage(language === Language.EN ? Language.AR : Language.EN),
          className: "text-sm font-semibold text-light-text dark:text-dark-text px-3 py-1.5 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-800 transition-colors"
        }, language === Language.EN ? 'AR' : 'EN'),
        React.createElement('a', { href: GOOGLE_FORM_URL, target: '_blank', rel: 'noopener noreferrer', className: 'text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-full transition-colors' }, t.bookDemo)
      )
    )
  );
};

// Hero Section
const Hero = ({ t }) => {
  const canvasRef = useRef(null);
  const coreRef = useRef(null);
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, particles, streams;
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 100 };

    const particleColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    
    const handleCoreMouseMove = (event) => {
        if (!coreRef.current) return;
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;
        const rotateX = (clientY / innerHeight - 0.5) * -40;
        const rotateY = (clientX / innerWidth - 0.5) * 40;
        coreRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    window.addEventListener('mousemove', handleCoreMouseMove);

    const handleMouseMove = (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const resizeCanvas = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        init();
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 0.4 + 0.1;
            this.speedX = (Math.random() * 0.2 - 0.1);
            this.speedY = (Math.random() * 0.2 - 0.1);
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class DataStream {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() > 0.5 ? 0 : height;
            this.speed = Math.random() * 1.5 + 0.5;
            this.length = Math.floor(Math.random() * 10 + 5);
            this.history = [];
            this.angle = 0;
            this.targetX = width / 2;
            this.targetY = height / 2;
        }
        update() {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) {
                this.reset();
                return;
            }

            this.angle = Math.atan2(dy, dx);
            
            const mouseDx = this.x - mouse.x;
            const mouseDy = this.y - mouse.y;
            const mouseDist = Math.sqrt(mouseDx*mouseDx + mouseDy*mouseDy);

            if(mouse.x && mouseDist < mouse.radius) {
                const forceDirectionX = mouseDx / mouseDist;
                const forceDirectionY = mouseDy / mouseDist;
                const force = (mouse.radius - mouseDist) / mouse.radius;
                const directionX = (forceDirectionX * force * 1.5);
                const directionY = (forceDirectionY * force * 1.5);
                this.x += directionX;
                this.y += directionY;
            } else {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
            }

            this.history.push({x: this.x, y: this.y});
            if (this.history.length > this.length) {
                this.history.shift();
            }
        }
        draw() {
            ctx.beginPath();
            if (this.history.length === 0) return;
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for(let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
            const gradient = ctx.createLinearGradient(this.history[0].x, this.history[0].y, this.x, this.y);
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }
    
    function drawGrid() {
        const horizon = height * 0.4;
        const gridGradient = ctx.createLinearGradient(0, horizon, 0, height);
        gridGradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)'); // Blue at horizon
        gridGradient.addColorStop(1, 'rgba(147, 51, 234, 0.4)'); // Purple at bottom
        
        ctx.strokeStyle = gridGradient;
        ctx.lineWidth = 0.5;
        const step = 50;
        
        for (let i = 0; i <= width; i += step) {
             ctx.beginPath();
             ctx.moveTo(i, height);
             ctx.lineTo(width / 2 + (i - width / 2) * (horizon/height), horizon);
             ctx.stroke();
        }
        for (let i = horizon; i <= height; i += step) {
             ctx.beginPath();
             const y = i;
             const p = (y - horizon) / (height - horizon);
             const x1 = (width / 2) * (1 - p);
             const x2 = width - x1;
             ctx.moveTo(x1, y);
             ctx.lineTo(x2, y);
             ctx.stroke();
        }
    }

    const init = () => {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
        streams = [];
        for (let i = 0; i < 40; i++) {
            streams.push(new DataStream());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        drawGrid();
        particles.forEach(p => { p.update(); p.draw(); });
        streams.forEach(s => { if(s.history.length > 0) s.draw(); s.update(); });
        animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousemove', handleCoreMouseMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);
  
  const Satellite = ({ size, color, shadowColor, orbitRadius, orbitDuration, orbitTransform, reverse }) => {
    const satelliteStyle = {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        boxShadow: `0 0 ${size*2.5}px ${shadowColor}`,
    };

    return React.createElement('div', {
        className: 'absolute inset-0',
        style: {
            transformStyle: 'preserve-3d',
            transform: orbitTransform,
            animation: `spin ${orbitDuration}s linear infinite ${reverse ? 'reverse' : ''}`
        }
    },
        React.createElement('div', {
            className: 'absolute top-1/2 left-1/2',
            style: { transform: `translateX(${orbitRadius}px)` }
        },
            React.createElement('div', { className: 'rounded-full', style: satelliteStyle })
        )
    );
};

  const NeuralCore = () => {
    return React.createElement('div', { className: 'relative w-64 h-64 md:w-80 md:h-80', style: { transformStyle: 'preserve-3d' } },
        // Central spinning container
        React.createElement('div', { className: 'absolute inset-0', style: { transformStyle: 'preserve-3d', animation: 'spin 60s linear infinite' } },
            // Glass Sphere
            React.createElement('div', { 
                className: 'absolute inset-0 rounded-full core-glow backdrop-blur-[1px]',
                style: { background: 'radial-gradient(circle, rgba(45, 212, 191, 0.25) 0%, rgba(59, 130, 246, 0.15) 60%, transparent 80%)' }
            }),
            // Inner Rings
            React.createElement('div', { className: 'absolute inset-[15%] rounded-full border-t border-b border-cyan-400/50', style: { transform: 'rotateX(90deg)', animation: 'spin 25s linear infinite reverse' }}),
            React.createElement('div', { className: 'absolute inset-[25%] rounded-full border-l border-r border-blue-500/50', style: { transform: 'rotateY(0deg)', animation: 'spin 35s linear infinite' }}),
            React.createElement('div', { className: 'absolute inset-[35%] rounded-full border-dashed border-2 border-cyan-500/30', style: { transform: 'rotateX(45deg) rotateY(45deg)', animation: 'spin 40s linear infinite' }}),
            React.createElement('div', { className: 'absolute inset-[45%] rounded-full border-dotted border border-blue-500/20', style: { transform: 'rotateX(-45deg) rotateY(45deg)', animation: 'spin 50s linear infinite reverse' }})
        ),
        // Satellites
        React.createElement(Satellite, { size: 8, color: '#2dd4bf', shadowColor: 'rgba(45, 212, 191, 0.6)', orbitRadius: 180, orbitDuration: 15, orbitTransform: 'rotateX(70deg) rotateY(20deg)', reverse: true }),
        React.createElement(Satellite, { size: 6, color: '#3b82f6', shadowColor: 'rgba(59, 130, 246, 0.6)', orbitRadius: 200, orbitDuration: 20, orbitTransform: 'rotateX(-60deg) rotateY(40deg)' }),
        React.createElement(Satellite, { size: 4, color: '#60a5fa', shadowColor: 'rgba(96, 165, 250, 0.5)', orbitRadius: 220, orbitDuration: 25, orbitTransform: 'rotateX(80deg) rotateY(-60deg)', reverse: true })
    );
  }

  return React.createElement('section', { 
    id: 'home', 
    className: 'relative flex items-center justify-center min-h-screen py-20 overflow-hidden bg-light-bg dark:bg-dark-bg-secondary' 
  },
    React.createElement('canvas', { ref: canvasRef, className: 'absolute inset-0 z-0' }),
    
    React.createElement('div', { className: 'container relative z-20 mx-auto px-6 flex flex-col items-center justify-center gap-12' },
      // Text Content Block
      React.createElement('div', { className: 'text-center' },
        React.createElement('h1', { className: 'text-4xl md:text-6xl font-extrabold text-light-text dark:text-white leading-tight animate-slide-up [text-shadow:_0_2px_10px_rgb(0_0_0_/_50%)]' }, 
          t.heroTitle
        ),
        React.createElement('p', { className: 'mt-6 max-w-xl mx-auto text-lg text-light-text-secondary dark:text-slate-300 animate-slide-up [animation-delay:0.1s] [text-shadow:_0_1px_5px_rgb(0_0_0_/_50%)]' }, t.heroSubtitle),
        React.createElement('a', { 
            href: GOOGLE_FORM_URL,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'mt-8 inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-semibold px-8 py-3 rounded-full shadow-lg shadow-yellow-500/30 hover:from-amber-500 hover:to-yellow-600 hover:shadow-xl hover:shadow-yellow-500/50 transition-all animate-slide-up [animation-delay:0.2s] pointer-events-auto' 
          }, 
          t.heroButton
        )
      ),

      // Neural Core Block
      React.createElement('div', { 
          className: 'flex items-center justify-center', 
          style: { perspective: '1000px' } 
      },
          React.createElement('div', { 
              ref: coreRef, 
              className: 'transition-transform duration-100 ease-linear',
              style: { transformStyle: 'preserve-3d' }
          },
              React.createElement(NeuralCore)
          )
      )
    )
  );
};


// Partners Section
const Partners = ({ t }) => {
  const content = t.partnersSection;
  
  const iconMap = {
    BuildingOfficeIcon: BuildingOfficeIcon,
    BookOpenIcon: BookOpenIcon,
    GlobeAltIcon: GlobeAltIcon,
    BriefcaseIcon: BriefcaseIcon
  };
  
  const duplicatedCards = [...content.cards, ...content.cards];

  return React.createElement('section', { className: 'py-20 bg-white dark:bg-slate-900/50' },
    React.createElement('div', { className: 'container mx-auto px-6' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('h2', { className: 'text-3xl font-bold text-light-text dark:text-dark-text' }, content.title),
        React.createElement('p', { className: 'mt-4 max-w-2xl mx-auto text-light-text-secondary dark:text-dark-text-secondary' }, content.subtitle)
      ),
      React.createElement('div', { 
          className: 'mt-12 relative overflow-hidden',
          style: { maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }
      },
        React.createElement('div', { className: 'flex gap-8 animate-scroll-x' },
          duplicatedCards.map((card, index) => {
            const IconComponent = iconMap[card.icon];
            return React.createElement('div', { 
              key: `${card.title}-${index}`,
              className: 'flex-shrink-0 w-64 bg-slate-100/50 dark:bg-dark-bg-secondary p-8 rounded-2xl flex flex-col items-center justify-center text-center' 
            },
              React.createElement(IconComponent, { className: 'h-12 w-12 text-slate-400 dark:text-slate-500 mb-4' }),
              React.createElement('p', { className: 'font-semibold text-sm text-light-text-secondary dark:text-dark-text-secondary' }, card.title)
            );
          })
        )
      )
    )
  );
};


// About Us Section
const AboutUs = ({ t }) => {
  const content = t.aboutUs;
  
  const ValueCard = ({ icon, title, description, iconBg, iconColor }) => React.createElement('div', { className: 'bg-light-bg-secondary dark:bg-dark-bg-secondary p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300' },
    React.createElement('div', { className: `inline-flex p-4 rounded-xl ${iconBg}` },
      icon
    ),
    React.createElement('h3', { className: 'mt-6 text-2xl font-bold text-light-text dark:text-dark-text' }, title),
    React.createElement('p', { className: 'mt-2 text-light-text-secondary dark:text-dark-text-secondary' }, description)
  );

  return React.createElement('section', { id: 'about', className: 'py-20 md:py-32 bg-white dark:bg-slate-900/50' },
    React.createElement('div', { className: 'container mx-auto px-6' },
      React.createElement('div', { className: 'grid lg:grid-cols-2 gap-16 items-center' },
        // Left Column: Text Content
        React.createElement('div', { className: 'flex flex-col gap-6' },
          React.createElement('div', { className: 'self-start' },
            React.createElement('span', { className: 'bg-violet-100 text-violet-800 text-sm font-medium px-4 py-2 rounded-full dark:bg-violet-900/50 dark:text-violet-300' }, content.tag)
          ),
          React.createElement('h2', { className: 'text-4xl md:text-5xl font-bold leading-tight' },
            content.title1,
            React.createElement('span', { className: 'text-violet-600 dark:text-violet-400' }, ` ${content.title2}`)
          ),
          React.createElement('p', { className: 'text-lg text-light-text-secondary dark:text-dark-text-secondary' }, content.description1),
          React.createElement('p', { className: 'text-lg text-light-text-secondary dark:text-dark-text-secondary' }, content.description2)
        ),
        // Right Column: Image with Quote
        React.createElement('div', { className: 'relative' },
          React.createElement('img', {
            src: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=2069&auto=format&fit=crop',
            alt: 'A modern educational setting with a person working on a computer.',
            className: 'rounded-2xl shadow-2xl w-full h-full object-cover aspect-square lg:aspect-[4/3]'
          }),
          React.createElement('div', { className: 'absolute -bottom-8 ltr:-left-8 rtl:-right-8 w-4/5' },
            React.createElement('div', { className: 'bg-gradient-to-r from-violet-600 to-blue-600 p-6 rounded-2xl shadow-lg text-white font-semibold' },
              `"${content.quote}"`
            )
          )
        )
      ),
      // Bottom Row: Mission, Vision, Values
      React.createElement('div', { className: 'mt-32 grid grid-cols-1 md:grid-cols-3 gap-8' },
        React.createElement(ValueCard, {
          icon: React.createElement(TargetIcon, { className: 'h-8 w-8 text-violet-600' }),
          title: content.mission.title,
          description: content.mission.description,
          iconBg: 'bg-violet-100 dark:bg-violet-900/50'
        }),
        React.createElement(ValueCard, {
          icon: React.createElement(EyeIcon, { className: 'h-8 w-8 text-amber-600' }),
          title: content.vision.title,
          description: content.vision.description,
          iconBg: 'bg-amber-100 dark:bg-amber-900/50'
        }),
        React.createElement(ValueCard, {
          icon: React.createElement(BulbIcon, { className: 'h-8 w-8 text-sky-600' }),
          title: content.values.title,
          description: content.values.description,
          iconBg: 'bg-sky-100 dark:bg-sky-900/50'
        })
      )
    )
  );
};

// Our Services Section
const OurServices = ({ t }) => {
  const content = t.ourServices;

  return React.createElement('section', { id: 'services', className: 'py-20 md:py-32 bg-slate-50 dark:bg-slate-900' },
    React.createElement('div', { className: 'container mx-auto px-6' },
      React.createElement('h2', { className: 'text-4xl md:text-5xl font-bold text-center mb-16' }, content.title),
      React.createElement('div', { className: 'grid lg:grid-cols-3 gap-8' },
        content.services.map((service, index) => React.createElement('div', { 
            key: index, 
            id: `service-${slugify(service.title)}`,
            className: 'flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 scroll-mt-24' 
        },
          React.createElement('img', { 
            src: service.imageUrl, 
            alt: service.title,
            className: 'w-full h-48 object-cover'
          }),
          React.createElement('div', { className: 'bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white text-center' },
            React.createElement('h3', { className: 'text-xl font-bold' }, service.title)
          ),
          React.createElement('div', { className: 'p-6 flex-grow flex flex-col' },
            React.createElement('ul', { className: 'space-y-3 text-light-text dark:text-dark-text-secondary' },
              service.items.map((item, i) => React.createElement('li', { key: i, className: 'flex items-start' },
                React.createElement('span', { className: 'rtl:ml-3 ltr:mr-3 mt-1.5 flex-shrink-0 h-2 w-2 bg-purple-500 rounded-full' }),
                item
              ))
            ),
            React.createElement('p', { className: 'mt-6 text-light-text-secondary dark:text-dark-text-secondary text-sm' }, service.description)
          )
        ))
      )
    )
  );
};

// SpecializedPrograms Preview Carousel Section
const SpecializedProgramsPreview = ({ t }) => {
  const content = t.specializedPrograms;
  const categories = content.categories;
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef(null);

  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    autoplayRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % categories.length);
    }, 5000); // Autoplay every 5 seconds
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [categories.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetAutoplay();
  };

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + categories.length) % categories.length;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % categories.length;
    goToSlide(newIndex);
  };

  const getCardStyle = (index, currentIndex, total) => {
    let offset = index - currentIndex;
    if (Math.abs(offset) > total / 2) {
      offset = offset > 0 ? offset - total : offset + total;
    }

    const baseStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
    
    let transform = '';
    let opacity = 0;
    let zIndex = 0;
    let filter = 'blur(4px)';

    if (offset === 0) {
      transform = 'translateX(0) scale(1)';
      opacity = 1;
      zIndex = 20;
      filter = 'blur(0px)';
    } else if (offset === 1 || (currentIndex === total - 1 && index === 0)) {
        transform = 'translateX(55%) scale(0.8) rotateY(-30deg)';
        opacity = 0.4;
        zIndex = 10;
        filter = 'blur(2px)';
    } else if (offset === -1 || (currentIndex === 0 && index === total - 1)) {
        transform = 'translateX(-55%) scale(0.8) rotateY(30deg)';
        opacity = 0.4;
        zIndex = 10;
        filter = 'blur(2px)';
    } else {
        transform = `translateX(${offset > 0 ? '110%' : '-110%'}) scale(0.7)`;
        opacity = 0;
        zIndex = 0;
    }

    return { ...baseStyle, transform, opacity, zIndex, filter };
  };

  return React.createElement('section', { className: 'py-20 md:py-32 bg-white dark:bg-slate-900/50 overflow-hidden' },
    React.createElement('div', { className: 'container mx-auto px-6' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('h2', { className: 'text-4xl md:text-5xl font-bold' }, content.previewTitle),
        React.createElement('p', { className: 'mt-4 max-w-2xl mx-auto text-light-text-secondary dark:text-dark-text-secondary' }, content.previewSubtitle)
      ),
      React.createElement('div', { 
          className: 'relative mt-16 h-[500px]', 
          style: { perspective: '1000px' } 
      },
        React.createElement('div', { className: 'relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-full mx-auto' },
            categories.map((category, index) => {
              return React.createElement('div', {
                key: category.title,
                style: getCardStyle(index, currentIndex, categories.length),
              },
                React.createElement('div', { className: 'relative w-full h-full rounded-2xl shadow-2xl overflow-hidden' },
                  React.createElement('img', { src: category.imageUrl, alt: category.title, className: 'absolute inset-0 w-full h-full object-cover' }),
                  React.createElement('div', { className: 'absolute inset-0 bg-black/60' }),
                  React.createElement('div', { className: 'relative h-full flex flex-col justify-between p-8 text-white' },
                    React.createElement('h3', { className: 'text-2xl font-bold uppercase tracking-wider' }, category.title),
                    React.createElement('ul', { className: 'text-sm space-y-2 mt-4' },
                      category.programs.slice(0, 5).map(p => React.createElement('li', {key: p}, p))
                    )
                  )
                )
              );
            })
        ),
        React.createElement('button', { 
            onClick: goToPrevious, 
            'aria-label': 'Previous program',
            className: 'absolute top-1/2 left-0 md:-left-8 -translate-y-1/2 z-30 p-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-700 transition' 
        }, React.createElement(ChevronLeftIcon, { className: 'h-6 w-6' })),
        React.createElement('button', { 
            onClick: goToNext, 
            'aria-label': 'Next program',
            className: 'absolute top-1/2 right-0 md:-right-8 -translate-y-1/2 z-30 p-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-700 transition' 
        }, React.createElement(ChevronRightIcon, { className: 'h-6 w-6' }))
      )
    )
  );
};

// SpecializedPrograms Page Component
const SpecializedProgramsPage = ({ t }) => {
    const content = t.specializedPrograms;
    
    return React.createElement('main', { className: 'py-20 md:py-32 bg-slate-50 dark:bg-slate-900 pt-32' },
        React.createElement('div', { className: 'container mx-auto px-6' },
            React.createElement('h1', { className: 'text-4xl md:text-5xl font-bold text-center mb-16' }, content.title),
            React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' },
                content.categories.map((category, index) => React.createElement('div', {
                    key: index,
                    className: 'flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2'
                },
                    React.createElement('img', {
                        src: category.imageUrl,
                        alt: category.title,
                        className: 'w-full h-32 object-cover'
                    }),
                    React.createElement('div', { className: 'bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white text-center' },
                        React.createElement('h2', { className: 'font-bold uppercase tracking-wider text-sm' }, category.title)
                    ),
                    React.createElement('div', { className: 'p-6 flex-grow' },
                        React.createElement('ul', { className: 'space-y-3 text-sm text-light-text-secondary dark:text-dark-text-secondary' },
                            category.programs.map((program, i) => React.createElement('li', { key: i }, program))
                        )
                    )
                ))
            )
        )
    );
};

// Terms and Conditions Page Component
const TermsPage = ({ t }) => {
    const content = t.termsPage;
    
    return React.createElement('main', { className: 'bg-white dark:bg-slate-900 pt-32 pb-20' },
        React.createElement('div', { className: 'container mx-auto px-6 max-w-4xl' },
            React.createElement('h1', { className: 'text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text text-center mb-4' }, content.title),
            React.createElement('p', { className: 'text-center text-light-text-secondary dark:text-dark-text-secondary mb-12' }, content.lastUpdated),
            React.createElement('div', { className: 'space-y-8' },
                content.sections.map((section, index) => React.createElement('div', { key: index },
                    React.createElement('h2', { className: 'text-2xl font-bold text-light-text dark:text-dark-text mt-8 mb-4' }, section.title),
                    ...section.content.map((paragraph, pIndex) => React.createElement('p', { key: pIndex, className: 'text-light-text-secondary dark:text-dark-text-secondary leading-relaxed' }, paragraph))
                ))
            )
        )
    );
};

// Privacy Policy Page Component
const PrivacyPage = ({ t }) => {
    const content = t.privacyPage;
    
    return React.createElement('main', { className: 'bg-white dark:bg-slate-900 pt-32 pb-20' },
        React.createElement('div', { className: 'container mx-auto px-6 max-w-4xl' },
            React.createElement('h1', { className: 'text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text text-center mb-4' }, content.title),
            React.createElement('p', { className: 'text-center text-light-text-secondary dark:text-dark-text-secondary mb-12' }, content.lastUpdated),
            React.createElement('div', { className: 'space-y-8' },
                content.sections.map((section, index) => React.createElement('div', { key: index },
                    React.createElement('h2', { className: 'text-2xl font-bold text-light-text dark:text-dark-text mt-8 mb-4' }, section.title),
                    ...section.content.map((paragraph, pIndex) => React.createElement('p', { key: pIndex, className: 'text-light-text-secondary dark:text-dark-text-secondary leading-relaxed' }, paragraph))
                ))
            )
        )
    );
};

// Cookies Policy Page Component
const CookiesPage = ({ t }) => {
    const content = t.cookiesPage;
    
    return React.createElement('main', { className: 'bg-white dark:bg-slate-900 pt-32 pb-20' },
        React.createElement('div', { className: 'container mx-auto px-6 max-w-4xl' },
            React.createElement('h1', { className: 'text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text text-center mb-4' }, content.title),
            React.createElement('p', { className: 'text-center text-light-text-secondary dark:text-dark-text-secondary mb-12' }, content.lastUpdated),
            React.createElement('div', { className: 'space-y-8' },
                ...content.introduction.map((paragraph, pIndex) => React.createElement('p', { key: `intro-${pIndex}`, className: 'text-light-text-secondary dark:text-dark-text-secondary leading-relaxed' }, paragraph)),
                content.sections.map((section, index) => React.createElement('div', { key: index },
                    React.createElement('h2', { className: 'text-2xl font-bold text-light-text dark:text-dark-text mt-8 mb-4' }, section.title),
                    ...section.content.map((paragraph, pIndex) => React.createElement('p', { key: pIndex, className: 'text-light-text-secondary dark:text-dark-text-secondary leading-relaxed' }, paragraph))
                ))
            )
        )
    );
};


// AI Proficient Team Section
const AIProficientTeam = ({t}) => {
    return React.createElement('section', { id: 'strategic-partner', className: 'py-20 md:py-32 bg-gradient-to-b from-white to-slate-100 dark:from-black dark:to-slate-900' },
        React.createElement('div', { className: 'container mx-auto px-6' },
            React.createElement('div', { className: 'grid lg:grid-cols-2 gap-16 items-center' },
                React.createElement('div', {},
                    React.createElement('h2', { className: 'text-3xl md:text-5xl font-bold' }, t.aiProficientTitle),
                    React.createElement('p', { className: 'mt-6 text-lg text-light-text-secondary dark:text-dark-text-secondary' }, t.aiProficientSubtitle),
                    React.createElement('a', { href: GOOGLE_FORM_URL, target: '_blank', rel: 'noopener noreferrer', className: 'mt-8 inline-block bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-full transition-colors' }, t.aiProficientButton)
                ),
                React.createElement('div', { className: 'relative' },
                    React.createElement('img', {
                        src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
                        alt: 'A group of diverse professionals collaborating and learning together to achieve their career goals.',
                        className: 'rounded-2xl shadow-xl w-full h-full object-cover aspect-[4/3]'
                    }),
                    React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl' })
                )
            )
        )
    );
};

// Footer Component
const Footer = ({ t, onNavigateToSpecializedPrograms, onNavigateToServices, onNavigateToAbout, onNavigateToStrategicPartner, onNavigateToTerms, onNavigateToPrivacy, onNavigateToCookies }) => {
    const socialIcons = [XIcon, FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon];
    
    const createFooterLink = (linkText, action) => React.createElement('li', { key: linkText }, 
        React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); action(); }, className: 'text-blue-200 hover:text-white' }, linkText)
    );

    const solutionsLinks = t.footerLinks.solutions.map(link => {
        const action = link === t.navSpecializedPrograms ? onNavigateToSpecializedPrograms : onNavigateToServices;
        return createFooterLink(link, action);
    });
    
    const companyLinks = t.footerLinks.company.map((link, index) => {
        if (index === 0) { // About Us
            return createFooterLink(link, onNavigateToAbout);
        }
        if (index === 2) { // Partnerships
            return createFooterLink(link, onNavigateToStrategicPartner);
        }
        // Contact
        return React.createElement('li', { key: link }, React.createElement('a', { href: GOOGLE_FORM_URL, target: '_blank', rel: 'noopener noreferrer', className: 'text-blue-200 hover:text-white' }, link));
    });

    return React.createElement('footer', { id: 'contact', className: 'bg-gradient-to-r from-purple-600 to-blue-600 dark:bg-gradient-to-br dark:from-purple-900 dark:to-blue-900 text-white' },
        React.createElement('div', { className: 'container mx-auto px-6 py-16 text-center' },
            React.createElement('h2', { className: 'text-3xl md:text-5xl font-bold' }, t.footerTitle),
            React.createElement('p', { className: 'mt-4 max-w-3xl mx-auto text-blue-200' }, t.footerSubtitle),
            React.createElement('a', { href: GOOGLE_FORM_URL, target: '_blank', rel: 'noopener noreferrer', className: 'mt-8 inline-block bg-gradient-to-r from-amber-300 to-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full hover:shadow-lg hover:shadow-yellow-500/30 transition-shadow' }, t.startJourney)
        ),
        React.createElement('div', { className: 'container mx-auto px-6 py-16 border-t border-white/10' },
            React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm' },
                React.createElement('div', {},
                    React.createElement('h3', { className: 'font-bold' }, t.coursinity),
                    React.createElement('p', { className: 'mt-2 text-blue-200' }, t.coursinityDesc)
                ),
                React.createElement('div', {},
                    React.createElement('h3', { className: 'font-bold' }, t.solutions),
                    React.createElement('ul', { className: 'mt-4 space-y-2' }, solutionsLinks)
                ),
                React.createElement('div', {},
                    React.createElement('h3', { className: 'font-bold' }, t.company),
                     React.createElement('ul', { className: 'mt-4 space-y-2' }, companyLinks)
                ),
                React.createElement('div', {},
                    React.createElement('h3', { className: 'font-bold' }, t.contact),
                    React.createElement('ul', { className: 'mt-4 space-y-3' },
                        React.createElement('li', {}, 
                            React.createElement('a', { href: `mailto:${t.email}`, className: 'flex items-center gap-3 text-blue-200 hover:text-white' },
                                React.createElement(EnvelopeIcon, { className: 'h-5 w-5' }),
                                React.createElement('span', { className: 'font-mono' }, t.email)
                            )
                        ),
                        ...t.phone.map((phoneNumber, index) => React.createElement('li', { key: `phone-${index}` }, 
                            React.createElement('a', { href: `tel:${phoneNumber.replace(/\s/g, '')}`, className: 'flex items-center gap-3 text-blue-200 hover:text-white' },
                                React.createElement(PhoneIcon, { className: 'h-5 w-5' }),
                                React.createElement('span', { className: 'font-mono' }, phoneNumber)
                            )
                        ))
                    )
                )
            )
        ),
        React.createElement('div', { className: 'border-t border-white/10 py-6 dark:border-t-0 dark:bg-gradient-to-r dark:from-purple-950 dark:to-blue-900' },
            React.createElement('div', { className: 'container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm' },
                React.createElement('p', { className: 'text-blue-200' }, t.rights),
                React.createElement('div', {className: 'flex gap-4 mt-4 md:mt-0 text-blue-200'},
                    React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); onNavigateToTerms(); }, className: 'hover:text-white' }, t.terms),
                    React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); onNavigateToPrivacy(); }, className: 'hover:text-white' }, t.privacy),
                    React.createElement('a', { href: '#', onClick: (e) => { e.preventDefault(); onNavigateToCookies(); }, className: 'hover:text-white' }, t.cookies)
                ),
                React.createElement('div', { className: 'flex gap-4 mt-4 md:mt-0' },
                    socialIcons.map((Icon, index) => React.createElement('a', { key: index, href: '#', onClick: (e) => e.preventDefault(), className: 'text-blue-200 hover:text-white transition-colors cursor-default' }, React.createElement(Icon, { className: 'h-5 w-5' })))
                )
            )
        )
    );
};


// Main App Component
const App = () => {
  const [language, setLanguage] = useState(Language.EN);
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme');
    }
    return 'dark'; // Default to dark theme
  });
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
  }, [language]);

  const t = i18n[language];
  
  const handleNavigateHome = () => {
    if (currentPage === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentPage('home');
    }
  };
  
  const handleNavigateToServices = () => {
    setCurrentPage('home');
    setTimeout(() => {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleNavigateToSpecificService = (serviceId) => {
    setCurrentPage('home');
    setTimeout(() => {
      const element = document.getElementById(serviceId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  const handleNavigateToAbout = () => {
    setCurrentPage('home');
    setTimeout(() => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNavigateToStrategicPartner = () => {
    setCurrentPage('home');
    setTimeout(() => {
      const section = document.getElementById('strategic-partner');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNavigateToTerms = () => {
    setCurrentPage('terms');
  };

  const handleNavigateToPrivacy = () => {
    setCurrentPage('privacy');
  };
  
  const handleNavigateToCookies = () => {
    setCurrentPage('cookies');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return React.createElement('main', {},
          React.createElement(Hero, { t }),
          React.createElement(AboutUs, { t }),
          React.createElement(OurServices, { t }),
          React.createElement(SpecializedProgramsPreview, { t }),
          React.createElement(AIProficientTeam, { t }),
          React.createElement(Partners, { t }),
        );
      case 'specializedPrograms':
        return React.createElement(SpecializedProgramsPage, { t });
      case 'terms':
        return React.createElement(TermsPage, { t });
      case 'privacy':
        return React.createElement(PrivacyPage, { t });
      case 'cookies':
        return React.createElement(CookiesPage, { t });
      default:
        return null;
    }
  };


  return React.createElement('div', { className: "text-light-text dark:text-dark-text overflow-x-hidden" },
    React.createElement(Header, { 
        language, 
        setLanguage, 
        theme, 
        toggleTheme, 
        onNavigateHome: handleNavigateHome,
        onNavigateToSpecializedPrograms: () => setCurrentPage('specializedPrograms'),
        onNavigateToServices: handleNavigateToServices,
        onNavigateToSpecificService: handleNavigateToSpecificService
    }),
    
    renderCurrentPage(),

    React.createElement(Footer, { 
        t, 
        onNavigateToSpecializedPrograms: () => setCurrentPage('specializedPrograms'),
        onNavigateToServices: handleNavigateToServices,
        onNavigateToAbout: handleNavigateToAbout,
        onNavigateToStrategicPartner: handleNavigateToStrategicPartner,
        onNavigateToTerms: handleNavigateToTerms,
        onNavigateToPrivacy: handleNavigateToPrivacy,
        onNavigateToCookies: handleNavigateToCookies,
    })
  );
};

export default App;