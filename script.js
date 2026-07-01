document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Scroll-reveal animations ---------- */
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');

        const groupSelectors = ['.games-grid', '.about-details', '.skills-json', '.explore-list'];
        if (groupSelectors.some(sel => entry.target.matches(sel))) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            if (child.matches('.game-card, .detail-item, .json-group, li')) {
              setTimeout(() => child.classList.add('animate'), index * 90);
            }
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(
    '.file-header, .code-block, .games-grid, .about-details, .skills-json, .explore-list'
  ).forEach(el => observer.observe(el));

  /* ---------- Navbar hide-on-scroll ---------- */
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
  });

  /* ---------- Tab nav: click to scroll + active state on scroll ---------- */
  const tabs = document.querySelectorAll('.tab[href^="#"]');
  const sections = Array.from(tabs).map(tab => document.querySelector(tab.getAttribute('href')));

  tabs.forEach(tab => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
      }
      document.getElementById('nav-menu').classList.remove('active');
      document.getElementById('nav-toggle').classList.remove('active');
    });
  });

  window.addEventListener('scroll', function () {
    let current = sections[0];
    sections.forEach(section => {
      if (section && window.pageYOffset >= section.offsetTop - 120) current = section;
    });
    tabs.forEach(tab => {
      tab.classList.toggle('active', current && tab.getAttribute('href') === '#' + current.id);
    });
  });

  /* ---------- Mobile tab toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  /* ---------- Loading screen ---------- */
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    const hideLoadingScreen = function () {
      loadingScreen.style.opacity = '0';
      setTimeout(() => { loadingScreen.style.display = 'none'; }, 400);
    };
    window.addEventListener('load', () => setTimeout(hideLoadingScreen, 700));
    setTimeout(hideLoadingScreen, 4000);
  }

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.querySelector('#theme-toggle');
  if (themeToggle) {
    const applyIcon = () => {
      const icon = themeToggle.querySelector('i');
      icon.className = document.body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
    };

    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('light-theme');
      applyIcon();
      localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    });

    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-theme');
    applyIcon();
  }

  /* ---------- Typing effect ---------- */
  const typingText = document.getElementById('typing-text');
  if (typingText) {
    const messages = [
      'Solving problems through code, one system at a time.',
      'Exploring frontend, backend, and everything between.',
      'Currently building, breaking, and learning.'
    ];

    let mIndex = 0, cIndex = 0, deleting = false;

    const type = function () {
      const msg = messages[mIndex];
      if (!deleting) {
        typingText.textContent = msg.substring(0, cIndex + 1);
        cIndex++;
        if (cIndex === msg.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, 55);
      } else {
        typingText.textContent = msg.substring(0, cIndex - 1);
        cIndex--;
        if (cIndex === 0) {
          deleting = false;
          mIndex = (mIndex + 1) % messages.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 30);
      }
    };

    setTimeout(type, 1200);
  }

  /* ---------- Scroll indicator + discover button ---------- */
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
    });
    window.addEventListener('scroll', () => {
      scrollIndicator.style.opacity = window.pageYOffset > 100 ? '0' : '1';
    });
  }

  const discoverMoreBtn = document.getElementById('main-btn');
  if (discoverMoreBtn) {
    discoverMoreBtn.addEventListener('click', () => {
      document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ===================================================================
     Contact form — Firebase submission with layered anti-spam safeguards
  =================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const formLoadedAt = Date.now();

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const check = performSecurityChecks();

      if (!check.allowed) {
        if (check.silent) {
          // Honeypot tripped — fake a normal success so bots don't adapt, but skip Firebase entirely.
          showNotification('Message sent successfully!', 'success');
          contactForm.reset();
        } else {
          showNotification(check.message, 'error');
          if (formStatus) formStatus.textContent = check.message;
        }
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>sending…</span> <i class="fas fa-circle-notch fa-spin"></i>';
      submitBtn.disabled = true;
      if (formStatus) formStatus.textContent = '';

      try {
        await submitMessage();
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        cacheSubmission();
      } catch (error) {
        console.error('Submission failed:', error);
        showNotification('Something went wrong. Please try again.', 'error');
      } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    });
  }

  function performSecurityChecks() {
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    const honeypot = document.getElementById('website');

    // 1. Honeypot — real visitors never see or fill this field.
    if (honeypot && honeypot.value.trim() !== '') {
      return { allowed: false, silent: true };
    }

    // 2. Time-trap — bots tend to submit instantly, humans take a few seconds.
    if (Date.now() - formLoadedAt < 3000) {
      return { allowed: false, message: 'Please take a moment before sending.' };
    }

    // 3. Basic spam-pattern filter.
    const spamPatterns = [
      /<script|javascript:|data:|vbscript:/i,
      /http[s]?:\/\/[^\s]*/i,
      /\b(viagra|casino|poker|lottery|crypto|bitcoin|nft)\b/i,
      /(.)\1{10,}/
    ];
    for (const pattern of spamPatterns) {
      if (pattern.test(name + ' ' + message)) {
        return { allowed: false, message: 'Message contains suspicious content.' };
      }
    }

    if (!name || !message) {
      return { allowed: false, message: 'Please fill out both fields.' };
    }

    // 4. Cooldown between any two submissions.
    const now = Date.now();
    const lastSubmission = parseInt(localStorage.getItem('lastContactSubmission') || '0', 10);
    if (lastSubmission && (now - lastSubmission) < 30000) {
      return { allowed: false, message: 'Please wait a moment before sending another message.' };
    }

    // 5. Hourly submission cap.
    const windowStart = parseInt(localStorage.getItem('submissionWindowStart') || '0', 10);
    let count = parseInt(localStorage.getItem('submissionCount') || '0', 10);
    if (!windowStart || (now - windowStart) > 3600000) {
      localStorage.setItem('submissionWindowStart', String(now));
      count = 0;
    }
    if (count >= 5) {
      return { allowed: false, message: 'Too many messages sent recently. Please try again later.' };
    }

    // 6. Block exact duplicate messages sent again within 10 minutes.
    const fingerprint = hashText(name + '|' + message);
    const cachedFingerprint = localStorage.getItem('lastMessageFingerprint');
    const cachedAt = parseInt(localStorage.getItem('lastMessageFingerprintAt') || '0', 10);
    if (cachedFingerprint === fingerprint && (now - cachedAt) < 600000) {
      return { allowed: false, message: "You've already sent this message." };
    }

    return { allowed: true };
  }

  function cacheSubmission() {
    const now = Date.now();
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    localStorage.setItem('lastContactSubmission', String(now));

    const count = parseInt(localStorage.getItem('submissionCount') || '0', 10);
    localStorage.setItem('submissionCount', String(count + 1));
    if (!localStorage.getItem('submissionWindowStart')) {
      localStorage.setItem('submissionWindowStart', String(now));
    }

    localStorage.setItem('lastMessageFingerprint', hashText(name + '|' + message));
    localStorage.setItem('lastMessageFingerprintAt', String(now));
  }

  function hashText(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return String(hash);
  }

  async function submitMessage() {
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    let recaptchaToken = null;
    const recaptchaApi = (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise)
      ? grecaptcha.enterprise
      : (typeof grecaptcha !== 'undefined' ? grecaptcha : null);

    if (recaptchaApi) {
      try {
        recaptchaToken = await new Promise((resolve, reject) => {
          recaptchaApi.ready(() => {
            recaptchaApi.execute('6LfenNErAAAAAN8PVNwE5GoWnlcTDj5Xvhbi6HqW', { action: 'contact' })
              .then(resolve)
              .catch(reject);
          });
        });
      } catch (err) {
        console.warn('reCAPTCHA check failed, sending without it:', err);
      }
    }

    if (typeof db !== 'undefined') {
      await db.collection('contacts').add({
        name: name,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        read: false,
        recaptchaToken: recaptchaToken
      });
    }
  }

  function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Dismiss"><i class="fas fa-times"></i></button>
      </div>
    `;
    notification.querySelector('.notification-close').addEventListener('click', () => notification.remove());

    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed; top: 20px; right: 20px; z-index: 10000;
          max-width: 360px; border-radius: 8px;
          font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          animation: slideInRight 0.3s ease-out;
        }
        .notification-success { background: #1B1D24; border: 1px solid #89D185; color: #89D185; }
        .notification-error { background: #1B1D24; border: 1px solid #E8697D; color: #E8697D; }
        .notification-info { background: #1B1D24; border: 1px solid #7C9EFF; color: #7C9EFF; }
        .notification-content { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.1rem; gap: 0.75rem; }
        .notification-close { background: none; border: none; color: inherit; cursor: pointer; opacity: 0.7; }
        .notification-close:hover { opacity: 1; }
        @keyframes slideInRight { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }
});