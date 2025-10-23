// Modern Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initThemeToggle();
    initScrollAnimations();
    initParticles();
    initTypingEffect();
    initSmoothScrolling();
    initScrollIndicator();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// Enhanced scroll animations with slide effects
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50px 0px', // Trigger when element is more in view
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay based on element position
                setTimeout(() => {
                    entry.target.classList.add('visible', 'animated');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Setup About Me section animations
    setupAboutAnimations();
    
    // Setup Experience section animations
    setupExperienceAnimations();
    
    // Setup Project page animations
    setupProjectAnimations();
    
    // Setup JavaCard Binary Parser animations
    setupJavaCardAnimations();
    
    // Setup Projects list page
    setupProjectsListPage();
    
    // Observe general elements for animation
    const animateElements = document.querySelectorAll('.fade-in, .animate-on-scroll, .skill-item, .timeline-item, .project-card, .contact-item');
    
    animateElements.forEach((el, index) => {
        observer.observe(el);
    });
}

// Setup specific animations for About Me section
function setupAboutAnimations() {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;
    
    // Add animation classes to about section elements
    const aboutCards = aboutSection.querySelectorAll('.about-card');
    const aboutStats = aboutSection.querySelectorAll('.stat-item');
    const sectionHeader = aboutSection.querySelector('.section-header');
    
    // Animate section header
    if (sectionHeader) {
        sectionHeader.classList.add('slide-in-up', 'animate-delay-1');
    }
    
    // Animate about cards with alternating slide directions
    aboutCards.forEach((card, index) => {
        if (index % 2 === 0) {
            card.classList.add('slide-in-left', `animate-delay-${index + 2}`);
        } else {
            card.classList.add('slide-in-right', `animate-delay-${index + 2}`);
        }
    });
    
    // Animate stats with slide up effect
    aboutStats.forEach((stat, index) => {
        stat.classList.add('slide-in-up', `animate-delay-${index + 3}`);
    });
    
    // Create enhanced observer for about section
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger all about section animations
                const animatedElements = aboutSection.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 150);
                });
                
                // Start stats counter animation
                setTimeout(() => {
                    // Trigger stats counter for elements that haven't been animated yet
                    const statNumbers = aboutSection.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        if (!stat.dataset.animated) {
                            stat.dataset.animated = 'true';
                            const finalNumber = stat.textContent;
                            const isPlus = finalNumber.includes('+');
                            const numericValue = parseInt(finalNumber.replace('+', ''));
                            
                            let currentNumber = 0;
                            const increment = numericValue / 50;
                            
                            const timer = setInterval(() => {
                                currentNumber += increment;
                                if (currentNumber >= numericValue) {
                                    currentNumber = numericValue;
                                    clearInterval(timer);
                                }
                                stat.textContent = Math.floor(currentNumber) + (isPlus ? '+' : '');
                            }, 40);
                        }
                    });
                }, 500);
                
                // Disconnect observer after animation
                aboutObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    });
    
    aboutObserver.observe(aboutSection);
}

// Setup specific animations for Experience section
function setupExperienceAnimations() {
    const experienceSection = document.querySelector('.experience');
    if (!experienceSection) return;
    
    // Get elements to animate
    const sectionHeader = experienceSection.querySelector('.section-header');
    const timelineItems = experienceSection.querySelectorAll('.timeline-item');
    
    // Add animation classes to section header
    if (sectionHeader) {
        sectionHeader.classList.add('slide-in-up', 'animate-delay-1');
    }
    
    // Add animation classes to timeline items with alternating directions
    timelineItems.forEach((item, index) => {
        if (index % 2 === 0) {
            // Even items slide in from left
            item.classList.add('slide-in-left', `animate-delay-${index + 2}`);
        } else {
            // Odd items slide in from right
            item.classList.add('slide-in-right', `animate-delay-${index + 2}`);
        }
    });
    
    // Create observer for experience section
    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger all experience section animations
                const animatedElements = experienceSection.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 200);
                });
                
                // Animate timeline items with special effects
                const timelineItems = experienceSection.querySelectorAll('.timeline-item');
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('timeline-fade-in', 'visible');
                        
                        // Animate tech stack items
                        const techStackItems = item.querySelectorAll('.tech-stack span');
                        techStackItems.forEach((tech, techIndex) => {
                            setTimeout(() => {
                                tech.style.opacity = '0';
                                tech.style.transform = 'translateY(20px)';
                                tech.style.transition = 'all 0.3s ease';
                                
                                setTimeout(() => {
                                    tech.style.opacity = '1';
                                    tech.style.transform = 'translateY(0)';
                                }, techIndex * 50);
                            }, 200);
                        });
                    }, (index + 1) * 400);
                });
                
                // Disconnect observer after animation
                experienceObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    experienceObserver.observe(experienceSection);
}

