const express = require('express');
const { SECTIONS, readDoc, findDocBySlug, buildSidebar, layout } = require('./lib/shared');

const app = express();
const PORT = 4000;

app.use(express.json());

app.get('/', (req, res) => {
  const cards = SECTIONS.map(section => {
    const slug = section.items[0].file.replace('.md', '').split('/').pop();
    return `<a class="grid-card" href="/docs/${slug}" data-spa>
      <div class="icon">${section.icon}</div>
      <h3>${section.title}</h3>
      <p>${section.items.length} document${section.items.length > 1 ? 's' : ''}</p>
    </a>`;
  }).join('');
  res.send(layout('Home', buildSidebar(''), `
    <div class="hero">
      <h1>Nuri Documentation</h1>
      <p>Everything about Nuri — our story, policies, products, and more.</p>
    </div>
    <div class="grid">${cards}</div>
  `));
});

app.get('/docs/:slug', (req, res) => {
  const docInfo = findDocBySlug(req.params.slug);
  if (!docInfo) return res.status(404).send(layout('Not Found', buildSidebar(''), '<h1>404 — Document not found</h1><p><a href="/">Go back</a></p>'));
  const doc = readDoc(docInfo.file);
  if (!doc) return res.status(404).send(layout('Not Found', buildSidebar(''), '<h1>404 — File missing</h1><p><a href="/">Go back</a></p>'));
  const title = doc.frontmatter.title || docInfo.label;
  res.send(layout(title, buildSidebar(docInfo.file), `
    <div class="breadcrumb"><a href="/">Docs</a> &rsaquo; <a href="/docs/${req.params.slug}">${docInfo.section}</a> &rsaquo; ${title}</div>
    <h1>${title}</h1>
    ${doc.html}
  `));
});

app.get('/docs', (req, res) => res.redirect('/'));
app.listen(PORT, () => console.log(`Nuri Docs running at http://localhost:${PORT}`));
