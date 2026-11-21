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

  /* Project Case-Study Modal */
  var PROJECTS = {
    sdo: {
      idx: 'PROJECT 01',
      title: 'Appointment-System-SDO-Navotas',
      url: 'sdo-navotasappointments.netlify.app',
      live: 'https://sdo-navotasappointments.netlify.app/',
      img: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fsdo-navotasappointments.netlify.app%2F?w=800&h=450',
      role: 'Role: Frontend & Admin Dashboard UI',
      problem: 'Walk-in queues and manual appointment scheduling created bottlenecks and unclear slot availability for visitors coordinating with SDO Navotas.',
      solution: 'Designed a step-by-step online booking interface paired with a structured administrator view for managing schedules, tracking appointments, and exporting records cleanly.',
      stack: ['HTML5', 'CSS3', 'JavaScript', 'Cloud Backend', 'Netlify', 'Responsive UI']
    },
    loafys: {
      idx: 'PROJECT 02',
      title: "LOAFY'S HUNGARIAN ROLL",
      url: 'loafyhungarianroll.netlify.app',
      live: 'https://loafyhungarianroll.netlify.app/',
      img: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Floafyhungarianroll.netlify.app%2F?w=800&h=450',
      role: 'Role: Web Design & Frontend Development',
      problem: 'The business needed an accessible digital storefront to showcase menu offerings and brand identity beyond scattered social media posts.',
      solution: 'Built a fast, mobile-first promotional site with clear visual hierarchy, appetizing product presentation, and direct ordering/inquiry pathways.',
      stack: ['HTML5', 'CSS3', 'JavaScript', 'Visual Graphic Design', 'Netlify']
    },
    smolmoonva: {
      idx: 'PROJECT 03',
      title: 'SMOLMOONVA-SITE',
      url: 'smolmoonva-site.netlify.app',
      live: 'https://smolmoonva-site.netlify.app/',
      img: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fsmolmoonva-site.netlify.app%2F?w=800&h=450',
      role: 'Role: UI/UX & Personal Brand Site',
      problem: 'Needed a cohesive personal hub that reflects a distinct visual aesthetic while keeping navigation effortless across desktop and mobile screens.',
      solution: 'Crafted a custom-styled personal brand website focusing on typography, balanced negative space, and smooth responsive layouts.',
      stack: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX Design', 'Netlify']
    },
    vaultscript: {
      idx: 'PROJECT 04',
      title: 'VAULTSCRIPT',
      url: 'vaultscripts.vercel.app',
      live: 'https://vaultscripts.vercel.app/',
      img: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fvaultscripts.vercel.app%2F?w=800&h=450',
      role: 'Role: Full-Stack Web App & Deployment',
      problem: 'Creators needed a streamlined, secure portal to configure credentials and manage protected script links without a cluttered workflow.',
      solution: 'Co-developed a dark-themed web portal hosted on Vercel with authenticated user flows, clean form validation, and fast edge delivery.',
      stack: ['HTML/CSS/JS', 'Firebase Auth', 'Vercel', 'API Routes', 'Dark UI']
    },
    quantum: {
      idx: 'CONTRIBUTION 05',
      title: '[Q]uantum — Game Contributor & QA Tester',
      url: 'roblox.com/communities/36030195/Q-uantum',
      live: 'https://www.roblox.com/communities/36030195/Q-uantum#!/about',
      img: 'assets/quantum.webp',
      role: 'Role: Contributor Rank & Pre-Release QA Tester',
      problem: 'High-traffic Roblox experiences (8.8M+ visits, 18.3K+ community members) require thorough pre-release testing to catch gameplay bugs, UI edge cases, and balance issues before public updates.',
      solution: 'Collaborated with the development team under the official Contributor Rank to stress-test mechanics, report reproducible bugs, and verify UI/gameplay polish across live updates.',
      stack: ['QA & Bug Reproduction', 'Roblox Studio / Client', 'Pre-Release Testing', '8.8M+ Visits', '18.3K+ Members']
    }
  };

  var pmodal = d.getElementById('pmodal');
  var pmClose = d.getElementById('pm-close');
  var lastTrigger = null;

  function openProjectModal(key, triggerEl) {
    var data = PROJECTS[key];
    if (!pmodal || !data) return;

    lastTrigger = triggerEl || d.activeElement;

    d.getElementById('pm-idx').textContent = data.idx;
    d.getElementById('pm-title').textContent = data.title;
    d.getElementById('pm-url').textContent = data.url;
    d.getElementById('pm-problem').textContent = data.problem;
    d.getElementById('pm-solution').textContent = data.solution;
    d.getElementById('pm-role').textContent = data.role;

    var liveLink = d.getElementById('pm-live');
    liveLink.href = data.live;

    var pmImg = d.getElementById('pm-img');
    pmImg.classList.remove('loaded');
    pmImg.style.display = '';
    pmImg.alt = 'Preview of ' + data.title;
    pmImg.src = data.img;

    var pmTags = d.getElementById('pm-tags');
    pmTags.innerHTML = '';
    data.stack.forEach(function(tag) {
      var span = d.createElement('span');
      span.textContent = tag;
      pmTags.appendChild(span);
    });

    d.body.style.overflow = 'hidden';
    if (typeof pmodal.showModal === 'function') {
      pmodal.showModal();
    } else {
      pmodal.setAttribute('open', '');
    }
  }

  function closeProjectModal() {
    if (!pmodal) return;
    if (typeof pmodal.close === 'function') {
      pmodal.close();
    } else {
      pmodal.removeAttribute('open');
    }
    d.body.style.overflow = '';
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  if (pmodal) {
    d.querySelectorAll('.proj[data-project]').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.closest('a.demo')) return;
        openProjectModal(card.getAttribute('data-project'), card.querySelector('.details-btn'));
      });
    });

    if (pmClose) {
      pmClose.addEventListener('click', closeProjectModal);
    }

    pmodal.addEventListener('click', function(e) {
      if (e.target === pmodal) {
        closeProjectModal();
      }
    });

    pmodal.addEventListener('close', function() {
      d.body.style.overflow = '';
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus();
      }
    });
  }

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

  /* Netlify Contact Form */
  if (form && status && send) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      status.className = '';
      status.textContent = 'Sending...';

      send.disabled = true;
      send.setAttribute('aria-busy', 'true');

      var body = new URLSearchParams(new FormData(form)).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      })
      .then(function(response) {
        if (!response.ok) throw new Error('Form submission failed');
        status.className = 'ok';
        status.textContent = 'Message sent. Thank you!';
        form.reset();
      })
      .catch(function() {
        status.className = 'err';
        status.textContent = 'Could not send. Please try again or message me on a social link.';
      })
      .then(function() {
        send.disabled = false;
        send.removeAttribute('aria-busy');
      });
    });
  }
})();