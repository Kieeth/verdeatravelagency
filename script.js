/* =========================================================
   MEDIA SETTINGS
   Put your files in the /images and /videos folders, then
   change the file names below to match. Anything that does
   not exist yet is skipped, so nothing looks broken.
   ========================================================= */
const MEDIA = {
  // Big background video in the hero (optional, plays muted on loop)
  heroVideo: 'videos/hero.mp4',

  // Background photos
  heroImage: 'images/hero.webp',          // shows behind/before the hero video
  packageImage: 'images/package.webp',    // package section, right side
  stayImage: 'images/cityhub.webp', // City Hub Condominium
  backdrop: 'images/moss.jpg',           // dark mossy sections and footer


};

const ACTIVITIES = {
  day1: [
    { name: 'K Pilates', type: 'Pilates session', image: 'images/k-pilates.webp' },
    { name: 'Forest House', type: 'Lunch', image: 'images/forest-house.webp' },
    { name: 'Be Better Wellness', type: 'Massage', image: 'images/be-better-wellness.webp' },
    { name: 'OTOO', type: 'Matcha drinks', image: 'images/otoo-matcha.webp' },
    { name: 'OTOO', type: 'Pottery workshop', image: 'images/otoo-pottery.webp' },
  ],
  day2: [
    { name: 'Yoga', type: 'Morning session', image: 'images/yoga.webp' },
    { name: 'Wagner Cafe', type: 'Breakfast', image: 'images/wagner-cafe.webp' },
    { name: 'Man Apsol x H.O.Y. Brent', type: 'Cafe visit', image: 'images/brent-cafe.webp' },
    { name: 'Oh My Gulay!', type: 'Lunch', image: 'images/oh-my-gulay.webp' },
    { name: 'The Pavilion', type: 'Pickleball', image: 'images/pickleball.webp' },
  ],
};

/* =========================================================
   Helpers
   ========================================================= */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Finds the file even if you used .jpeg, .png or .webp instead of .jpg */
const IMG_EXT = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
async function resolveImage(src) {
  if (!src) return '';
  if (await probeImage(src)) return src;
  const base = src.replace(/\.[a-z0-9]+$/i, '');
  for (const ext of IMG_EXT) {
    const alt = `${base}.${ext}`;
    if (alt !== src && await probeImage(alt)) return alt;
  }
  return '';
}

const probeImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

const probeVideo = (src) =>
  new Promise((resolve) => {
    const video = document.createElement('video');
    const finish = (ok) => { video.removeAttribute('src'); video.load(); resolve(ok); };
    video.preload = 'metadata';
    video.onloadedmetadata = () => finish(true);
    video.onerror = () => finish(false);
    setTimeout(() => finish(false), 10000);
    video.src = src;
  });

function hideSection(id) {
  const section = document.getElementById(id);
  if (section) section.hidden = true;
  document.querySelectorAll(`a[href="#${id}"]`).forEach((a) => { a.hidden = true; });
}

function showSection(id) {
  const section = document.getElementById(id);
  if (section) section.hidden = false;
}

/* =========================================================
   Background photos (CSS falls back to green gradients)
   ========================================================= */
const root = document.documentElement.style;
const setBackground = async (name, path) => {
  const found = await resolveImage(path);
  if (found) root.setProperty(`--img-${name}`, `url("${found}")`);
};
setBackground('hero', MEDIA.heroImage);
setBackground('package', MEDIA.packageImage);
setBackground('stay', MEDIA.stayImage);
setBackground('backdrop', MEDIA.backdrop);

/* =========================================================
   Hero video
   ========================================================= */
const heroVideo = document.getElementById('hero-video');
if (MEDIA.heroVideo && !prefersReducedMotion) {
  heroVideo.addEventListener('loadeddata', () => {
    heroVideo.classList.add('ready');
    heroVideo.play().catch(() => {});
  });
  heroVideo.addEventListener('error', () => heroVideo.remove());
  heroVideo.src = MEDIA.heroVideo;
} else {
  heroVideo.remove();
}

/* =========================================================
   Activity tiles
   ========================================================= */
function renderTiles(containerId, items) {
  const container = document.getElementById(containerId);
  items.forEach((item) => {
    const tile = document.createElement('figure');
    tile.className = 'tile';

    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.addEventListener('error', () => img.remove());
    resolveImage(item.image).then((found) => { if (found) img.src = found; else img.remove(); });

    const caption = document.createElement('figcaption');
    const name = document.createElement('span');
    name.className = 'tile-name';
    name.textContent = item.name;
    const type = document.createElement('span');
    type.className = 'tile-type';
    type.textContent = item.type;
    caption.append(name, type);

    tile.append(img, caption);
    container.appendChild(tile);
  });
}
renderTiles('day1-tiles', ACTIVITIES.day1);
renderTiles('day2-tiles', ACTIVITIES.day2);

