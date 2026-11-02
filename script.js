// ---------- Tour data (edit prices and items here; totals are calculated) ----------
const PARTICIPANTS = 5;

const tour = {
  accommodation: [
    { name: 'City Hub Condominium', group: 4900, head: 980 },
  ],
  day1: [
    { name: 'K Pilates Session (₱650/person)', group: 3250, head: 650 },
    { name: 'Forest House Lunch (₱600/person)', group: 3000, head: 600 },
    { name: 'Be Better Wellness Massage (₱800/person)', group: 4000, head: 800 },
    { name: 'OTOO Matcha Drinks (₱250/person)', group: 1250, head: 250 },
    { name: 'OTOO Pottery Workshop (₱800/person)', group: 4000, head: 800 },
  ],
  day2: [
    { name: 'Yoga Session (₱500/person)', group: 2500, head: 500 },
    { name: 'Wagner Cafe Breakfast (estimated for 5 guests)', group: 4560, head: 912 },
    { name: 'Man Apsol x H.O.Y. Brent Cafe Visit (₱500/person)', group: 2500, head: 500 },
    { name: 'Oh My Gulay! Lunch (₱500/person)', group: 2500, head: 500 },
    { name: 'The Pavilion Pickleball Court (₱600/hour)', group: 600, head: 120 },
  ],
  transport: [
    { name: 'Local Transportation and Transfers', group: 1500, head: 300 },
    { name: 'Tour Passport, Collectible Stickers, and Printed Materials', group: 750, head: 150 },
  ],
};

const notes = [
  'The accommodation rate is based on the provided City Hub Condominium rate of ₱4,900.00 for five guests for one night.',
  'The Wagner Café breakfast estimate is based on its published ₱3,800.00 menu for four guests, with an additional estimated ₱760.00 for the fifth guest.',
  'The Pavilion pickleball court rental is based on its published rate of ₱600.00 per hour per court. Paddle rental is not included.',
  'Prices for K Pilates, Forest House, Be Better Wellness Center, OTOO Café, yoga, Man•apsol x H.O.Y. Brent, and Oh My Gulay! are estimated budget allowances because exact current rates were not confirmed.',
  'Transportation costs cover estimated local transfers, including transportation to Camp John Hay.',
  'Tour materials include the printed tour passport, collectible stickers, and other basic materials for the interactive walking tour.',
  'All estimated prices are subject to change depending on the establishments’ actual rates, availability, and applicable charges.',
];

// ---------- Helpers ----------
const money = (n) =>
  '₱ ' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);

function buildTable({ caption, headers, rows, footer }) {
  const head = headers.map((h) => `<th scope="col">${h}</th>`).join('');
  const body = rows
    .map((r) => `<tr><td>${r.name}</td><td class="num">${money(r.group)}</td><td class="num">${money(r.head)}</td></tr>`)
    .join('');
  const foot = footer
    ? `<tfoot><tr><td>${footer.name}</td><td class="num">${money(footer.group)}</td><td class="num">${money(footer.head)}</td></tr></tfoot>`
    : '';
  return `<table><caption class="sr-only">${caption}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody>${foot}</table>`;
}

const standardHeaders = ['Particulars', 'Group Cost', 'Cost per Head'];
const subtotal = (rows) => ({ name: 'Subtotal', group: sum(rows, 'group'), head: sum(rows, 'head') });

// ---------- Render tables ----------
const summaryRows = [
  { name: 'Accommodation Expenses', ...subtotal(tour.accommodation) },
  { name: 'Day 1 Activities & Expenses', ...subtotal(tour.day1) },
  { name: 'Day 2 Activities & Expenses', ...subtotal(tour.day2) },
  { name: 'Transportation & Tour Materials', ...subtotal(tour.transport) },
];
const total = { name: 'Total Estimated Package Cost', group: sum(summaryRows, 'group'), head: sum(summaryRows, 'head') };

const tables = {
  accommodation: buildTable({ caption: 'Accommodation cost', headers: standardHeaders, rows: tour.accommodation, footer: subtotal(tour.accommodation) }),
  day1: buildTable({ caption: 'Day 1 activities and expenses', headers: standardHeaders, rows: tour.day1, footer: subtotal(tour.day1) }),
  day2: buildTable({ caption: 'Day 2 activities and expenses', headers: standardHeaders, rows: tour.day2, footer: subtotal(tour.day2) }),
  transport: buildTable({ caption: 'Transportation and tour materials', headers: standardHeaders, rows: tour.transport, footer: subtotal(tour.transport) }),
  summary: buildTable({ caption: 'Summary of tour costing', headers: ['Particulars', 'Estimated Group Cost', 'Cost per Head'], rows: summaryRows, footer: total }),
  perPerson: `<table><caption class="sr-only">Estimated package cost per participant</caption>
    <thead><tr><th scope="col">Description</th><th scope="col">Amount</th></tr></thead>
    <tbody>
      <tr><td>Total Estimated Package Cost</td><td class="num">${money(total.group)}</td></tr>
      <tr><td>Number of Participants</td><td>${PARTICIPANTS} Persons</td></tr>
    </tbody>
    <tfoot><tr><td>Estimated Cost Per Participant</td><td class="num">${money(total.group / PARTICIPANTS)}</td></tr></tfoot></table>`,
};

document.querySelectorAll('[data-table]').forEach((el) => {
  el.innerHTML = tables[el.dataset.table] || '';
});

const notesList = document.getElementById('notes-list');
notes.forEach((text) => {
  const li = document.createElement('li');
  li.textContent = text;
  notesList.appendChild(li);
});

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
