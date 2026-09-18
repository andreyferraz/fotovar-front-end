/**
 * FOTOVAR - HOME JAVASCRIPT
 * Hero timeline, Horizontal Reel ScrollTrigger, Aperture lens rotation,
 * Animated stats counters and creative interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  // Register plugins safely
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initHeroAnimations();
  initMarquee();
  initHorizontalReel();
  initApertureFeature();
  initStatsCounter();
  initScrollReveals();
});

/* ==========================================================================
   1. HERO TIMELINE & 3D PARALLAX
   ========================================================================== */
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-badge-row', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.2
  })
  .from('.hero-title', {
    y: 40,
    opacity: 0,
    duration: 1,
  }, '-=0.5')
  .from('.hero-description', {
    y: 30,
    opacity: 0,
    duration: 0.8
  }, '-=0.6')
  .from('.hero-buttons', {
    y: 20,
    opacity: 0,
    duration: 0.8
  }, '-=0.6')
  .from('.hero-image-wrapper', {
    scale: 0.9,
    opacity: 0,
    duration: 1.2,
    ease: 'power2.out'
  }, '-=1')
  .from('.hero-floating-badge', {
    y: 25,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: 'back.out(1.7)'
  }, '-=0.8');

  // Mouse Parallax on Hero Visual
  const heroSection = document.querySelector('.hero-section');
  const heroVisual = document.querySelector('.hero-visual');
  const badgeAwards = document.querySelector('.badge-awards');
  const badgeSpecs = document.querySelector('.badge-specs');

  if (heroSection && heroVisual && window.innerWidth > 992) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 2;
      const yPos = (clientY / window.innerHeight - 0.5) * 2;

      gsap.to(heroVisual, {
        rotationY: xPos * 8,
        rotationX: -yPos * 8,
        duration: 0.6,
        ease: 'power1.out'
      });

      if (badgeAwards) {
        gsap.to(badgeAwards, {
          x: xPos * 18,
          y: yPos * 18,
          duration: 0.5
        });
      }

      if (badgeSpecs) {
        gsap.to(badgeSpecs, {
          x: -xPos * 16,
          y: -yPos * 16,
          duration: 0.5
        });
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      gsap.to([heroVisual, badgeAwards, badgeSpecs], {
        x: 0,
        y: 0,
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: 'power2.out'
      });
    });
  }
}

/* ==========================================================================
   2. INFINITE MARQUEE
   ========================================================================== */
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  // Clone content for seamless looping
  track.innerHTML += track.innerHTML;

  gsap.to(track, {
    xPercent: -50,
    ease: 'none',
    duration: 28,
    repeat: -1
  });
}

/* ==========================================================================
   3. HORIZONTAL PINNED GALLERY REEL (SCROLLTRIGGER)
   ========================================================================== */
function initHorizontalReel() {
  const reelSection = document.querySelector('.reel-section');
  const reelContainer = document.querySelector('.reel-container');

  if (!reelSection || !reelContainer || typeof ScrollTrigger === 'undefined') return;

  // Only pin on screens larger than 768px
  if (window.innerWidth >= 768) {
    const totalScroll = reelContainer.scrollWidth - window.innerWidth + 120;

    gsap.to(reelContainer, {
      x: () => -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: reelSection,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }
}

/* ==========================================================================
   4. INTERACTIVE APERTURE LENS SHOWCASE
   ========================================================================== */
function initApertureFeature() {
  const graphic = document.querySelector('.aperture-shutter-graphic');
  const fNumberEl = document.querySelector('.aperture-f-number');
  const blades = document.querySelectorAll('.aperture-svg-blade');

  if (!graphic || !fNumberEl) return;

  const fStops = ['f/1.2', 'f/1.4', 'f/2.0', 'f/2.8', 'f/4.0', 'f/5.6', 'f/8.0'];
  let currentIdx = 0;

  // Rotate blades based on scroll
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('.aperture-outer-ring', {
      rotation: 360,
      ease: 'none',
      scrollTrigger: {
        trigger: '.aperture-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // Interactive Click / Hover changes f-stop
  graphic.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % fStops.length;
    
    // Animate text transition
    gsap.to(fNumberEl, {
      scale: 0.7,
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
        fNumberEl.textContent = fStops[currentIdx];
        gsap.to(fNumberEl, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(2)' });
      }
    });

    // Pulse aperture blades
    if (blades.length > 0) {
      gsap.fromTo(blades, 
        { scale: 1 }, 
        { scale: 1.15, rotation: '+=30', transformOrigin: 'center center', stagger: 0.05, duration: 0.3, yoyo: true, repeat: 1 }
      );
    }
  });
}

/* ==========================================================================
   5. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length || typeof ScrollTrigger === 'undefined') return;

  statNumbers.forEach((el) => {
    const targetValue = parseInt(el.getAttribute('data-target'), 10) || 0;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetValue,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toLocaleString('pt-BR');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   6. SCROLL REVEALS
   ========================================================================== */
function initScrollReveals() {
  if (typeof ScrollTrigger === 'undefined') return;

  // Service cards stagger
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length) {
    gsap.from(serviceCards, {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 0.9,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%'
      }
    });
  }

  // Testimonials stagger
  const testimonials = document.querySelectorAll('.testimonial-card');
  if (testimonials.length) {
    gsap.from(testimonials, {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.testimonials-grid',
        start: 'top 80%'
      }
    });
  }
}

