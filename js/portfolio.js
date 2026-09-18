/**
 * FOTOVAR - PORTFOLIO JAVASCRIPT
 * Handles category filtering with GSAP stagger, URL query parameter parsing,
 * and the cinematic fullscreen Lightbox modal with EXIF metadata.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilters();
  initLightbox();
});

/* ==========================================================================
   1. CATEGORY FILTERING (GSAP STAGGER)
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  if (!filterBtns.length || !cards.length) return;

  const filterCards = (category) => {
    // Update active button state
    filterBtns.forEach((btn) => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Animate cards
    const matching = [];
    const nonMatching = [];

    cards.forEach((card) => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category) {
        matching.push(card);
      } else {
        nonMatching.push(card);
      }
    });

    if (typeof gsap !== 'undefined') {
      // Hide non-matching
      if (nonMatching.length > 0) {
        gsap.to(nonMatching, {
          scale: 0.85,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            nonMatching.forEach(c => c.style.display = 'none');
          }
        });
      }

      // Show matching
      matching.forEach(c => c.style.display = 'block');
      gsap.fromTo(matching, 
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.05, duration: 0.45, ease: 'power2.out', delay: 0.15 }
      );
    } else {
      nonMatching.forEach(c => c.style.display = 'none');
      matching.forEach(c => {
        c.style.display = 'block';
        c.style.opacity = '1';
      });
    }
  };

  // Button clicks
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCat = btn.getAttribute('data-filter');
      filterCards(targetCat);
    });
  });

  // URL query parameter support (e.g. ?cat=casamentos)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const validBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === catParam);
    if (validBtn) {
      filterCards(catParam);
    }
  }
}

/* ==========================================================================
   2. CINEMATIC FULLSCREEN LIGHTBOX MODAL WITH EXIF
   ========================================================================== */
function initLightbox() {
  const modal = document.querySelector('.lightbox-modal');
  if (!modal) return;

  const cards = document.querySelectorAll('.portfolio-card');
  const imgEl = modal.querySelector('.lightbox-img');
  const titleEl = modal.querySelector('.lightbox-info-title');
  const subEl = modal.querySelector('.lightbox-info-sub');
  const counterEl = modal.querySelector('.lightbox-counter');
  const exifCamera = modal.querySelector('#exif-camera');
  const exifLens = modal.querySelector('#exif-lens');
  const exifExposure = modal.querySelector('#exif-exposure');
  const exifIso = modal.querySelector('#exif-iso');
  const closeBtn = modal.querySelector('.lightbox-close-btn');
  const prevBtn = modal.querySelector('.lightbox-nav-btn.prev');
  const nextBtn = modal.querySelector('.lightbox-nav-btn.next');

  let currentIndex = 0;
  let activeCardsList = [];

  const updateActiveList = () => {
    // Only cycle through currently visible cards
    activeCardsList = Array.from(cards).filter(c => c.style.display !== 'none');
  };

  const showImage = (index) => {
    if (index < 0) index = activeCardsList.length - 1;
    if (index >= activeCardsList.length) index = 0;
    currentIndex = index;

    const card = activeCardsList[currentIndex];
    const imgSrc = card.getAttribute('data-full-img') || card.querySelector('img').src;
    const title = card.getAttribute('data-title') || 'Obra FOTOVAR';
    const location = card.getAttribute('data-location') || 'Estúdio';
    const camera = card.getAttribute('data-camera') || 'Hasselblad X2D';
    const lens = card.getAttribute('data-lens') || '80mm f/1.9';
    const exposure = card.getAttribute('data-exposure') || '1/500s • f/2.0';
    const iso = card.getAttribute('data-iso') || 'ISO 100';

    if (typeof gsap !== 'undefined') {
      gsap.to(imgEl, {
        opacity: 0,
        scale: 0.95,
        duration: 0.15,
        onComplete: () => {
          imgEl.src = imgSrc;
          titleEl.textContent = title;
          subEl.textContent = location;
          counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(activeCardsList.length).padStart(2, '0')}`;
          
          if (exifCamera) exifCamera.textContent = camera;
          if (exifLens) exifLens.textContent = lens;
          if (exifExposure) exifExposure.textContent = exposure;
          if (exifIso) exifIso.textContent = iso;

          gsap.to(imgEl, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
        }
      });
    } else {
      imgEl.src = imgSrc;
      titleEl.textContent = title;
      subEl.textContent = location;
      counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(activeCardsList.length).padStart(2, '0')}`;
      if (exifCamera) exifCamera.textContent = camera;
      if (exifLens) exifLens.textContent = lens;
      if (exifExposure) exifExposure.textContent = exposure;
      if (exifIso) exifIso.textContent = iso;
    }
  };

  const openLightbox = (card) => {
    updateActiveList();
    const idx = activeCardsList.indexOf(card);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    showImage(idx >= 0 ? idx : 0);
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Card click triggers
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      openLightbox(card);
    });
  });

  // Modal navigation controls
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  // Click outside image closes modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-body')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

