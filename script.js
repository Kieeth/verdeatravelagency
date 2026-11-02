// ---------- Mobile menu ----------
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Data (add destinations and packages here) ----------
const destinations = [];
const packages = [];

// ---------- Rendering ----------
function renderCards(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    // Fill in card markup here once the data shape is decided
    container.appendChild(card);
  });
}

renderCards('destination-list', destinations);
renderCards('package-list', packages);

// ---------- Contact form ----------
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    status.textContent = 'Please fill in your name, a valid email, and a message.';
    return;
  }
  // Hook up a real submission (email service, backend) here
  status.textContent = 'Thanks! Your message has been received.';
  form.reset();
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