/* =========================================================
   Videos (section stays hidden until at least one exists)
   ========================================================= */
function makeVideo(src, poster) {
  const video = document.createElement('video');
  video.controls = true;
  video.preload = 'metadata';
  video.playsInline = true;
  if (poster) video.poster = poster;
  video.src = src;
  return video;
}

async function setupVideos() {
  const featuredBox = document.getElementById('featured-video');
  const clipsBox = document.getElementById('clips');
  let found = false;

  if (MEDIA.featuredVideo && MEDIA.featuredVideo.src && await probeVideo(MEDIA.featuredVideo.src)) {
    const poster = await resolveImage(MEDIA.featuredVideo.poster);
    featuredBox.appendChild(makeVideo(MEDIA.featuredVideo.src, poster));
    found = true;
  }

  const results = await Promise.all(MEDIA.clips.map((src) => probeVideo(src)));
  MEDIA.clips.forEach((src, i) => {
    if (!results[i]) return;
    const figure = document.createElement('figure');
    figure.className = 'clip';
    figure.appendChild(makeVideo(src));
    clipsBox.appendChild(figure);
    found = true;
  });

  if (found) showSection('watch'); else hideSection('watch');
}

/* =========================================================
   Gallery + lightbox (section stays hidden until photos exist)
   ========================================================= */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
let shownPhotos = [];
let currentPhoto = 0;

function showPhoto(index) {
  currentPhoto = (index + shownPhotos.length) % shownPhotos.length;
  const photo = shownPhotos[currentPhoto];
  lbImg.src = photo.src;
  lbImg.alt = photo.alt;
  lbCap.textContent = photo.caption;
}

function openLightbox(index) {
  showPhoto(index);
  lightbox.showModal();
}

document.getElementById('lb-close').addEventListener('click', () => lightbox.close());
document.getElementById('lb-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.getElementById('lb-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
document.addEventListener('keydown', (event) => {
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
});

async function setupGallery() {
  const grid = document.getElementById('gallery-grid');
  const items = MEDIA.gallery.map((entry, i) => {
    const item = typeof entry === 'string' ? { src: entry } : entry;
    return { src: item.src, alt: item.alt || `Pine & Pause photo ${i + 1}`, caption: item.caption || '' };
  });
  const results = await Promise.all(items.map((item) => resolveImage(item.src)));
  shownPhotos = items.map((item, i) => ({ ...item, src: results[i] })).filter((item) => item.src);

  if (!shownPhotos.length) { hideSection('gallery'); return; }

  shownPhotos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.className = 'gallery-item';
    button.type = 'button';
    button.setAttribute('aria-label', `Open photo ${index + 1}`);
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = 'lazy';
    button.appendChild(img);
    button.addEventListener('click', () => openLightbox(index));
    grid.appendChild(button);
  });
  showSection('gallery');
}

setupVideos();
setupGallery();

/* =========================================================
   Header: solid after scrolling, mobile menu
   ========================================================= */
const header = document.getElementById('site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

/* Hides when scrolling down, returns when scrolling up */
let lastY = window.scrollY;
let ticking = false;
const updateHeader = () => {
  const y = Math.max(window.scrollY, 0);
  header.classList.toggle('scrolled', y > 40);
  const menuOpen = header.classList.contains('menu-open');
  if (menuOpen || y < 120) {
    header.classList.remove('nav-hidden');
  } else if (y > lastY + 6) {
    header.classList.add('nav-hidden');
  } else if (y < lastY - 6) {
    header.classList.remove('nav-hidden');
  }
  if (Math.abs(y - lastY) > 6) lastY = y;
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); }
}, { passive: true });
updateHeader();
// Keyboard users tabbing into the nav should always see it
header.addEventListener('focusin', () => header.classList.remove('nav-hidden'));

navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  header.classList.toggle('menu-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    header.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   Contact form
   ========================================================= */
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

/* Footer year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Gentle reveal for tiles and gallery photos as they scroll into view */
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  const watch = (el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', `${(i % 5) * 80}ms`); io.observe(el); };
  document.querySelectorAll('.tile, .info-card').forEach(watch);
  new MutationObserver((_, mo) => {
    document.querySelectorAll('.gallery-item:not(.reveal)').forEach(watch);
  }).observe(document.getElementById('gallery-grid'), { childList: true });
}

/* =========================================================
   Tour video: plays muted when in view, pauses when out of view
   ========================================================= */
(() => {
  const video = document.getElementById('tour-video');
  if (!video) return;
  const frame = document.getElementById('tour-frame');
  const bar = frame.querySelector('.video-controls');
  const btnPlay = document.getElementById('vc-play');
  const btnSound = document.getElementById('vc-sound');
  const btnFull = document.getElementById('vc-full');
  let userPaused = false;

  video.removeAttribute('controls');   // custom controls replace the native ones
  video.muted = true;
  bar.hidden = false;
  frame.classList.add('enhanced');

  const seek = document.getElementById('vc-seek');
  video.addEventListener('timeupdate', () => { if (video.duration && !seek.matches(':active')) seek.value = (video.currentTime / video.duration) * 100; });
  seek.addEventListener('input', () => { if (video.duration) video.currentTime = (seek.value / 100) * video.duration; });
  const labels = () => {
    btnPlay.textContent = video.paused ? 'Play' : 'Pause';
    btnSound.textContent = video.muted ? 'Sound on' : 'Sound off';
  };
  const toggle = () => {
    if (video.paused) { userPaused = false; video.play().catch(() => {}); }
    else { userPaused = true; video.pause(); }
  };
  video.addEventListener('play', labels);
  video.addEventListener('pause', labels);
  video.addEventListener('click', toggle);
  btnPlay.addEventListener('click', toggle);
  btnSound.addEventListener('click', () => { video.muted = !video.muted; if (!video.muted) video.volume = 1; labels(); });
  btnFull.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (frame.requestFullscreen) frame.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();   // iPhone
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) { labels(); return; }
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { if (!userPaused) video.play().catch(labels); }
    else video.pause();
  }, { threshold: 0.45 }).observe(frame);
  new IntersectionObserver(([entry], io) => {
    if (entry.isIntersecting) { video.preload = 'auto'; io.disconnect(); }
  }, { rootMargin: '600px 0px' }).observe(frame);
  labels();
})();

/* =========================================================
   Walkability evaluation: live score + rating
   ========================================================= */
(() => {
  const form = document.getElementById('walkability-form');
  if (!form) return;
  const scoreEl = document.getElementById('total-score');
  const textEl = document.getElementById('score-interpretation');
  const statusEl = document.getElementById('eval-form-status');
  const TOTAL = 14;

  const RATINGS = [
    { min: 11, cls: 'high',     text: 'Rating 11-14 | Highly Walkable: optimal for slow tourism; supports immersive, unhurried exploration.' },
    { min: 7,  cls: 'moderate', text: 'Rating 7-10 | Moderately Walkable: acceptable for slow tourism; targeted improvements recommended.' },
    { min: 4,  cls: 'poor',     text: 'Rating 4-6 | Poorly Walkable: significant barriers discourage sustained pedestrian and tourist activity.' },
    { min: 0,  cls: 'low',      text: 'Rating 0-3 | Not Walkable: incompatible with slow tourism. Major infrastructure investment required.' },
  ];

  const getScore = () => {
    let score = 0, answered = 0;
    for (let i = 1; i <= TOTAL; i++) {
      const picked = form.querySelector(`input[name="q${i}"]:checked`);
      if (picked) { score += Number(picked.value); answered++; }
    }
    return { score, answered };
  };

  const update = () => {
    const { score, answered } = getScore();
    scoreEl.textContent = score;
    if (!answered) {
      textEl.textContent = 'Answer the questions to see the walkability rating.';
      textEl.className = 'score-interpretation';
      return;
    }
    if (answered < TOTAL) {
      textEl.textContent = `${answered} of ${TOTAL} answered. The rating appears once every question is answered.`;
      textEl.className = 'score-interpretation';
      return;
    }
    const rating = RATINGS.find((r) => score >= r.min);
    textEl.textContent = rating.text;
    textEl.className = `score-interpretation ${rating.cls}`;
  };

  form.addEventListener('change', update);
  form.addEventListener('reset', () => setTimeout(update));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    statusEl.classList.remove('error');
    if (!form.checkValidity()) {
      const firstBad = form.querySelector(':invalid');
      statusEl.textContent = 'Please fill in your name, the location, the date, and answer all 14 questions.';
      statusEl.classList.add('error');
      if (firstBad) firstBad.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    const { score } = getScore();
    // Hook up a real submission (email service, backend, sheet) here
    statusEl.textContent = `Thanks! Your evaluation was received. Final score: ${score} / ${TOTAL}.`;
    form.reset();
  });
})();
