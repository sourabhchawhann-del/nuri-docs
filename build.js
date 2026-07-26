const fs = require('fs');
const path = require('path');
const { SECTIONS, PUBLIC_DIR, ROOT_DIR, readDoc, buildSidebar, mkdirp, layout } = require('./lib/shared');

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

  const cards = SECTIONS.map(section => {
    const first = section.items[0];
    const slug = first.file.replace('.md', '').split('/').pop();
    return `<a class="grid-card" href="/docs/${slug}" data-spa>
      <div class="icon">${section.icon}</div>
      <h3>${section.title}</h3>
      <p>${section.items.length} document${section.items.length > 1 ? 's' : ''}</p>
    </a>`;
  }).join('');

  const indexHtml = layout('Home', buildSidebar(''), `
    <div class="hero">
      <h1>Nuri Documentation</h1>
      <p>Everything about Nuri — our story, policies, products, and more.</p>
    </div>
    <div class="grid">${cards}</div>
  `);

  fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), indexHtml);
  console.log('  /index.html');

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
