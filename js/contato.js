/**
 * FOTOVAR - CONTATO JAVASCRIPT
 * Handles service selection pills, form validation, camera flash submission animation,
 * and the animated FAQ accordion with GSAP height interpolation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initServicePills();
  initContactForm();
  initFaqAccordion();
});

/* ==========================================================================
   1. SERVICE SELECTION PILLS
   ========================================================================== */
function initServicePills() {
  const pills = document.querySelectorAll('.service-pill-btn');
  const hiddenInput = document.querySelector('#selected-service-input');

  if (!pills.length) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');

      const serviceName = pill.getAttribute('data-service');
      if (hiddenInput) {
        hiddenInput.value = serviceName;
      }
    });
  });
}

/* ==========================================================================
   2. FORM VALIDATION & CAMERA FLASH SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.querySelector('#booking-form');
  const successBox = document.querySelector('.form-success-message');
  const submitBtn = document.querySelector('#form-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#user-name');
    const email = form.querySelector('#user-email');
    const phone = form.querySelector('#user-phone');
    const message = form.querySelector('#user-message');

    let isValid = true;
    const required = [name, email, phone, message];

    required.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = '#ef4444';

        // GSAP shake animation
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(input, 
            { x: -8 }, 
            { x: 8, duration: 0.08, repeat: 4, yoyo: true, ease: 'power1.inOut', onComplete: () => {
              gsap.set(input, { x: 0 });
            }}
          );
        }
      } else {
        input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
    });

    if (!isValid) return;

    // Loading State
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Processando...</span>`;
    submitBtn.disabled = true;

    // Trigger Camera Shutter Visual Flash
    createFlashEffect();

    setTimeout(() => {
      // Hide form contents and reveal success message with GSAP
      const formCard = document.querySelector('.contact-form-card');
      const formFields = formCard.querySelectorAll('.form-fields-container, .form-submit-row, .service-pills-wrap');

      if (typeof gsap !== 'undefined') {
        gsap.to(formFields, {
          opacity: 0,
          y: -20,
          duration: 0.35,
          onComplete: () => {
            formFields.forEach(f => f.style.display = 'none');
            successBox.style.display = 'block';
            gsap.fromTo(successBox,
              { opacity: 0, scale: 0.9, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)' }
            );
          }
        });
      } else {
        formFields.forEach(f => f.style.display = 'none');
        successBox.style.display = 'block';
      }
    }, 1000);
  });
}

function createFlashEffect() {
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.inset = '0';
  flash.style.backgroundColor = '#ffffff';
  flash.style.zIndex = '999999';
  flash.style.pointerEvents = 'none';
  flash.style.opacity = '0.85';
  document.body.appendChild(flash);

  if (typeof gsap !== 'undefined') {
    gsap.to(flash, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.out',
      onComplete: () => {
        flash.remove();
      }
    });
  } else {
    setTimeout(() => flash.remove(), 300);
  }
}

/* ==========================================================================
   3. ANIMATED FAQ ACCORDION (GSAP DYNAMIC HEIGHT)
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    const collapse = item.querySelector('.faq-answer-collapse');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other opened items
      items.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherCollapse = other.querySelector('.faq-answer-collapse');
          if (typeof gsap !== 'undefined') {
            gsap.to(otherCollapse, { height: 0, duration: 0.35, ease: 'power2.inOut' });
          } else {
            otherCollapse.style.height = '0';
          }
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        if (typeof gsap !== 'undefined') {
          gsap.to(collapse, { height: 0, duration: 0.35, ease: 'power2.inOut' });
        } else {
          collapse.style.height = '0';
        }
      } else {
        item.classList.add('active');
        const targetHeight = collapse.scrollHeight;
        if (typeof gsap !== 'undefined') {
          gsap.to(collapse, { height: targetHeight, duration: 0.35, ease: 'power2.out' });
        } else {
          collapse.style.height = `${targetHeight}px`;
        }
      }
    });
  });
}

