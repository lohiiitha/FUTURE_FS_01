/* ============================================================
   LOHITHA DAMAROUTHU — PORTFOLIO JAVASCRIPT
   Features:
   - Navbar scroll behavior (background + shadow)
   - Smooth scrolling (native + JS fallback)
   - Scroll reveal animations (IntersectionObserver)
   - Mobile hamburger menu
   - Active nav link highlighting on scroll
   - Contact form validation
   - Typing/cursor effect on hero tagline
   ============================================================ */

/* ---- Utility: Wait for DOM ---- */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVBAR — scroll shadow + active state
     ============================================================ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav__links a:not(.nav__cta)');
  const sections = document.querySelectorAll('section[id]');

  /**
   * Adds/removes "scrolled" class on navbar
   * when user scrolls past 10px
   */
  function handleNavScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }

  /**
   * Highlights the nav link corresponding to the
   * section currently visible in the viewport
   */
  function updateActiveNavLink() {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentSection) {
        link.style.color = 'var(--color-text)';
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


  /* ============================================================
     2. SMOOTH SCROLLING
     — handles all internal anchor links
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top:      targetTop,
        behavior: 'smooth'
      });
    });
  });


  /* ============================================================
     3. MOBILE HAMBURGER MENU
     ============================================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  /** Toggles the mobile menu open/closed */
  function toggleMobileMenu() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  }

  /** Close menu when a mobile link is clicked */
  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      closeMobileMenu();
    }
  });


  /* ============================================================
     4. SCROLL REVEAL (IntersectionObserver)
     — reveals elements with class "reveal" when in viewport
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal so it doesn't re-trigger
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  0.12,   // trigger when 12% visible
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));


  /* ============================================================
     5. HERO TYPING EFFECT
     — animates a cursor blink on the tagline em tag
     ============================================================ */
  const taglineEm = document.querySelector('.hero__tagline em');

  if (taglineEm) {
    // Add blinking cursor after the italic text
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = `
      display: inline-block;
      margin-left: 2px;
      color: var(--color-accent-2);
      font-style: normal;
      animation: cursorBlink 1.1s step-end infinite;
    `;

    // Inject keyframes into the document
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cursorBlink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    taglineEm.appendChild(cursor);
  }


  /* ============================================================
     6. SKILL TAG HOVER — staggered entrance animation
     ============================================================ */
  const skillCategories = document.querySelectorAll('.skill-category');

  skillCategories.forEach(cat => {
    const tags = cat.querySelectorAll('.skill-tag');
    tags.forEach((tag, i) => {
      tag.style.transitionDelay = `${i * 30}ms`;
    });
  });


  /* ============================================================
     7. PROJECT CARDS — tilt on mouse move (subtle 3D)
     ============================================================ */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4; // max ±4deg
      const rotateY = ((x - centerX) / centerX) *  4;

      card.style.transform =
        `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });


  /* ============================================================
     8. CONTACT FORM VALIDATION
     ============================================================ */
  const contactForm  = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formSuccess  = document.getElementById('formSuccess');

  // Field references
  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  // Error element references
  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  /**
   * Validates a single field and shows/hides error message.
   * @param {HTMLElement} field   - The input/textarea
   * @param {HTMLElement} errEl   - The error span
   * @param {Function}    check   - Returns error string or ''
   * @returns {boolean}           - true if valid
   */
  function validateField(field, errEl, check) {
    const error = check(field.value.trim());
    if (error) {
      field.classList.add('error');
      field.classList.remove('success');
      errEl.textContent = error;
      return false;
    } else {
      field.classList.remove('error');
      field.classList.add('success');
      errEl.textContent = '';
      return true;
    }
  }

  /* Validation rules */
  const rules = {
    name:    v => v.length < 2  ? 'Please enter your full name.' : '',
    email:   v => {
      if (!v)               return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
                            return 'Please enter a valid email address.';
      return '';
    },
    subject: v => v.length < 3  ? 'Add a brief subject line.' : '',
    message: v => v.length < 10 ? 'Message must be at least 10 characters.' : '',
  };

  /* Live validation on blur (real-time feedback) */
  nameInput.addEventListener('blur',
    () => validateField(nameInput, nameError, rules.name));
  emailInput.addEventListener('blur',
    () => validateField(emailInput, emailError, rules.email));
  subjectInput.addEventListener('blur',
    () => validateField(subjectInput, subjectError, rules.subject));
  messageInput.addEventListener('blur',
    () => validateField(messageInput, messageError, rules.message));

  /* Clear error on input */
  [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
    });
  });

  /**
   * Form submit handler
   * Validates all fields; shows success state on pass
   */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const validName    = validateField(nameInput,    nameError,    rules.name);
    const validEmail   = validateField(emailInput,   emailError,   rules.email);
    const validSubject = validateField(subjectInput, subjectError, rules.subject);
    const validMessage = validateField(messageInput, messageError, rules.message);

    if (!(validName && validEmail && validSubject && validMessage)) {
      // Shake the form on error
      contactForm.style.animation = 'formShake 0.4s ease';
      setTimeout(() => { contactForm.style.animation = ''; }, 400);
      return;
    }

    /* --- Simulate form submission (replace with fetch/EmailJS) --- */
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      // Reset form
      contactForm.reset();
      [nameInput, emailInput, subjectInput, messageInput].forEach(f => {
        f.classList.remove('success');
      });

      // Show success
      formSuccess.classList.add('visible');
      submitBtn.innerHTML = `Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      submitBtn.disabled = false;

      // Hide success after 5s
      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 5000);

    }, 1200); // simulated 1.2s delay
  });

  // Inject form shake keyframes
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes formShake {
      0%,100% { transform: translateX(0); }
      20%     { transform: translateX(-6px); }
      40%     { transform: translateX(6px); }
      60%     { transform: translateX(-4px); }
      80%     { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);


  /* ============================================================
     9. STATS COUNTER ANIMATION
     — counts up numbers in .stat-card__num on scroll into view
     ============================================================ */
  const statNums = document.querySelectorAll('.stat-card__num');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el      = entry.target;
        const rawText = el.textContent;

        // Only animate numeric values
        const isNumeric = /^\d+/.test(rawText);
        if (!isNumeric) return;

        const target = parseInt(rawText, 10);
        const suffix = rawText.replace(/\d+/, '');
        let   count  = 0;
        const step   = Math.ceil(target / 30); // 30 frames
        const ticker = setInterval(() => {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(ticker);
          }
          el.textContent = count + suffix;
        }, 30);

        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach(el => counterObserver.observe(el));


  /* ============================================================
     10. BEYOND SECTION — card hover color accent
     ============================================================ */
  const beyondCards = document.querySelectorAll('.beyond__card');
  const accentColors = ['#c8a96e', '#4a7c6f', '#6e8fc8', '#c86e8f'];

  beyondCards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = accentColors[i % accentColors.length];
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '';
    });
  });


  /* ============================================================
     11. FOOTER "Back to top" — smooth scroll
     (handled by the global smooth scroll above,
      but also add a subtle progress tracker)
     ============================================================ */
  const footerTop = document.querySelector('.footer__top');
  if (footerTop) {
    footerTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

}); // end DOMContentLoaded
