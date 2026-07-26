const express = require('express');
const { SECTIONS, readDoc, findDocBySlug, buildSidebar, layout, homeLayout } = require('./lib/shared');

const app = express();
const PORT = 4000;
app.use(express.json());

const DESCS = {
  'About': 'Get to know Nuri — who we are, where we came from, and where we\'re headed.',
  'Policies': 'Our commitments to you — returns, shipping, privacy, and your rights as a customer.',
  'Brand': 'Our visual identity, voice, and guidelines for representing Nuri.',
};
const ICONS = {
  'About': '<svg width="24" height="24" fill="none" stroke="#245a24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  'Policies': '<svg width="24" height="24" fill="none" stroke="#245a24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  'Brand': '<svg width="24" height="24" fill="none" stroke="#245a24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
};
const FEATURED_ICONS = {
  'Company-Profile': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="16" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  'Return-Refund-Policy': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  'Shipping-Policy': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  'Founder-Declaration': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  'Brand-Book': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/></svg>',
  'Consumer-Rights-Legal-Contact': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
};

app.get('/', (req, res) => {
  const totalDocs = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);

  const sectionCards = SECTIONS.map(section => {
    const firstSlug = section.items[0].file.replace('.md', '').split('/').pop();
    const docList = section.items.map(item => '<li>' + item.label + '</li>').join('');
    const icon = ICONS[section.title] || '';
    const desc = DESCS[section.title] || '';
    return '<div class="home-section-card" onclick="window.location=\'/docs/' + firstSlug + '\'" role="link" tabindex="0">' +
      '<div class="home-section-card-top"><div class="home-section-card-icon">' + icon + '</div><div><div class="home-section-card-title">' + section.title + '</div><div class="home-section-card-count">' + section.items.length + ' document' + (section.items.length > 1 ? 's' : '') + '</div></div></div>' +
      '<div class="home-section-card-desc">' + desc + '</div>' +
      '<ul class="home-section-card-list">' + docList + '</ul>' +
      '<div class="home-section-card-arrow"><span>View all</span> <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>' +
    '</div>';
  }).join('');

  const featured = [
    { slug: 'Company-Profile', label: 'Company Profile' },
    { slug: 'Return-Refund-Policy', label: 'Return & Refund' },
    { slug: 'Shipping-Policy', label: 'Shipping Policy' },
    { slug: 'Founder-Declaration', label: 'Our Founder' },
    { slug: 'Brand-Book', label: 'Brand Guidelines' },
    { slug: 'Consumer-Rights-Legal-Contact', label: 'Consumer Rights' },
  ];
  const featuredLinks = featured.map(f => {
    const icon = FEATURED_ICONS[f.slug] || '';
    return '<div class="home-featured-item" onclick="window.location=\'/docs/' + f.slug + '\'" role="link" tabindex="0">' +
      '<span class="icon">' + icon + '</span><span>' + f.label + '</span>' +
      '<span class="arrow"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>' +
    '</div>';
  }).join('');

  res.send(homeLayout(`
    <div class="home-hero">
      <img src="/logo.png" alt="Nuri" class="home-hero-logo">
      <h1><span class="accent">Nuri</span> Documentation</h1>
      <p>Everything about Nuri — our story, policies, products, and the people behind the brand. Welcome in.</p>
      <div class="home-hero-actions">
        <a href="/docs/Company-Profile" class="home-btn home-btn-primary" data-spa>Read our story &rarr;</a>
        <a href="/docs/Return-Refund-Policy" class="home-btn home-btn-secondary" data-spa>View policies &rarr;</a>
      </div>
    </div>
    <div class="home-stats">
      <div class="home-stat"><div class="home-stat-num">${totalDocs}</div><div class="home-stat-label">Documents</div></div>
      <div class="home-stat"><div class="home-stat-num">${SECTIONS.length}</div><div class="home-stat-label">Sections</div></div>
      <div class="home-stat"><div class="home-stat-num">24/7</div><div class="home-stat-label">Online</div></div>
    </div>
    <hr class="home-divider">
    <div class="home-section-header"><h2>Browse by Section</h2><p>Explore our documentation organized by topic.</p></div>
    <div class="home-sections">${sectionCards}</div>
    <hr class="home-divider">
    <div class="home-section-header"><h2>Quick Links</h2><p>Jump straight to the most popular documents.</p></div>
    <div class="home-featured"><div class="home-featured-grid">${featuredLinks}</div></div>
    <div class="home-cta"><h2>Can't find what you're looking for?</h2><p>Reach out to us anytime — we're happy to help.</p><a href="mailto:nuri@shubhamos.com" class="home-btn home-btn-primary">nuri@shubhamos.com</a></div>
    <div class="home-footer"><div class="home-footer-links"><a href="https://nuri.shubhamos.com" target="_blank">nuri.shubhamos.com</a><a href="https://nuri.shubhamos.com/privacy" target="_blank" rel="noopener">Privacy Policy</a><a href="mailto:nuri@shubhamos.com">Contact</a></div>&copy; ${new Date().getFullYear()} Nuri. All rights reserved.</div>
  `));
});

app.get('/docs/:slug', (req, res) => {
  const docInfo = findDocBySlug(req.params.slug);
  if (!docInfo) return res.status(404).send(layout('Not Found', buildSidebar(''), '<h1>404</h1><p><a href="/">Go back</a></p>'));
  const doc = readDoc(docInfo.file);
  if (!doc) return res.status(404).send(layout('Not Found', buildSidebar(''), '<h1>404</h1><p><a href="/">Go back</a></p>'));
  const title = doc.frontmatter.title || docInfo.label;
  res.send(layout(title, buildSidebar(docInfo.file), `
    <div class="breadcrumb"><a href="/">Docs</a> &rsaquo; <a href="/docs/${req.params.slug}">${docInfo.section}</a> &rsaquo; ${title}</div>
    ${doc.html}
  `));
});

app.get('/docs', (req, res) => res.redirect('/'));
app.listen(PORT, () => console.log(`Nuri Docs running at http://localhost:${PORT}`));
