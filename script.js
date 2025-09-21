// Enhanced JavaScript for Q9 Portfolio Website
document.addEventListener('DOMContentLoaded', function() {
    // Typing effect for hero section
    const typingText = document.getElementById('typing-text');
    const cursor = document.getElementById('cursor');
    const heroDescription = document.getElementById('hero-description');
    const mainBtn = document.getElementById('main-btn');
    const themeToggle = document.getElementById('theme-toggle');

    // Typing animation
    const text = "Exploring creativity through gaming, coding, and academics.";
    let index = 0;

    function typeText() {
        if (index < text.length) {
            typingText.textContent = text.slice(0, index + 1);
            index++;
            setTimeout(typeText, 100);
        } else {
            // Hide cursor and show description after typing
            setTimeout(() => {
                cursor.style.display = 'none';
                heroDescription.style.display = 'block';
            }, 1000);
        }
    }

    // Start typing animation
    typeText();

    // Discover More button functionality
    mainBtn.addEventListener('click', function() {
        document.getElementById('about').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounters() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 20);
        });
    }

    // Trigger counter animation when about section is visible
    const aboutSection = document.getElementById('about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(aboutSection);

    // Loading screen
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 2000);
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
