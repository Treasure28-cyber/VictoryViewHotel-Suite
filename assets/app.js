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

for (const button of document.querySelectorAll('[data-room]')) {
  const room = button.dataset.room;
  const message = `Hi Victory View. I would like to book a ${room} for [dates]. Please confirm availability.`;
  button.href = `https://wa.me/2348101064294?text=${encodeURIComponent(message)}`;
}