// Setup animations for project pages
function setupProjectAnimations() {
    // Project hero animations
    const projectHero = document.querySelector('.project-hero');
    if (projectHero) {
        const heroElements = projectHero.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
        
        // Animate hero elements on page load
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 200 + 300);
        });
    }
    
    // Project content animations
    const projectBody = document.querySelector('.project-body');
    if (projectBody) {
        const contentElements = projectBody.querySelectorAll('h1, h2, h3, p, img, figure, .embed-container, blockquote, ul, ol');
        
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'all 0.6s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    contentObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        contentElements.forEach(element => {
            contentObserver.observe(element);
        });
    }
    
    // Back to projects button animation
    const backToProjects = document.querySelector('.back-to-projects-content');
    if (backToProjects) {
        const backObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    backObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        backObserver.observe(backToProjects);
    }
}

// Particle background effect
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.3';
    
    hero.appendChild(canvas);
    
    let particles = [];
    const particleCount = 50;
    
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.y > canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = canvas.height;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            ctx.fill();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.hypot(particle.x - otherParticle.x, particle.y - otherParticle.y);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    resizeCanvas();
    createParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}

// Typing effect for hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const texts = [
        'Secure Embedded Software Developer',
        'Embedded Operating System Developer',
        'Secure Firmware & Low-Level Driver Developer', 
        'Tech Enthusiast & Innovator',
        'Technical Leader'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    // Optimized timing for smooth effect
    const typeSpeed = 75;        // Smooth typing speed
    const deleteSpeed = 35;      // Fast deletion
    const pauseTime = 2500;      // Long pause to read text
    const waitTime = 300;        // Brief wait before deleting
    
    // Set initial text immediately to prevent empty state
    subtitle.textContent = texts[0];
    charIndex = texts[0].length;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isWaiting) {
            isWaiting = false;
            isDeleting = true;
            setTimeout(typeText, waitTime);
            return;
        }
        
        if (!isDeleting) {
            // Typing phase
            charIndex++;
            subtitle.textContent = currentText.slice(0, charIndex);
            
            if (charIndex >= currentText.length) {
                // Finished typing - wait before deleting
                isWaiting = true;
                setTimeout(typeText, pauseTime);
                return;
            }
        } else {
            // Deleting phase
            charIndex--;
            subtitle.textContent = currentText.slice(0, Math.max(0, charIndex));
            
            if (charIndex <= 0) {
                // Finished deleting - move to next text
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                charIndex = 0;
            }
        }
        
        // Continue animation with appropriate speed
        const nextDelay = isDeleting ? deleteSpeed : typeSpeed;
        setTimeout(typeText, nextDelay);
    }
    
    // Start typing effect after page settles
    setTimeout(() => {
        charIndex = 0; // Reset to start typing from beginning
        typeText();
    }, 1200);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll progress indicator
function initScrollIndicator() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

// Skill items hover effect
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Enhanced Project card cursor-following animation
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add necessary elements for enhanced effects
        if (!card.querySelector('.card-glow')) {
            const glow = document.createElement('div');
            glow.classList.add('card-glow');
            card.appendChild(glow);
        }
        
        card.addEventListener('mouseenter', (e) => {
            card.style.transition = 'none';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Enhanced tilt calculation with stronger effect
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;
            
            // Calculate cursor position as percentage
            const cursorXPercent = (x / rect.width) * 100;
            const cursorYPercent = (y / rect.height) * 100;
            
            // Apply 3D transform with cursor following
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px)
                scale(1.02)
            `;
            
            // Update glow position to follow cursor
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.background = `radial-gradient(circle 150px at ${cursorXPercent}% ${cursorYPercent}%, 
                    rgba(0, 212, 255, 0.3), 
                    rgba(78, 205, 196, 0.2), 
                    transparent 70%)`;
                glow.style.opacity = '1';
            }
            
            // Add shimmer effect to images
            const img = card.querySelector('.project-image img');
            if (img) {
                img.style.filter = `brightness(1.1) contrast(1.1)`;
            }
            
            // Enhance shadow based on cursor position
            const shadowX = (x - centerX) / 10;
            const shadowY = (y - centerY) / 10;
            card.style.boxShadow = `
                ${shadowX}px ${shadowY + 20}px 40px rgba(0, 0, 0, 0.2),
                0 0 20px rgba(0, 212, 255, 0.1)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
            
            const img = card.querySelector('.project-image img');
            if (img) {
                img.style.filter = 'none';
            }
        });
    });
});

