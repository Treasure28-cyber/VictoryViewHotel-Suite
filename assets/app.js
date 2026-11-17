export const MAP_EMBED_URL = 'https://www.google.com/maps?q=Victory+View+Hotel+%26+Suites+122+DSC+Expressway+Ovwian+Axis+Udu+Delta+State+Nigeria&output=embed';

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('is-open', !isOpen);
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
      toggle.focus();
    }
  });
}
const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

for (const frame of document.querySelectorAll('[data-map-embed]')) {
  const fallback = frame.parentElement.querySelector('.map-fallback');
  const stack = frame.closest('.location-map-stack');
  let loaded = false;
  frame.addEventListener('load', () => { loaded = true; });
  const showAddressFallback = () => {
    if (!loaded && fallback) {
      frame.hidden = true;
      fallback.hidden = false;
    }
  };
  frame.src = MAP_EMBED_URL;
  frame.addEventListener('pointerdown', () => frame.classList.add('map-active'), { once: true });
  window.setTimeout(showAddressFallback, 15000);
  window.addEventListener('offline', showAddressFallback, { once: true });
  if (stack?.closest('.location-section')) frame.classList.add('map-scroll-safe');
}

for (const button of document.querySelectorAll('[data-room]')) {
  const room = button.dataset.room;
  const message = `Hi Victory View. I would like to book a ${room} for [dates]. Please confirm availability.`;
  button.href = `https://wa.me/2348101064294?text=${encodeURIComponent(message)}`;
}

const stayForm = document.querySelector('#stay-enquiry');
if (stayForm) {
  const checkin = stayForm.elements.checkin;
  const checkout = stayForm.elements.checkout;
  const today = new Date();
  const localDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  checkin.min = localDate(today);
  checkout.min = localDate(today);
  const updateDates = () => {
    if (!checkin.value) return;
    const nextDay = new Date(`${checkin.value}T12:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    checkout.min = localDate(nextDay);
    if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
  };
  checkin.addEventListener('change', updateDates);
  stayForm.addEventListener('submit', event => {
    event.preventDefault();
    updateDates();
    if (!stayForm.reportValidity()) return;
    const room = stayForm.elements.room.value;
    const message = `Hello Victory View Hotel & Suites. I'd like to enquire about a stay from ${checkin.value} to ${checkout.value}. Room preference: ${room}. Please confirm availability and current rates.`;
    window.open(`https://wa.me/2348101064294?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
}

// One-time entrance sequences. Content stays visible without JavaScript.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.site-header');
let scrollQueued = false;
const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 60);
  scrollQueued = false;
};
window.addEventListener('scroll', () => {
  if (!scrollQueued) {
    scrollQueued = true;
    window.requestAnimationFrame(updateHeader);
  }
}, { passive: true });
updateHeader();

const revealTargets = document.querySelectorAll('.section-head, .room-card, .welcome-layout > div, .amenities-copy, .amenities-grid > div, .conference-photo, .conference-copy, .dining-copy, .dining-photos, .testimonial, .location-grid > div, .room-detail-photo, .room-detail-copy, .conference-detail > div, .event-gallery figure, .full-gallery figure, .contact-grid > div, .footer-invitation, .footer-top > div');
let revealObserver;
const finishReveals = () => {
  revealObserver?.disconnect();
  for (const element of revealTargets) element.classList.remove('reveal-pending');
};
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  for (const element of revealTargets) {
    // Anchor destinations and already-visible content must never be hidden.
    if (element.getBoundingClientRect().top < window.innerHeight) continue;
    const siblings = [...element.parentElement.children];
    element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 3) * 65}ms`);
    element.classList.add('reveal-pending');
    revealObserver.observe(element);
  }
  document.addEventListener('focusin', event => {
    event.target.closest('.reveal-pending')?.classList.remove('reveal-pending');
  });
  window.addEventListener('beforeprint', finishReveals);
}
motionPreference.addEventListener('change', event => {
  if (event.matches) finishReveals();
});
