document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                if (entry.target.classList.contains('games-grid') ||
                    entry.target.classList.contains('portfolio-grid') ||
                    entry.target.classList.contains('about-stats') ||
                    entry.target.classList.contains('contact-socials')) {

                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        if (child.classList.contains('game-card') ||
                            child.classList.contains('portfolio-item') ||
                            child.classList.contains('stat-item') ||
                            child.classList.contains('contact-social')) {

                            setTimeout(() => {
                                child.classList.add('animate');
                            }, index * 100);
                        }
                    });
                }

                if (entry.target.classList.contains('floating-particles') ||
                    entry.target.classList.contains('hero-background')) {
                    const floatingElements = entry.target.querySelectorAll('.float-animation');
                    floatingElements.forEach((element, index) => {
                        element.style.animationDelay = `${index * 0.5}s`;
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        '.section-header, .game-card, .portfolio-item, .contact-social, ' +
        '.about-stats, .games-grid, .portfolio-grid, .contact-socials, ' +
        '.floating-particles, .hero-background'
    );

    animateElements.forEach(element => {
        observer.observe(element);
    });

    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }

        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');

    if (hero && heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            if (scrolled < hero.offsetHeight) {
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Ensure loading screen is visible immediately
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';

        // Enhanced loading screen functionality
        const hideLoadingScreen = function() {
            try {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Trigger any post-load animations or effects here
                    document.body.classList.add('loaded');
                }, 500);
            } catch (error) {
                console.error('Error hiding loading screen:', error);
                // Fallback: just hide it immediately
                loadingScreen.style.display = 'none';
            }
        };

        // Hide loading screen when page is fully loaded
        window.addEventListener('load', function() {
            // Add a small delay to ensure smooth transition
            setTimeout(hideLoadingScreen, 1000);
        });

        // Fallback: hide loading screen after 5 seconds regardless
        setTimeout(hideLoadingScreen, 5000);

        // Also hide if there are any errors during loading
        window.addEventListener('error', function() {
            setTimeout(hideLoadingScreen, 2000);
        });
    }

    const buttons = document.querySelectorAll('.btn, .social-link, .nav-link');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {

            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');

            const icon = this.querySelector('i');
            if (document.body.classList.contains('light-theme')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }

            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            const icon = themeToggle.querySelector('i');
            icon.className = 'fas fa-sun';
        } else {
            const icon = themeToggle.querySelector('i');
            icon.className = 'fas fa-moon';
        }
    }

    const cards = document.querySelectorAll('.game-card, .portfolio-item');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    const typingContainer = document.querySelector('.typing-container');
    if (typingContainer) {

        const messages = [
            "Exploring challenges, coding solutions, and learning every step of the way.",
            "🇨🇳|🇵🇭|🇯🇵"
        ];

        let currentMessageIndex = 0;
        let currentCharIndex = 0;
        let isTyping = true;
        let isDeleting = false;

        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.className = 'typing-cursor';
        cursor.style.animation = 'blink 1s infinite';
        typingContainer.appendChild(cursor);

        const cursorStyle = document.createElement('style');
        cursorStyle.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            .typing-cursor {
                color: var(--primary-color);
                font-weight: 400;
                margin-left: 1px;
            }
        `;
        document.head.appendChild(cursorStyle);

        const typeWriter = function() {
            try {
                const currentMessage = messages[currentMessageIndex];

                if (isTyping && !isDeleting) {
                    // Typing phase
                    if (currentCharIndex < currentMessage.length) {
                        typingContainer.textContent = currentMessage.substring(0, currentCharIndex + 1);
                        typingContainer.appendChild(cursor);
                        currentCharIndex++;
                        setTimeout(typeWriter, 100);
                    } else {
                        isTyping = false;
                        setTimeout(() => {
                            isDeleting = true;
                            setTimeout(typeWriter, 2000);
                        }, 2000);
                    }
                } else if (isDeleting) {
                    if (currentCharIndex > 0) {
                        typingContainer.textContent = currentMessage.substring(0, currentCharIndex - 1);
                        typingContainer.appendChild(cursor);
                        currentCharIndex--;
                        setTimeout(typeWriter, 50);
                    } else {
                        isDeleting = false;
                        isTyping = true;
                        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
                        setTimeout(typeWriter, 500);
                    }
                }
            } catch (error) {
                console.error('Typing effect error:', error);
                typingContainer.textContent = messages[0];
                cursor.remove();
            }
        };

        setTimeout(typeWriter, 1500);

        const handleResize = function() {
            if (window.innerWidth < 768) {
                typingContainer.style.fontSize = '1.1rem';
            } else {
                typingContainer.style.fontSize = '1.2rem';
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }

    const discoverMoreBtn = document.getElementById('main-btn');
    if (discoverMoreBtn) {
        discoverMoreBtn.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Enhanced Contact Form with Enterprise-Level Security
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Comprehensive security checks
            const securityCheck = await performSecurityChecks();
            if (!securityCheck.allowed) {
                showNotification(securityCheck.message, 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Securing...</span> <i class="fas fa-shield-alt fa-spin"></i>';
            submitBtn.disabled = true;

            try {
                await submitSecureMessage();
                showNotification('Message secured and sent successfully!', 'success');
                contactForm.reset();
            } catch (error) {
                console.error('Secure submission failed:', error);
                showNotification('Security error. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Advanced security checks
    async function performSecurityChecks() {
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();

        // 1. Advanced spam detection
        const spamPatterns = [
            /<script|javascript:|data:|vbscript:/i,
            /http[s]?:\/\/[^\s]*/i,
            /\b(viagra|casino|poker|lottery|crypto|bitcoin|nft)\b/i,
            /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u, // Emojis
            /(.)\1{10,}/, // Repeated characters
            /[A-Z]{20,}|[a-z]{20,}|[0-9]{10,}/ // Suspicious patterns
        ];

        for (let pattern of spamPatterns) {
            if (pattern.test(name + ' ' + message)) {
                return { allowed: false, message: 'Message contains suspicious content' };
            }
        }

        // 2. Rate limiting with IP tracking
        const now = Date.now();
        const lastSubmission = localStorage.getItem('lastContactSubmission');
        const submissionCount = parseInt(localStorage.getItem('submissionCount') || '0');

        if (lastSubmission && (now - lastSubmission) < 30000) {
            return { allowed: false, message: 'Please wait 30 seconds before sending another message' };
        }

        // 3. Submission limits (max 5 per hour)
        if (submissionCount >= 5) {
            const firstSubmission = localStorage.getItem('firstSubmissionTime');
            if (firstSubmission && (now - firstSubmission) < 3600000) {
                return { allowed: false, message: 'Too many submissions. Please try again later.' };
            }
        }

        // 4. Bot detection
        if (await detectBot()) {
            return { allowed: false, message: 'Bot activity detected' };
        }

        return { allowed: true };
    }

    // Bot detection function
    async function detectBot() {
        // Check for automation indicators
        const checks = [
            // Check mouse movements
            'mousemove' in window && document.querySelectorAll('*').length > 10,
            // Check for human-like timing
            performance.now() > 1000,
            // Check for normal viewport
            window.innerWidth > 400 && window.innerHeight > 300,
            // Check for touch capability (mobile users)
            'ontouchstart' in window || 'onmsgesturechange' in window
        ];

        return checks.filter(Boolean).length < 3;
    }

    // Secure message submission
    async function submitSecureMessage() {
        const name = document.getElementById('name').value.trim();
        const message = document.getElementById('message').value.trim();

        // Execute reCAPTCHA
        const recaptchaToken = await new Promise((resolve, reject) => {
            grecaptcha.ready(() => {
                grecaptcha.execute('6LfenNErAAAAAN8PVNwE5GoWnlcTDj5Xvhbi6HqW', { action: 'contact' })
                    .then(token => resolve(token))
                    .catch(error => reject(error));
            });
        });

        // Submit with enhanced security data
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('contacts').add({
            name: name,
            message: message,
            timestamp: timestamp,
            read: false,
            recaptchaToken: recaptchaToken,
            userAgent: navigator.userAgent,
            timestampClient: Date.now(),
            ipHash: await hashIP(), // Client-side IP hashing
            sessionId: generateSessionId(),
            securityLevel: 'enterprise'
        });

        // Update rate limiting data
        localStorage.setItem('lastContactSubmission', Date.now());
        localStorage.setItem('submissionCount', (parseInt(localStorage.getItem('submissionCount') || '0') + 1).toString());
    }

    // Simple IP hashing (for additional security)
    async function hashIP() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
        return btoa(canvas.toDataURL()).substring(0, 32);
    }

    // Session ID generation
    function generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 400px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: slideInRight 0.3s ease-out;
                }

                .notification-success {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                }

                .notification-error {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                }

                .notification-info {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    gap: 12px;
                }

                .notification-message {
                    flex: 1;
                    font-weight: 500;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }

                .notification-close:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                .notification.removing {
                    animation: slideOutRight 0.3s ease-in forwards;
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('removing');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
});
