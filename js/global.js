/**
 * FOTOVAR - GLOBAL JAVASCRIPT
 * Handles custom cursor, magnetic elements, page shutter transitions,
 * mobile navigation drawer, and global interaction behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initMagneticElements();
  initHeaderScroll();
  initMobileMenu();
  initPageTransitions();
  initBackToTop();
});

/* ==========================================================================
   1. CUSTOM CURSOR & VIEWFINDER
   ========================================================================== */
function initCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');

  if (!dot || !ring) return;

  // Track mouse coordinates
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Check if touch device
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    if (typeof gsap !== 'undefined') {
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    } else {
      ring.style.left = `${mouseX}px`;
      ring.style.top = `${mouseY}px`;
    }
  });

  // Hover states
  const hoverTargets = 'a, button, [role="button"], input, textarea, select, .btn, .menu-toggle-btn, .clickable, .back-to-top-btn';
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (target.closest('.has-view-cursor') || target.closest('.portfolio-card')) {
      document.body.classList.add('cursor-view');
      document.body.classList.remove('cursor-hover');
    } else if (target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
      document.body.classList.remove('cursor-view');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (target.closest('.has-view-cursor') || target.closest('.portfolio-card')) {
      document.body.classList.remove('cursor-view');
    } else if (target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Hide on mouse leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

/* ==========================================================================
   2. MAGNETIC INTERACTION PHYSICS
   ========================================================================== */
function initMagneticElements() {
  const magnetics = document.querySelectorAll('.btn-magnetic, .nav-link, .btn-icon-circle, .brand-logo-wrap');

  if (typeof gsap === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

  magnetics.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      gsap.to(el, {
        x: relX * 0.28,
        y: relY * 0.28,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1.2, 0.4)',
        overwrite: 'auto'
      });
    });
  });
}

/* ==========================================================================
   3. HEADER ON SCROLL
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   4. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle-btn');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !overlay) return;

  const toggle = () => {
    const isOpen = document.body.classList.toggle('menu-open');
    if (isOpen && typeof gsap !== 'undefined') {
      gsap.fromTo(
        navLinks,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out', delay: 0.15 }
      );
    }
  };

  toggleBtn.addEventListener('click', toggle);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
    });
  });
}

/* ==========================================================================
   5. PAGE TRANSITIONS (SHUTTER EFFECT)
   ========================================================================== */
function initPageTransitions() {
  const shutter = document.querySelector('.shutter-transition');
  if (!shutter) return;

  const blades = shutter.querySelectorAll('.shutter-blade');

  // Entrance animation (Page Load / Reveal)
  if (typeof gsap !== 'undefined') {
    gsap.set(blades, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(blades, {
      scaleY: 0,
      stagger: 0.04,
      duration: 0.65,
      ease: 'power3.inOut',
      delay: 0.05
    });
  }

  // Intercept internal navigation clicks
  const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');

  internalLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetUrl = link.getAttribute('href');
      if (!targetUrl || targetUrl.startsWith('#') || targetUrl === window.location.pathname.split('/').pop()) {
        return;
      }

      // Check if external link
      try {
        const urlObj = new URL(link.href);
        if (urlObj.origin !== window.location.origin) return;
      } catch (err) {
        // Relative link is fine
      }

      e.preventDefault();

      if (typeof gsap !== 'undefined') {
        gsap.set(blades, { transformOrigin: 'bottom' });
        gsap.to(blades, {
          scaleY: 1,
          stagger: 0.04,
          duration: 0.5,
          ease: 'power3.inOut',
          onComplete: () => {
            window.location.href = targetUrl;
          }
        });
      } else {
        window.location.href = targetUrl;
      }
    });
  });
}

/* ==========================================================================
   6. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const btns = document.querySelectorAll('.back-to-top-btn');
  if (!btns.length) return;

  if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin);
  }

  btns.forEach((btn) => {
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', 'Voltar ao topo');
    }

    const scrollToTop = (e) => {
      if (e) e.preventDefault();

      if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, {
          scrollTo: { y: 0, autoKill: false },
          duration: 0.8,
          ease: 'power2.inOut'
        });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    };

    btn.addEventListener('click', scrollToTop);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop(e);
      }
    });
  });
}

