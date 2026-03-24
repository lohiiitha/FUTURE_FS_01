/* ============================================================
   PORTFOLIO — SCRIPT.JS
   Scroll reveal · Sticky nav · Mobile menu · Skill bars
   ============================================================ */

'use strict';

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Shorthand for document.querySelector
 * @param {string} selector
 * @param {Document|Element} [root=document]
 */
const $ = (selector, root = document) => root.querySelector(selector);

/**
 * Shorthand for document.querySelectorAll (returns array)
 * @param {string} selector
 * @param {Document|Element} [root=document]
 */
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];


/* ============================================================
   1. STICKY NAVBAR
   Adds .scrolled class when page scrolls past a threshold,
   enabling the glass background effect defined in CSS.
   ============================================================ */
(function initStickyNav() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const THRESHOLD = 60; // px from top before activating glass bg

  function onScroll() {
    if (window.scrollY > THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on page load
})();


/* ============================================================
   2. ACTIVE NAV LINK ON SCROLL
   Highlights the nav link matching the visible section.
   ============================================================ */
(function initActiveNavHighlight() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const NAV_HEIGHT = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '68',
    10
  );

  function updateActive() {
    // Find the section whose top edge is closest to (and above) nav bottom
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY >= sectionTop - NAV_HEIGHT - 40) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


/* ============================================================
   3. MOBILE HAMBURGER MENU
   Toggles the mobile drawer open/closed.
   ============================================================ */
(function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobileLinks = $$('.mobile-link');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when a mobile link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
})();


/* ============================================================
   4. SCROLL REVEAL ANIMATIONS
   Uses IntersectionObserver to animate .reveal elements into
   view with a configurable per-element delay via data-delay.
   ============================================================ */
(function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        // Unobserve after animation to save resources
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   5. SKILL BAR ANIMATIONS
   Animates proficiency bars to their target width when they
   scroll into view.
   ============================================================ */
(function initSkillBars() {
  const bars = $$('.skill-bar-fill');
  if (!bars.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bars.forEach(bar => {
      bar.style.width = (bar.dataset.width || '0') + '%';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        // Short delay so the reveal animation finishes first
        setTimeout(() => {
          bar.style.width = (bar.dataset.width || '0') + '%';
        }, 300);
        observer.unobserve(bar);
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => observer.observe(bar));
})();


/* ============================================================
   6. BACK TO TOP BUTTON
   Shows the button when scrolled past the hero, hides it
   when back at the top.
   ============================================================ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  const SHOW_AFTER = 400; // px scrolled before showing

  function onScroll() {
    btn.classList.toggle('visible', window.scrollY > SHOW_AFTER);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   7. SMOOTH SCROLL FOR ANCHOR LINKS
   Provides consistent smooth scrolling across browsers
   (supplements the CSS scroll-behavior: smooth).
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
