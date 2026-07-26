const fs = require('fs');
const path = require('path');
const { SECTIONS, PUBLIC_DIR, ROOT_DIR, readDoc, buildSidebar, mkdirp, layout, homeLayout } = require('./lib/shared');

function copyLogo() {
  mkdirp(PUBLIC_DIR);
  const src = path.join(ROOT_DIR, 'assets', 'logo.png');
  const dest = path.join(PUBLIC_DIR, 'logo.png');
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  } else {
    console.log('  Warning: assets/logo.png not found');
  }
}

const SECTION_DESCRIPTIONS = {
  'About': 'Get to know Nuri — who we are, where we came from, and where we\'re headed.',
  'Policies': 'Our commitments to you — returns, shipping, privacy, and your rights as a customer.',
  'Brand': 'Our visual identity, voice, and guidelines for representing Nuri.',
};

const SECTION_DOCS = SECTIONS.map(section => {
  const docs = section.items.map(item => {
    const slug = item.file.replace('.md', '').split('/').pop();
    return { slug, label: item.label };
  });
  return { ...section, docs, desc: SECTION_DESCRIPTIONS[section.title] || '' };
});

function build() {
  copyLogo();
  mkdirp(PUBLIC_DIR);
  const docsDir = path.join(PUBLIC_DIR, 'docs');
  mkdirp(docsDir);

  // Clean generated files only
  const indexFile = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexFile)) fs.unlinkSync(indexFile);
  for (const f of fs.readdirSync(docsDir)) {
    if (f.endsWith('.html')) fs.unlinkSync(path.join(docsDir, f));
  }

  const totalDocs = SECTIONS.reduce((sum, s) => sum + s.items.length, 0);

  // Section cards
  const sectionCards = SECTION_DOCS.map(section => {
    const firstSlug = section.docs[0].slug;
    const docList = section.docs.map(d =>
      `<li><a href="/docs/${d.slug}" data-spa>${d.label}</a></li>`
    ).join('');
    return `<a class="home-section-card" href="/docs/${firstSlug}" data-spa>
      <div class="home-section-card-top">
        <div class="home-section-card-icon">${section.icon}</div>
        <div>
          <div class="home-section-card-title">${section.title}</div>
          <div class="home-section-card-count">${section.items.length} document${section.items.length > 1 ? 's' : ''}</div>
        </div>
      </div>
      <div class="home-section-card-desc">${section.desc}</div>
      <ul class="home-section-card-list">${docList}</ul>
      <div class="home-section-card-arrow"><span>View all</span> &rarr;</div>
    </a>`;
  }).join('');

  // Featured quick links (mix from all sections)
  const featured = [
    { slug: 'Company-Profile', icon: '🏢', label: 'Company Profile' },
    { slug: 'Return-Refund-Policy', icon: '🔄', label: 'Return & Refund' },
    { slug: 'Shipping-Policy', icon: '📦', label: 'Shipping Policy' },
    { slug: 'Founder-Declaration', icon: '👤', label: 'Our Founder' },
    { slug: 'Brand-Book', icon: '🎨', label: 'Brand Guidelines' },
    { slug: 'Consumer-Rights-Legal-Contact', icon: '⚖️', label: 'Consumer Rights' },
  ];
  const featuredLinks = featured.map(f =>
    `<a class="home-featured-item" href="/docs/${f.slug}" data-spa>
      <span class="icon">${f.icon}</span>
      <span>${f.label}</span>
      <span class="arrow">&rarr;</span>
    </a>`
  ).join('');

  const homeHtml = `
    <div class="home-hero">
      <img src="/logo.png" alt="Nuri" class="home-hero-logo">
      <h1><span class="accent">Nuri</span> Documentation</h1>
      <p>Everything about Nuri — our story, policies, products, and the people behind the brand. Welcome in.</p>
      <div class="home-hero-actions">
        <a href="/docs/Company-Profile" class="home-btn home-btn-primary" data-spa>
          <span>&#128214;</span> Read our story
        </a>
        <a href="/docs/Return-Refund-Policy" class="home-btn home-btn-secondary" data-spa>
          <span>&#128203;</span> View policies
        </a>
      </div>
    </div>

    <div class="home-stats">
      <div class="home-stat">
        <div class="home-stat-num">${totalDocs}</div>
        <div class="home-stat-label">Documents</div>
      </div>
      <div class="home-stat">
        <div class="home-stat-num">${SECTIONS.length}</div>
        <div class="home-stat-label">Sections</div>
      </div>
      <div class="home-stat">
        <div class="home-stat-num">24/7</div>
        <div class="home-stat-label">Online</div>
      </div>
    </div>

    <hr class="home-divider">

    <div class="home-section-header">
      <h2>Browse by Section</h2>
      <p>Explore our documentation organized by topic.</p>
    </div>

    <div class="home-sections">
      ${sectionCards}
    </div>

    <hr class="home-divider">

    <div class="home-section-header">
      <h2>Quick Links</h2>
      <p>Jump straight to the most popular documents.</p>
    </div>

    <div class="home-featured">
      <div class="home-featured-grid">
        ${featuredLinks}
      </div>
    </div>

    <div class="home-cta">
      <h2>Can't find what you're looking for?</h2>
      <p>Reach out to us anytime — we're happy to help.</p>
      <a href="mailto:nuri@shubhamos.com" class="home-btn home-btn-primary">
        <span>&#9993;</span> nuri@shubhamos.com
      </a>
    </div>

    <div class="home-footer">
      <div class="home-footer-links">
        <a href="https://nuri.shubhamos.com" target="_blank">nuri.shubhamos.com</a>
        <a href="https://nuri.shubhamos.com/privacy" target="_blank" rel="noopener">Privacy Policy</a>
        <a href="mailto:nuri@shubhamos.com">Contact</a>
      </div>
      &copy; ${new Date().getFullYear()} Nuri. All rights reserved.
    </div>
  `;

  const indexHtml = homeLayout(homeHtml);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), indexHtml);
  console.log('  /index.html');

  // Build doc pages
  for (const section of SECTIONS) {
    for (const item of section.items) {
      const slug = item.file.replace('.md', '').split('/').pop();
      const doc = readDoc(item.file);
      if (!doc) { console.log('  SKIP ' + item.file); continue; }

      const title = doc.frontmatter.title || item.label;
      const html = layout(title, buildSidebar(item.file), `
        <div class="breadcrumb">
          <a href="/">Docs</a> &rsaquo; <a href="/docs/${slug}">${section.title}</a> &rsaquo; ${title}
        </div>
        <h1>${title}</h1>
        ${doc.html}
      `);

      fs.writeFileSync(path.join(PUBLIC_DIR, 'docs', slug + '.html'), html);
      console.log('  /docs/' + slug + '.html');
    }
  }

  console.log('\nBuild complete.');
}

build();
