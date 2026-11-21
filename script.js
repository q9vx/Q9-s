(function(){
  'use strict';

  var d = document;
  var root = d.documentElement;

  var loader = d.getElementById('loader');
  var loaderFill = d.getElementById('loader-fill');
  var loaderPct = d.getElementById('loader-pct');
  var loaderTxt = d.getElementById('loader-txt');

  var hdr = d.querySelector('header.nav');
  var progress = d.getElementById('scroll-progress');
  var btn = d.querySelector('.menu-btn');
  var menu = d.getElementById('menu');
  var year = d.getElementById('yr');
  var form = d.getElementById('cform');
  var status = d.getElementById('fstatus');
  var send = d.getElementById('send');

  // Force full animation support (avoids Windows OS "Animation Effects Off" from freezing all website animations)
  var reduceMotion = false;
  var isPointerFine = !('ontouchstart' in window) || (window.matchMedia && window.matchMedia('(hover: hover)').matches);

  /* Hero Staggered Entrance */
  function startHeroEntrance() {
    var heroItems = d.querySelectorAll('.hero-enter');
    if (reduceMotion) {
      heroItems.forEach(function(el) { el.classList.add('in'); });
      return;
    }
    heroItems.forEach(function(el, i) {
      setTimeout(function() {
        el.classList.add('in');
      }, 60 + i * 110);
    });
  }

  /* Boot Loading Screen */
  if (loader && !reduceMotion) {
    d.body.classList.add('loading');
    var pct = 0;
    var finished = false;

    function finishLoader() {
      if (finished) return;
      finished = true;
      if (loaderFill) loaderFill.style.width = '100%';
      if (loaderPct) loaderPct.textContent = '100%';
      if (loaderTxt) loaderTxt.textContent = 'ready';

      setTimeout(function() {
        loader.classList.add('done');
        d.body.classList.remove('loading');
        startHeroEntrance();
        setTimeout(function() {
          if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 700);
      }, 220);
    }

    var tick = setInterval(function() {
      pct += Math.floor(Math.random() * 14) + 8;
      if (pct >= 92) {
        pct = 92;
        clearInterval(tick);
      }
      if (loaderFill) loaderFill.style.width = pct + '%';
      if (loaderPct) loaderPct.textContent = pct + '%';
      if (loaderTxt && pct > 50) loaderTxt.textContent = 'loading assets';
    }, 90);

    window.addEventListener('load', function() {
      clearInterval(tick);
      setTimeout(finishLoader, 250);
    });

    setTimeout(function() {
      clearInterval(tick);
      finishLoader();
    }, 1800);
  } else {
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
    startHeroEntrance();
  }

  /* Interactive Ambient Particle Canvas */
  (function initCanvas() {
    var cvs = d.getElementById('bg-canvas');
    if (!cvs || reduceMotion) return;
    var ctx = cvs.getContext('2d');
    if (!ctx) return;

    var w = 0;
    var h = 0;
    var particles = [];
    var mouse = { x: -1000, y: -1000, radius: 140 };
    var animId = null;
    var isRunning = true;

    function resize() {
      w = cvs.width = window.innerWidth;
      h = cvs.height = window.innerHeight;
      createParticles();
    }

    function createParticles() {
      particles = [];
      var count = Math.min(Math.floor((w * h) / 28000), 55);
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.6 + 0.8,
          alpha: Math.random() * 0.45 + 0.2,
          color: Math.random() > 0.4 ? 'rgba(168, 85, 247,' : 'rgba(216, 180, 254,'
        });
      }
    }

    function update() {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          var force = (1 - dist / mouse.radius) * 1.5;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var djx = p.x - p2.x;
          var djy = p.y - p2.y;
          var djj = Math.sqrt(djx * djx + djy * djy);
          if (djj < 105) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(168, 85, 247,' + (0.12 * (1 - djj / 105)) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      if (isRunning) {
        animId = requestAnimationFrame(update);
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    if (isPointerFine) {
      window.addEventListener('pointermove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }, { passive: true });
      window.addEventListener('pointerleave', function() {
        mouse.x = -1000;
        mouse.y = -1000;
      }, { passive: true });
    }

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animId = requestAnimationFrame(update);
        }
      }
    });

    animId = requestAnimationFrame(update);
  })();

  /* Footer Year */
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* Header & Scroll Progress Bar */
  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    if (hdr) {
      hdr.classList.toggle('scrolled', scrollY > 12);
    }
    if (progress) {
      var docHeight = d.documentElement.scrollHeight - window.innerHeight;
      var ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      progress.style.transform = 'scaleX(' + ratio + ')';
    }
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* Mobile Navigation */
  function setMenu(open) {
    if (!menu || !btn) return;
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }

  if (btn && menu) {
    btn.addEventListener('click', function() {
      setMenu(btn.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function(e) {
      if (e.target.closest('a')) {
        setMenu(false);
      }
    });

    d.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        setMenu(false);
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth > 760) {
        setMenu(false);
      }
    }, { passive: true });
  }

  /* Cursor Spotlight & Subtle 3D Card Tilt */
  if (isPointerFine && !reduceMotion) {
    d.querySelectorAll('.spotlight').forEach(function(el) {
      el.addEventListener('pointermove', function(e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        el.style.setProperty('--mx', x + 'px');
        el.style.setProperty('--my', y + 'px');

        if (el.hasAttribute('data-tilt')) {
          var px = (x / rect.width) - 0.5;
          var py = (y / rect.height) - 0.5;
          var rotateX = (-py * 6).toFixed(2);
          var rotateY = (px * 6).toFixed(2);
          el.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
        }
      });

      el.addEventListener('pointerleave', function() {
        el.style.setProperty('--mx', '-1000px');
        el.style.setProperty('--my', '-1000px');
        if (el.hasAttribute('data-tilt')) {
          el.style.transform = '';
        }
      });
    });
  }

  /* Magnetic Button Hover Pull */
  if (isPointerFine && !reduceMotion) {
    d.querySelectorAll('.btn, .details-btn, .copy-pill').forEach(function(el) {
      el.addEventListener('pointermove', function(e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - (rect.left + rect.width / 2);
        var y = e.clientY - (rect.top + rect.height / 2);
        var pullX = (x * 0.22).toFixed(2);
        var pullY = (y * 0.22).toFixed(2);
        el.style.transform = 'translate(' + pullX + 'px, ' + pullY + 'px)';
      });
      el.addEventListener('pointerleave', function() {
        el.style.transform = '';
      });
    });
  }

  /* Sliding Nav Capsule Indicator */
  var navIndicator = d.querySelector('.nav-indicator');
  var navMenu = d.getElementById('menu');

  function moveIndicatorTo(el) {
    if (!navIndicator || !navMenu || !el) {
      if (navIndicator) navIndicator.classList.remove('active');
      return;
    }
    var menuRect = navMenu.getBoundingClientRect();
    var rect = el.getBoundingClientRect();
    navIndicator.style.width = rect.width + 'px';
    navIndicator.style.height = rect.height + 'px';
    navIndicator.style.transform = 'translate(' + (rect.left - menuRect.left) + 'px, ' + (rect.top - menuRect.top) + 'px)';
    navIndicator.classList.add('active');
  }

  function updateActiveNav() {
    if (!navMenu) return;
    var activeLink = navMenu.querySelector('a.link.active');
    if (activeLink) {
      moveIndicatorTo(activeLink);
    } else if (navIndicator) {
      navIndicator.classList.remove('active');
    }
  }

  if (navIndicator && navMenu && isPointerFine) {
    navMenu.querySelectorAll('a.link').forEach(function(a) {
      a.addEventListener('pointerenter', function() {
        moveIndicatorTo(a);
      });
    });

    navMenu.addEventListener('pointerleave', function() {
      updateActiveNav();
    });

    window.addEventListener('resize', updateActiveNav, { passive: true });
    setTimeout(updateActiveNav, 300);
  }

  /* Active Navigation Link & Scroll Reveal */
  var links = Array.prototype.slice.call(d.querySelectorAll('a.link'));
  var sections = links.map(function(a) {
    return d.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          links.forEach(function(a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
          updateActiveNav();
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function(section) {
      sectionObserver.observe(section);
    });

    if (!reduceMotion) {
      var revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

      d.querySelectorAll('.rv').forEach(function(el) {
        var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [];
        var revealSiblings = siblings.filter(function(node) {
          return node.classList && node.classList.contains('rv');
        });
        var index = Math.max(0, revealSiblings.indexOf(el));
        el.style.setProperty('--rv-delay', Math.min(index * 100, 400) + 'ms');
        revealObserver.observe(el);
      });
    } else {
      d.querySelectorAll('.rv').forEach(function(el) {
        el.classList.add('in');
      });
    }
  } else {
    root.classList.add('js-off');
    d.querySelectorAll('.rv').forEach(function(el) {
      el.classList.add('in');
    });
  }

  /* Animated Stats Counter */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var isDecimal = target % 1 !== 0;
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = isDecimal ? (ease * target).toFixed(1) : Math.floor(ease * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  var bento = d.querySelector('.stats-bento');
  if (bento && 'IntersectionObserver' in window && !reduceMotion) {
    var bentoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        bento.querySelectorAll('.stat-num[data-count]').forEach(function(numEl) {
          animateCounter(numEl);
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    bentoObserver.observe(bento);
  } else if (bento) {
    bento.querySelectorAll('.stat-num[data-count]').forEach(function(numEl) {
      numEl.textContent = numEl.getAttribute('data-count') + (numEl.getAttribute('data-suffix') || '');
    });
  }

  /* Hero Role Typewriter */
  var roleEl = d.getElementById('role-typed');
  if (roleEl && !reduceMotion) {
    var roles = [
      'Frontend Developer',
      'Full-Stack Developer',
      'UI/UX Enthusiast',
      'Game QA Contributor'
    ];
    var rIdx = 0;
    var cIdx = roles[0].length;
    var deleting = true;

    function stepRole() {
      var current = roles[rIdx];
      if (!deleting) {
        cIdx++;
        roleEl.textContent = current.slice(0, cIdx);
        if (cIdx === current.length) {
          deleting = true;
          setTimeout(stepRole, 1900);
          return;
        }
        setTimeout(stepRole, 65);
      } else {
        cIdx--;
        roleEl.textContent = current.slice(0, cIdx);
        if (cIdx === 0) {
          deleting = false;
          rIdx = (rIdx + 1) % roles.length;
          setTimeout(stepRole, 320);
          return;
        }
        setTimeout(stepRole, 35);
      }
    }
    setTimeout(stepRole, 2200);
  }

  /* Direct Project Links on Card Click */
  d.querySelectorAll('.proj[data-project]').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('a.demo')) return;
      var demoLink = card.querySelector('a.demo');
      if (demoLink && demoLink.href) {
        window.open(demoLink.href, '_blank', 'noopener');
      }
    });
  });

  /* Copy-to-Clipboard Pills & Purple Toast */
  var toast = d.getElementById('toast');
  var toastMsg = d.getElementById('toast-msg');
  var toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      toast.classList.remove('show');
    }, 2400);
  }

  function copyText(text, onDone) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onDone).catch(function() {
        fallbackCopy(text, onDone);
      });
    } else {
      fallbackCopy(text, onDone);
    }
  }

  function fallbackCopy(text, onDone) {
    var ta = d.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    d.body.appendChild(ta);
    ta.select();
    try { d.execCommand('copy'); } catch (e) {}
    d.body.removeChild(ta);
    if (onDone) onDone();
  }

  d.querySelectorAll('.copy-pill[data-copy]').forEach(function(pill) {
    pill.addEventListener('click', function() {
      var val = pill.getAttribute('data-copy');
      var label = pill.getAttribute('data-label') || 'Text';
      copyText(val, function() {
        pill.classList.add('copied');
        showToast(label + ' "' + val + '" copied to clipboard!');
        setTimeout(function() {
          pill.classList.remove('copied');
        }, 1200);
      });
    });
  });

  /* Cache Cleaner Utility & Hard-Refresh System */
  var cacheBtn = d.getElementById('cache-clean-btn');

  function purgeSiteCache() {
    showToast('Purging site cache and storage...');
    try {
      if ('caches' in window) {
        caches.keys().then(function(names) {
          names.forEach(function(name) {
            caches.delete(name);
          });
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          registrations.forEach(function(r) {
            r.unregister();
          });
        });
      }
      sessionStorage.clear();
      var securityCooldown = localStorage.getItem('last_contact_submit');
      localStorage.clear();
      if (securityCooldown) {
        localStorage.setItem('last_contact_submit', securityCooldown);
      }
    } catch (e) {
      console.warn('Cache purge info:', e);
    }

    setTimeout(function() {
      var cleanUrl = window.location.origin + window.location.pathname + '?cb=' + Date.now() + window.location.hash;
      window.location.replace(cleanUrl);
    }, 400);
  }

  if (cacheBtn) {
    cacheBtn.addEventListener('click', purgeSiteCache);
  }

  d.addEventListener('keydown', function(e) {
    if ((e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
        (e.altKey && (e.key === 'C' || e.key === 'c'))) {
      e.preventDefault();
      purgeSiteCache();
    }
  });

  /* Anti-Bot, Anti-DDoS Rate Limiter & Firebase Form Handler */
  if (form && status && send) {
    var COOLDOWN_SECONDS = 20; // 20-second anti-spam flood protection
    var lastSubmitKey = 'last_contact_submit';

    function checkCooldown() {
      var lastSubmit = parseInt(localStorage.getItem(lastSubmitKey) || '0', 10);
      var elapsed = Math.floor((Date.now() - lastSubmit) / 1000);
      if (elapsed < COOLDOWN_SECONDS) {
        var remaining = COOLDOWN_SECONDS - elapsed;
        send.disabled = true;
        status.className = '';
        status.textContent = 'Anti-spam active: please wait ' + remaining + 's before sending another message.';
        var timer = setInterval(function() {
          remaining--;
          if (remaining <= 0) {
            clearInterval(timer);
            send.disabled = false;
            status.textContent = '';
          } else {
            status.textContent = 'Anti-spam active: please wait ' + remaining + 's before sending another message.';
          }
        }, 1000);
        return true;
      }
      return false;
    }

    checkCooldown();

    function withTimeout(promise, ms) {
      return Promise.race([
        promise,
        new Promise(function(_, reject) {
          setTimeout(function() {
            reject(new Error('Operation timed out after ' + ms + 'ms'));
          }, ms);
        })
      ]);
    }

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // 1. Anti-Spam Rate Limiting Check
      var lastSubmit = parseInt(localStorage.getItem(lastSubmitKey) || '0', 10);
      var elapsed = Math.floor((Date.now() - lastSubmit) / 1000);
      if (elapsed < COOLDOWN_SECONDS) {
        status.className = 'err';
        status.textContent = 'Anti-spam active: please wait ' + (COOLDOWN_SECONDS - elapsed) + 's.';
        return;
      }

      // 2. Honeypot Trap Check (silent fake-success to misdirect bots)
      var botField = form.querySelector('[name="bot-field"]');
      if (botField && botField.value.trim() !== '') {
        status.className = 'ok';
        status.textContent = 'Message sent. Thank you!';
        form.reset();
        return;
      }

      // 3. Extract & Validate Form Inputs
      var nameInput = d.getElementById('name');
      var emailInput = d.getElementById('email');
      var messageInput = d.getElementById('message');

      var rawName = nameInput ? nameInput.value.trim() : '';
      var rawEmail = emailInput ? emailInput.value.trim() : '';
      var rawMessage = messageInput ? messageInput.value.trim() : '';

      var cleanName = rawName.replace(/[<>]/g, '').slice(0, 100);
      var cleanEmail = rawEmail.replace(/[<>]/g, '').slice(0, 100);
      var cleanMessage = rawMessage.replace(/[<>]/g, '').slice(0, 2000);

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!cleanName || cleanName.length < 1) {
        status.className = 'err';
        status.textContent = 'Please enter your name.';
        return;
      }
      if (!emailRegex.test(cleanEmail)) {
        status.className = 'err';
        status.textContent = 'Please enter a valid email address.';
        return;
      }
      if (!cleanMessage || cleanMessage.length < 2) {
        status.className = 'err';
        status.textContent = 'Please enter your message.';
        return;
      }

      // 4. Generate reCAPTCHA Enterprise Token (with 2.5s timeout)
      var recaptchaToken = null;
      if (window.grecaptcha && window.grecaptcha.enterprise && typeof window.grecaptcha.enterprise.execute === 'function') {
        try {
          recaptchaToken = await withTimeout(window.grecaptcha.enterprise.execute('6LfenNErAAAAAN8PVNwE5GoWnlcTDj5Xvhbi6HqW', { action: 'contact_submit' }), 2500);
        } catch (rcErr) {
          console.warn('reCAPTCHA notice:', rcErr);
        }
      }

      status.className = '';
      status.textContent = 'Sending message securely...';
      send.disabled = true;
      send.setAttribute('aria-busy', 'true');

      var savedToFirebase = false;
      var lastFbError = null;

      // 5. Save to Firebase Firestore (with 3s timeout)
      if (window.firebaseServices && window.firebaseServices.db) {
        var db = window.firebaseServices.db;
        var contactPayload = {
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          read: false
        };
        if (recaptchaToken) {
          contactPayload.recaptchaToken = recaptchaToken;
        }

        try {
          await withTimeout(db.collection('contacts').add(contactPayload), 3000);
          savedToFirebase = true;
          console.log('✅ Contact submission saved to Firestore contacts collection');
        } catch (fbErr) {
          lastFbError = fbErr;
          console.warn('Firestore primary write notice:', fbErr);

          // Fallback schema attempt (in case published console rules omit email or recaptchaToken)
          try {
            var fallbackPayload = {
              name: cleanName,
              message: cleanMessage + ' [Reply: ' + cleanEmail + ']',
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              read: false
            };
            if (recaptchaToken) fallbackPayload.recaptchaToken = recaptchaToken;
            await withTimeout(db.collection('contacts').add(fallbackPayload), 2500);
            savedToFirebase = true;
            console.log('✅ Contact submission saved using fallback schema');
          } catch (fbFallbackErr) {
            lastFbError = fbFallbackErr || fbErr;
            console.warn('Firestore fallback write notice:', fbFallbackErr);
          }
        }
      }

      // 6. Dual-Post to Netlify Form (with 3.5s timeout)
      var formData = new URLSearchParams(new FormData(form));
      formData.set('name', cleanName);
      formData.set('email', cleanEmail);
      formData.set('message', cleanMessage);
      if (recaptchaToken) formData.set('recaptcha-token', recaptchaToken);

      try {
        var res = await withTimeout(fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        }), 3500);

        if (res.ok || savedToFirebase) {
          status.className = 'ok';
          status.textContent = 'Message sent successfully! Thank you.';
          form.reset();
          localStorage.setItem(lastSubmitKey, Date.now().toString());
          checkCooldown();
        } else {
          throw new Error('Form submission response not ok');
        }
      } catch (postErr) {
        if (savedToFirebase) {
          status.className = 'ok';
          status.textContent = 'Message sent successfully! Thank you.';
          form.reset();
          localStorage.setItem(lastSubmitKey, Date.now().toString());
          checkCooldown();
        } else {
          status.className = 'err';
          var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
          if (lastFbError && lastFbError.code === 'permission-denied') {
            status.textContent = 'Firestore rules blocked creation. Please paste the updated firestore.rules in Firebase Console.';
          } else if (isLocal && !window.firebaseServices) {
            status.textContent = 'Local preview: Netlify forms require a live site. Reach out on Discord (@q9vx).';
          } else {
            status.textContent = 'Could not send message. Please reach out via Discord (@q9vx) or GitHub.';
          }
          console.error('Submission diagnostic:', { firebaseError: lastFbError, netlifyError: postErr });
          send.disabled = false;
        }
      } finally {
        send.removeAttribute('aria-busy');
      }
    });
  }
})();