// ============================================================
// CLÍNICA DENTAL MHG — v5 PREMIUM
// Custom cursor · Lenis smooth scroll · GSAP animations
// Particles · Magnetic buttons · 3D card tilt
// ============================================================
(() => {
  'use strict';
  window.addEventListener('DOMContentLoaded', init);

  function init() {
    gsap.registerPlugin(ScrollTrigger);
    setupPreloader();
    setupNav();
    setupMobile();
    setupMobileCTA();
    setupHero();
    setupParticles();
    setupReveals();
    setupSmooth();
    setupCursor();
    setupMagnetic();
    setup3DTilt();
  }

  /* ═══ PRELOADER ═══ */
  function setupPreloader() {
    const pre = document.querySelector('.preloader');
    if (!pre) return;
    // Hide after bar animation completes
    setTimeout(() => {
      pre.classList.add('hidden');
      // Start hero animations after preloader
      document.body.style.overflow = '';
    }, 2200);
  }

  /* ═══ NAV ═══ */
  function setupNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 50);
      lastScroll = y;
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
    // Only on non-touch devices
    if (window.matchMedia('(pointer:coarse)').matches || window.innerWidth <= 1024) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    // Show cursor elements
    requestAnimationFrame(() => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    // Ring follows with smooth lag
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effects on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .svc, .why-card, .rev, .about-val');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('link-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('link-hover'));
    });

    // Expand on images
    document.querySelectorAll('img, .hero-img-wrap, .contact-map').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('expand'));
      el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
    });

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button').forEach(el => {
      el.style.cursor = 'none';
    });
  }

  /* ═══ MAGNETIC BUTTONS ═══ */
  function setupMagnetic() {
    if (window.matchMedia('(pointer:coarse)').matches) return;

    document.querySelectorAll('.btn, .nav-cta, .fab-wa').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(.34,1.56,.64,1)';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });
  }

  /* ═══ 3D CARD TILT ═══ */
  function setup3DTilt() {
    if (window.matchMedia('(pointer:coarse)').matches) return;

    document.querySelectorAll('.svc, .why-card, .rev').forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.style.perspective = '800px';

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `
          perspective(800px)
          rotateY(${x * 8}deg)
          rotateX(${-y * 8}deg)
          translateY(-4px)
          scale(1.02)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(.22,1,.36,1)';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });
    });
  }

  /* ═══ HERO PARTICLES ═══ */
  function setupParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const colors = ['rgba(43,168,200,0.3)', 'rgba(62,187,160,0.25)', 'rgba(232,185,35,0.2)'];

    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        background:${colors[i % colors.length]};
        animation-duration:${Math.random() * 12 + 10}s;
        animation-delay:${Math.random() * 8}s;
      `;
      container.appendChild(p);
    }
  }

  /* ═══ HERO ANIMATIONS ═══ */
  function setupHero() {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: 2.2 // After preloader
    });

    tl.from('.hero-badge', { opacity: 0, y: 25, duration: 0.7 }, 0)
      .from('h1', {
        opacity: 0, y: 50, duration: 1,
        ease: 'power4.out'
      }, 0.1)
      .from('.hero-p', { opacity: 0, y: 35, duration: 0.8 }, 0.35)
      .from('.hero-btns', { opacity: 0, y: 30, duration: 0.7 }, 0.5)
      .from('.hero-trust', { opacity: 0, y: 20, duration: 0.6 }, 0.65)
      .from('.hero-img-wrap', {
        opacity: 0, scale: 0.92, y: 30,
        duration: 1.1, ease: 'power4.out'
      }, 0.2)
      .from('.hero-float-badge', {
        opacity: 0, scale: 0.8, x: -20,
        duration: 0.7, ease: 'back.out(1.7)'
      }, 0.8);
  }

  /* ═══ SCROLL REVEALS ═══ */
  function setupReveals() {
    // Section intros with split feel
    gsap.utils.toArray('.sec-intro').forEach(el => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
      const label = el.querySelector('.label');
      const h2 = el.querySelector('h2');
      const p = el.querySelector('p');
      if (label) tl.from(label, { opacity: 0, y: 15, duration: 0.5 }, 0);
      if (h2) tl.from(h2, { opacity: 0, y: 30, duration: 0.7 }, 0.1);
      if (p) tl.from(p, { opacity: 0, y: 20, duration: 0.6 }, 0.25);
    });

    // Service cards — staggered cascade
    const svcCards = gsap.utils.toArray('.svc');
    if (svcCards.length) {
      gsap.from(svcCards, {
        y: 50, opacity: 0, duration: 0.7,
        stagger: { each: 0.1, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-grid', start: 'top 85%' }
      });
    }

    // Why cards — staggered from center
    const whyCards = gsap.utils.toArray('.why-card');
    if (whyCards.length) {
      gsap.from(whyCards, {
        y: 45, opacity: 0, duration: 0.7,
        stagger: { each: 0.12, from: 'center' },
        ease: 'power3.out',
        scrollTrigger: { trigger: '.why-grid', start: 'top 85%' }
      });
    }

    // About section — cinematic reveal
    const aboutGrid = document.querySelector('.about-grid');
    if (aboutGrid) {
      const atl = gsap.timeline({
        scrollTrigger: { trigger: '.about-grid', start: 'top 75%' }
      });
      atl.from('.about-img-main', { scale: 0.88, opacity: 0, duration: 1, ease: 'power3.out' })
         .from('.about-img-small', { x: 50, y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.15)
         .from('.about-float', { scale: 0.7, opacity: 0, duration: 0.7, ease: 'back.out(2)' }, 0.35)
         .from('.about-content .label', { opacity: 0, x: -20, duration: 0.5 }, 0.2)
         .from('.about-content h2', { opacity: 0, y: 30, duration: 0.7 }, 0.3)
         .from('.about-content p', { opacity: 0, y: 20, duration: 0.6, stagger: 0.1 }, 0.4);

      // About values
      gsap.from('.about-val', {
        y: 25, opacity: 0, duration: 0.5,
        stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-values', start: 'top 90%' }
      });
    }

    // Reviews — staggered slide up
    const revCards = gsap.utils.toArray('.rev');
    if (revCards.length) {
      gsap.from(revCards, {
        y: 50, opacity: 0, duration: 0.8,
        stagger: { each: 0.15 },
        ease: 'power3.out',
        scrollTrigger: { trigger: '.rev-grid', start: 'top 85%' }
      });
    }

    // Google badge
    gsap.from('.rev-google', {
      y: 20, opacity: 0, duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.rev-google', start: 'top 92%' }
    });

    // CTA section
    gsap.from('.cta-inner', {
      y: 50, opacity: 0, scale: 0.97, duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.sec-cta', start: 'top 80%' }
    });

    // Contact cards — staggered slide in
    const ciCards = gsap.utils.toArray('.ci');
    if (ciCards.length) {
      gsap.from(ciCards, {
        x: -30, opacity: 0, duration: 0.6,
        stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-list', start: 'top 88%' }
      });
    }

    // Map
    gsap.from('.contact-map', {
      scale: 0.94, opacity: 0, duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-map', start: 'top 85%' }
    });

    // Marquee
    gsap.from('.marquee-section', {
      opacity: 0, duration: 0.8,
      scrollTrigger: { trigger: '.marquee-section', start: 'top 95%' }
    });

    // Footer
    gsap.from('.footer-top', {
      y: 25, opacity: 0, duration: 0.6,
      scrollTrigger: { trigger: 'footer[role="contentinfo"]', start: 'top 92%' }
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
