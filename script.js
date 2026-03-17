// ============================================================
// CLÍNICA DENTAL MHG — v5.2 PREMIUM
// Custom cursor · GSAP hero · IntersectionObserver reveals
// Particles · Magnetic buttons · 3D card tilt
// ============================================================
(() => {
  'use strict';
  window.addEventListener('DOMContentLoaded', init);

  function init() {
    // — Phase 1: Immediate setups
    setupNav();
    setupMobile();
    setupMobileCTA();
    setupParticles();
    setupSmooth();
    setupCursor();

    // — Phase 2: Preloader → animations
    const pre = document.querySelector('.preloader');
    const PRELOADER_MS = 2000;

    if (pre) {
      setTimeout(() => {
        pre.classList.add('hidden');
        document.body.style.overflow = '';
        // After preloader hides, start everything
        setTimeout(() => {
          setupHero();
          setupScrollReveals(); // IntersectionObserver-based
          setupMagnetic();
          setup3DTilt();
        }, 100);
      }, PRELOADER_MS);
    } else {
      setupHero();
      setupScrollReveals();
      setupMagnetic();
      setup3DTilt();
    }
  }

  /* ═══ NAV ═══ */
  function setupNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ═══ MOBILE MENU ═══ */
  function setupMobile() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    function toggle(open) {
      menu.classList.toggle('open', open);
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    btn.addEventListener('click', () => toggle(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  }

  /* ═══ MOBILE STICKY CTA ═══ */
  function setupMobileCTA() {
    const cta = document.getElementById('mobile-sticky-cta');
    if (!cta || window.innerWidth > 768) return;

    let shown = false;
    window.addEventListener('scroll', () => {
      const shouldShow = window.scrollY > 400;
      if (shouldShow !== shown) {
        shown = shouldShow;
        cta.classList.toggle('visible', shouldShow);
      }
    }, { passive: true });
  }

  /* ═══ CUSTOM CURSOR ═══ */
  function setupCursor() {
    if (window.matchMedia('(pointer:coarse)').matches || window.innerWidth <= 1024) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const trail = document.querySelector('.cursor-trail');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    // Trail particles
    const trailParticles = [];
    const TRAIL_COUNT = 8;
    if (trail) {
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const tp = document.createElement('div');
        tp.className = 'trail-dot';
        const s = 4 - i * 0.4;
        tp.style.cssText = `width:${s}px;height:${s}px;opacity:${0.35 - i * 0.04};`;
        trail.appendChild(tp);
        trailParticles.push({ el: tp, x: -100, y: -100 });
      }
    }

    // Show cursor
    requestAnimationFrame(() => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Ring + trail animation loop
    function animate() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      let prevX = mouseX, prevY = mouseY;
      for (let i = 0; i < trailParticles.length; i++) {
        const tp = trailParticles[i];
        tp.x += (prevX - tp.x) * (0.25 - i * 0.02);
        tp.y += (prevY - tp.y) * (0.25 - i * 0.02);
        tp.el.style.left = tp.x + 'px';
        tp.el.style.top = tp.y + 'px';
        prevX = tp.x;
        prevY = tp.y;
      }

      requestAnimationFrame(animate);
    }
    animate();

    // Hover effects
    document.querySelectorAll('a, button, .svc, .why-card, .rev, .about-val').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('link-hover');
        dot.classList.add('link-hover');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('link-hover');
        dot.classList.remove('link-hover');
      });
    });

    document.querySelectorAll('img, .hero-img-wrap, .contact-map').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('expand'));
      el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
    });

    document.querySelectorAll('h1, h2, h3').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('text-hover');
        dot.classList.add('text-hover');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('text-hover');
        dot.classList.remove('text-hover');
      });
    });

    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button').forEach(el => el.style.cursor = 'none');
  }

  /* ═══ MAGNETIC BUTTONS (GSAP) ═══ */
  function setupMagnetic() {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.btn, .nav-cta, .fab-wa').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ═══ 3D CARD TILT (GSAP) ═══ */
  function setup3DTilt() {
    if (window.matchMedia('(pointer:coarse)').matches) return;
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.svc, .why-card, .rev').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateY: x * 10, rotateX: -y * 10,
          y: -4, scale: 1.02,
          duration: 0.3, ease: 'power2.out',
          transformPerspective: 800
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0, rotateX: 0, y: 0, scale: 1,
          duration: 0.6, ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  /* ═══ HERO PARTICLES ═══ */
  function setupParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const colors = [
      'rgba(43,168,200,0.35)', 'rgba(62,187,160,0.3)',
      'rgba(232,185,35,0.25)', 'rgba(91,196,222,0.2)'
    ];

    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 7 + 2;
      p.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        background:${colors[i % colors.length]};
        animation-duration:${Math.random() * 14 + 8}s;
        animation-delay:${Math.random() * 6}s;
      `;
      container.appendChild(p);
    }
  }

  /* ═══ HERO ANIMATIONS (GSAP — no ScrollTrigger needed) ═══ */
  function setupHero() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-badge', { opacity: 0, y: 25, duration: 0.7 }, 0)
      .from('h1', { opacity: 0, y: 50, duration: 1, ease: 'power4.out' }, 0.1)
      .from('.hero-p', { opacity: 0, y: 35, duration: 0.8 }, 0.3)
      .from('.hero-btns', { opacity: 0, y: 30, duration: 0.7 }, 0.45)
      .from('.hero-trust', { opacity: 0, y: 20, duration: 0.6 }, 0.6)
      .from('.hero-img-wrap', { opacity: 0, scale: 0.92, y: 30, duration: 1.1, ease: 'power4.out' }, 0.15)
      .from('.hero-float-badge', { opacity: 0, scale: 0.8, x: -20, duration: 0.7, ease: 'back.out(1.7)' }, 0.75);
  }

  /* ═══════════════════════════════════════════════════════════
     SCROLL REVEALS — IntersectionObserver (NO GSAP ScrollTrigger)
     Reliable, works with all scroll methods, no position bugs
     ═══════════════════════════════════════════════════════════ */
  function setupScrollReveals() {
    // All elements that should reveal on scroll get class "reveal"
    // They start with CSS opacity:0 + translateY via .reveal
    // When observed, they get .revealed → CSS transition shows them

    const revealTargets = [
      // Staggered groups: { selector, stagger (ms between items) }
      { selector: '.svc', stagger: 80 },
      { selector: '.why-card', stagger: 100 },
      { selector: '.rev', stagger: 120 },
      { selector: '.ci', stagger: 80 },
      { selector: '.about-val', stagger: 60 },
      // Single elements
      { selector: '.sec-intro' },
      { selector: '.about-img-main' },
      { selector: '.about-img-small' },
      { selector: '.about-float' },
      { selector: '.about-content' },
      { selector: '.rev-google' },
      { selector: '.cta-inner' },
      { selector: '.contact-map' },
      { selector: '.marquee-section' },
      { selector: '.footer-top' },
    ];

    // Add .reveal class to all targets
    revealTargets.forEach(({ selector }) => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('reveal');
      });
    });

    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Check if this element is part of a stagger group
          const delay = parseInt(el.dataset.revealDelay || '0');
          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    // Observe all elements, set stagger delays for groups
    revealTargets.forEach(({ selector, stagger }) => {
      const els = document.querySelectorAll(selector);
      els.forEach((el, i) => {
        if (stagger) {
          el.dataset.revealDelay = String(i * stagger);
        }
        observer.observe(el);
      });
    });
  }

  /* ═══ SMOOTH ANCHORS ═══ */
  function setupSmooth() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const navH = document.getElementById('nav')?.offsetHeight || 0;
          const pos = target.getBoundingClientRect().top + window.scrollY - navH - 20;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });
  }

})();