// Stats counter animation (used outside About section)
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number:not(.about .stat-number)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = entry.target;
                target.dataset.animated = 'true';
                const finalNumber = target.textContent;
                const isPlus = finalNumber.includes('+');
                const numericValue = parseInt(finalNumber.replace('+', ''));
                
                let currentNumber = 0;
                const increment = numericValue / 50;
                
                const timer = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= numericValue) {
                        currentNumber = numericValue;
                        clearInterval(timer);
                    }
                    target.textContent = Math.floor(currentNumber) + (isPlus ? '+' : '');
                }, 40);
                
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Initialize stats counter when DOM is ready (excluding About section stats)
document.addEventListener('DOMContentLoaded', initStatsCounter);

// Initialize skill level animations
function initSkillLevels() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target;
                const level = skillLevel.getAttribute('data-level') + '%';
                skillLevel.style.setProperty('--level', level);
                observer.unobserve(skillLevel);
            }
        });
    });
    
    skillLevels.forEach(skill => observer.observe(skill));
}

// Initialize skill levels when DOM is ready
document.addEventListener('DOMContentLoaded', initSkillLevels);

// Contact form handling (if you add a contact form later)
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add form submission logic here
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        form.reset();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Easter egg - Konami code
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konami)) {
        showNotification('🎉 Easter egg found! You discovered the Konami code!', 'success');
        konamiCode = [];
        
        // Add some fun animation
        document.body.style.animation = 'rainbow 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Setup Projects List Page functionality
function setupProjectsListPage() {
    // Projects hero animations
    const projectsHero = document.querySelector('.projects-hero');
    if (projectsHero) {
        const heroElements = projectsHero.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
        
        // Animate hero elements on page load
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 300 + 500);
        });
        
        // Animate stats counter
        const statNumbers = projectsHero.querySelectorAll('.stat-number');
        setTimeout(() => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current);
                }, 40);
            });
        }, 1000);
    }
    
    // Project cards animation on scroll
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        const cardsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    cardsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        projectCards.forEach(card => {
            cardsObserver.observe(card);
        });
    }
    
    // Filter functionality
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projects = document.querySelectorAll('.project-card[data-category]');
    
    if (filterTabs.length > 0 && projects.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.dataset.filter;
                
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Filter projects
                projects.forEach(project => {
                    const category = project.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        project.classList.remove('filtered-out');
                        project.classList.add('filtered-in');
                        project.style.display = 'block';
                    } else {
                        project.classList.remove('filtered-in');
                        project.classList.add('filtered-out');
                        setTimeout(() => {
                            if (project.classList.contains('filtered-out')) {
                                project.style.display = 'none';
                            }
                        }, 300);
                    }
                });
                
                // Re-trigger animation for visible cards
                setTimeout(() => {
                    const visibleCards = document.querySelectorAll('.project-card:not(.filtered-out)');
                    visibleCards.forEach((card, index) => {
                        card.style.animationDelay = `${index * 0.1}s`;
                    });
                }, 350);
            });
        });
    }
}

// Setup JavaCard Binary Parser specific animations
function setupJavaCardAnimations() {
    const componentCards = document.querySelectorAll('.component-card');
    const componentRows = document.querySelectorAll('.component-row');
    const usageSteps = document.querySelectorAll('.usage-step');
    const benefitItems = document.querySelectorAll('.benefit-item');
    
    if (componentCards.length === 0 && componentRows.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Animate component cards
    componentCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.95)';
        card.style.transition = `all 0.8s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Animate component rows
    componentRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-30px)';
        row.style.transition = `all 0.7s ease ${index * 0.2}s`;
        observer.observe(row);
    });

    // Animate usage steps
    usageSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = `all 0.6s ease ${index * 0.3}s`;
        observer.observe(step);
    });

    // Animate benefit items
    benefitItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) scale(0.9)';
        item.style.transition = `all 0.8s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Add CSS class for completed animations
    const style = document.createElement('style');
    style.textContent = `
        .component-card.animate-in,
        .component-row.animate-in,
        .usage-step.animate-in,
        .benefit-item.animate-in {
            opacity: 1 !important;
            transform: translate(0) scale(1) !important;
        }
    `;
    document.head.appendChild(style);
}
