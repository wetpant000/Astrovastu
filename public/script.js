const BOOK_BTN_SELECTOR = '.book-btn';
const SERVICES_BTN_SELECTOR = '.services-btn';
const BOOK_SECTION_SELECTOR = '.book-consultation';
const SERVICES_SECTION_ID = 'services-consultation';
const BOOKING_FORM_ID = 'booking-form';
const SUBMIT_BTN_ID = 'submit-btn';

const API_ENDPOINT = 'http://localhost:5000/submit';

function scrollToTarget(selectorOrId) {
  const target =
    typeof selectorOrId === 'string' && selectorOrId.startsWith('#')
      ? document.getElementById(selectorOrId.slice(1))
      : document.querySelector(selectorOrId);

  if (!target) {
    console.warn('Scroll target not found:', selectorOrId);
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateSubmitButton(state, btn) {
  if (!btn) return;

  const states = {
    idle: { text: 'Submit', disabled: false, classes: [] },
    pending: { text: 'Submitting...', disabled: true, classes: ['submitting'], style: { backgroundColor: 'green', color: 'black' } },
    success: { text: 'Submitted', disabled: false, classes: ['success'] },
    error: { text: 'Try Again', disabled: false, classes: ['error'] },
  };

  const settings = states[state] || states.idle;

  btn.textContent = settings.text;
  btn.disabled = settings.disabled;

  btn.classList.remove('submitting', 'success', 'error');
  settings.classes.forEach((className) => btn.classList.add(className));

  if (settings.style) {
    Object.assign(btn.style, settings.style);
  } else {
    btn.style.backgroundColor = '';
    btn.style.color = '';
  }
}

async function handleBookingFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitBtn = document.getElementById(SUBMIT_BTN_ID);

  updateSubmitButton('pending', submitBtn);

  try {
    const payload = Object.fromEntries(new FormData(form));

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unknown error while submitting');
    }

    alert('Form submitted successfully!');
    form.reset();
    updateSubmitButton('success', submitBtn);
    console.info('Server response:', data);
  } catch (error) {
    console.error('Booking form submission error:', error);
    alert(`Submission failed: ${error.message || 'Please try again later.'}`);
    updateSubmitButton('error', submitBtn);
  } finally {
    setTimeout(() => updateSubmitButton('idle', submitBtn), 1800);
  }
}

function initializePage() {
  const bookButtons = Array.from(document.querySelectorAll(BOOK_BTN_SELECTOR));
  const servicesButtons = Array.from(document.querySelectorAll(SERVICES_BTN_SELECTOR));

  bookButtons.forEach((btn) => btn.addEventListener('click', () => scrollToTarget(BOOK_SECTION_SELECTOR)));
  servicesButtons.forEach((btn) => btn.addEventListener('click', () => scrollToTarget(`#${SERVICES_SECTION_ID}`)));

  const form = document.getElementById(BOOKING_FORM_ID);
  if (form) {
    form.addEventListener('submit', handleBookingFormSubmit);
  } else {
    console.warn('Booking form (#booking-form) not found in DOM.');
  }
}

document.addEventListener('DOMContentLoaded', initializePage);
