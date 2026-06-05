/* ── NAV SCROLL STATE ── */
const nav = document.getElementById('site-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  })
);

/* ── HERO REVEAL (fires shortly after load) ── */
function runHeroReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  items.forEach(el => {
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('visible'), delay + 120);
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runHeroReveal);
} else {
  runHeroReveal();
}

/* ── SCROLL ANIMATIONS ── */
const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('in-view'), delay);
      animObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

/* ── SMOOTH ANCHOR SCROLL (offset for fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - 80, behavior: 'smooth' });
  });
});

/* ── PRE-SELECT SERVICE FROM URL PARAM ── */
// Used when clicking "Book Exterior / Interior / Full" from the landing page
// booking.html reads this and pre-selects the dropdown
const params = new URLSearchParams(window.location.search);
const serviceParam = params.get('service');
if (serviceParam) {
  const map = { exterior: 'Exterior Detail - $40', interior: 'Interior Detail - $50', full: 'Full Detail - $80' };
  const sel = document.getElementById('service');
  if (sel && map[serviceParam]) sel.value = map[serviceParam];
}
