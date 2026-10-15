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
