/**
 * FOTOVAR - SOBRE JAVASCRIPT
 * Handles timeline progress bar scrolltrigger, 3D card tilt physics,
 * manifesto typography reveals and team cards interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initAboutHero();
  initTimelineScroll();
  init3DTilt();
  initScrollReveals();
});

/* ==========================================================================
   1. ABOUT HERO ENTRANCE
   ========================================================================== */
function initAboutHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.about-hero .section-tag', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.1
  })
  .from('.about-hero .section-title', {
    y: 35,
    opacity: 0,
    duration: 0.9
  }, '-=0.5')
  .from('.about-manifesto-lead', {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, '-=0.5')
  .from('.about-hero-img-wrap', {
    scale: 0.95,
    opacity: 0,
    duration: 1.1
  }, '-=0.6');
}

/* ==========================================================================
   2. TIMELINE GLOW PROGRESS BAR & NODES
   ========================================================================== */
function initTimelineScroll() {
  const timelineSection = document.querySelector('.timeline-section');
  const glowBar = document.querySelector('.timeline-glow-bar');
  const nodes = document.querySelectorAll('.timeline-node');

  if (!timelineSection || !glowBar || typeof ScrollTrigger === 'undefined') return;

  // Animate the vertical glowing line through the section
  gsap.to(glowBar, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.timeline-wrap',
      start: 'top 70%',
      end: 'bottom 80%',
      scrub: 0.5
    }
  });

  // Stagger each timeline card
  nodes.forEach((node, index) => {
    const isOdd = index % 2 === 0;
    const card = node.querySelector('.timeline-content-card');
    const dot = node.querySelector('.timeline-dot');

    gsap.from(card, {
      x: isOdd && window.innerWidth >= 768 ? -50 : 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: node,
        start: 'top 80%'
      }
    });

    if (dot) {
      gsap.from(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: node,
          start: 'top 80%'
        }
      });
    }
  });
}

/* ==========================================================================
   3. 3D TILT PHYSICS ON GEAR CARDS
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.gear-card');
  if (!cards.length || window.matchMedia('(pointer: coarse)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 800,
        ease: 'power1.out',
        duration: 0.3
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        ease: 'power2.out',
        duration: 0.6
      });
    });
  });
}

/* ==========================================================================
   4. SCROLL REVEALS (PHILOSOPHY & TEAM)
   ========================================================================== */
function initScrollReveals() {
  if (typeof ScrollTrigger === 'undefined') return;

  // Philosophy cards
  const philosophyCards = document.querySelectorAll('.philosophy-card');
  if (philosophyCards.length) {
    gsap.from(philosophyCards, {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.85,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.philosophy-grid',
        start: 'top 80%'
      }
    });
  }

  // Team cards
  const teamCards = document.querySelectorAll('.team-card');
  if (teamCards.length) {
    gsap.from(teamCards, {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.9,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.team-grid',
        start: 'top 80%'
      }
    });
  }
}

