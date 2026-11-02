/* ---------- Tokens ---------- */
:root {
  --green-900: #12372a;
  --green-600: #2f7d5b;
  --green-100: #e6f1ea;
  --ink: #1b1f1d;
  --paper: #ffffff;
  --muted: #5d6762;

  --font: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --radius: 8px;
  --max-width: 1100px;
}

/* ---------- Base ---------- */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 4.5rem; }
body {
  margin: 0;
  font-family: var(--font);
  color: var(--ink);
  background: var(--paper);
  line-height: 1.6;
}
img { max-width: 100%; display: block; }
a { color: var(--green-600); }
:focus-visible { outline: 3px solid var(--green-600); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

/* ---------- Layout ---------- */
.container { max-width: var(--max-width); margin: 0 auto; padding: 0 1.25rem; }
.section { padding: 4rem 0; }
.section-alt { background: var(--green-100); }
.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

/* ---------- Header / Nav ---------- */
.site-header {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.9rem 1.25rem;
  background: var(--green-900);
}
.logo { color: #fff; font-weight: 700; font-size: 1.25rem; text-decoration: none; }
.site-nav { display: flex; gap: 1.5rem; }
.site-nav a { color: #fff; text-decoration: none; }
.site-nav a:hover { text-decoration: underline; }
.nav-toggle {
  display: none; background: none; color: #fff;
  border: 1px solid #fff; border-radius: var(--radius); padding: 0.4rem 0.8rem; cursor: pointer;
}

/* ---------- Hero ---------- */
.hero { padding: 7rem 0; background: var(--green-900); color: #fff; }

/* ---------- Components ---------- */
.btn {
  display: inline-block; padding: 0.7rem 1.4rem;
  background: var(--green-600); color: #fff;
  border: 0; border-radius: var(--radius);
  font: inherit; text-decoration: none; cursor: pointer;
}
.btn:hover { background: var(--green-900); }

.card { background: var(--paper); border-radius: var(--radius); overflow: hidden; border: 1px solid #d5e2da; }

form { display: grid; gap: 0.5rem; max-width: 520px; }
input, textarea {
  width: 100%; padding: 0.6rem; font: inherit;
  border: 1px solid #b9c9c0; border-radius: var(--radius);
}
.form-status { margin: 0; color: var(--muted); }

/* ---------- Footer ---------- */
.site-footer { padding: 2rem 0; background: var(--green-900); color: #fff; text-align: center; }

/* ---------- Mobile ---------- */
@media (max-width: 700px) {
  .nav-toggle { display: block; }
  .site-nav {
    display: none; position: absolute; top: 100%; left: 0; right: 0;
    flex-direction: column; gap: 0; background: var(--green-900);
  }
  .site-nav.open { display: flex; }
  .site-nav a { padding: 0.9rem 1.25rem; }
}
