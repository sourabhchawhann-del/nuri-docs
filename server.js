const express = require('express');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const app = express();
const PORT = 4000;
const DOCS_DIR = path.join(__dirname, 'content');

const SECTIONS = [
  { title: 'About', icon: '🌿', items: [
    { file: '01-Company/Company-Profile.md', label: 'Company Profile' },
    { file: '01-Company/Founder-Declaration.md', label: 'Our Founder' },
    { file: '01-Company/Company-Roadmap.md', label: 'Our Journey' },
    { file: '01-Company/Business-Goals.md', label: 'Our Mission' },
  ]},
  { title: 'Policies', icon: '📜', items: [
    { file: '02-Legal/Return-Refund-Policy.md', label: 'Return & Refund' },
    { file: '02-Legal/Shipping-Policy.md', label: 'Shipping Policy' },
    { file: '02-Legal/Cookie-Policy.md', label: 'Cookie Policy' },
    { file: '02-Legal/Disclaimer.md', label: 'Disclaimer' },
    { file: '02-Legal/Copyright-Notice.md', label: 'Copyright' },
    { file: '02-Legal/Intellectual-Property-Ownership.md', label: 'IP Notice' },
    { file: '02-Legal/Acceptable-Use-Accessibility.md', label: 'Acceptable Use' },
    { file: '02-Legal/Consumer-Rights-Legal-Contact.md', label: 'Consumer Rights' },
  ]},
  { title: 'Brand', icon: '🎨', items: [
    { file: '03-Brand/Brand-Book.md', label: 'Brand Guidelines' },
  ]},
];

function readDoc(filePath) {
  const fullPath = path.join(DOCS_DIR, filePath);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(raw);
  return { frontmatter: data, content, html: marked(content) };
}

function findDocBySlug(slug) {
  for (const section of SECTIONS) {
    for (const item of section.items) {
      const base = item.file.replace('.md', '').split('/').pop();
      if (base === slug) return { ...item, section: section.title };
    }
  }
  return null;
}

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --green: #245a24; --green-light: #2e7d32; --green-hover: #1b4d1b;
  --cream: #fefdfb; --cream-soft: #faf7f2; --cream-border: #f0ece3;
  --text: #1a1a1a; --text-muted: #6b7280; --text-light: #9ca3af;
  --white: #ffffff; --shadow: 0 1px 3px rgba(0,0,0,0.06);
  --radius: 12px; --radius-sm: 8px;
}
html { scroll-behavior: smooth; }
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--cream); color: var(--text); line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
::selection { background: rgba(36,90,36,0.12); }
.topbar {
  position: sticky; top: 0; z-index: 100;
  background: rgba(254,253,251,0.85); backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--cream-border);
  padding: 0 32px; height: 64px; display: flex; align-items: center;
}
.topbar-inner {
  width: 100%; max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
}
.topbar-logo {
  display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text);
}
.topbar-logo img { height: 36px; width: auto; border-radius: 8px; }
.topbar-logo span { font-size: 18px; font-weight: 700; color: var(--green); }
.topbar-nav { display: flex; gap: 6px; align-items: center; }
.topbar-nav a {
  font-size: 13px; font-weight: 500; color: var(--text-muted);
  text-decoration: none; padding: 6px 14px; border-radius: 20px; transition: all 0.2s;
}
.topbar-nav a:hover { color: var(--green); background: rgba(36,90,36,0.06); }
.topbar-nav a.privacy-link {
  color: var(--green); background: rgba(36,90,36,0.08); font-weight: 600;
}
.topbar-nav a.privacy-link:hover { background: rgba(36,90,36,0.14); }
.layout { display: flex; min-height: calc(100vh - 64px); }
.sidebar {
  width: 260px; background: var(--white); border-right: 1px solid var(--cream-border);
  position: fixed; top: 64px; left: 0; bottom: 0; overflow-y: auto;
  padding: 20px 0; z-index: 10;
}
.sidebar::-webkit-scrollbar { width: 4px; }
.sidebar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
.nav-section { margin-bottom: 4px; }
.nav-section-title {
  padding: 10px 20px 4px; font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--text-light);
}
.nav-item {
  display: block; padding: 7px 20px 7px 34px; font-size: 13px; color: var(--text-muted);
  text-decoration: none; transition: all 0.15s; border-left: 2px solid transparent;
  margin: 0 8px 1px 0; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
.nav-item:hover { color: var(--text); background: rgba(36,90,36,0.03); }
.nav-item.active {
  color: var(--green); background: rgba(36,90,36,0.06);
  border-left-color: var(--green); font-weight: 600;
}
.main { flex: 1; margin-left: 260px; padding: 40px 48px 80px; max-width: 860px; }
.content h1 { font-size: 28px; font-weight: 700; color: var(--text); margin-bottom: 6px; letter-spacing: -0.02em; }
.content h2 { font-size: 20px; font-weight: 600; margin: 32px 0 10px; color: var(--text); padding-bottom: 8px; border-bottom: 1px solid var(--cream-border); }
.content h3 { font-size: 16px; font-weight: 600; margin: 20px 0 8px; }
.content h4 { font-size: 14px; font-weight: 600; margin: 16px 0 4px; color: var(--text-muted); }
.content p { margin-bottom: 12px; color: #333; }
.content ul, .content ol { margin: 6px 0 14px 20px; }
.content li { margin-bottom: 5px; color: #333; }
.content a { color: var(--green); text-decoration: underline; text-underline-offset: 2px; }
.content a:hover { color: var(--green-hover); }
.content code { font-family: 'JetBrains Mono', monospace; font-size: 13px; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; color: var(--green); }
.content pre { background: #1a1a2e; color: #e0e0e0; padding: 18px 20px; border-radius: var(--radius-sm); overflow-x: auto; margin: 14px 0 20px; font-size: 13px; line-height: 1.6; }
.content pre code { background: none; padding: 0; color: inherit; }
.content table { width: 100%; border-collapse: collapse; margin: 14px 0 20px; font-size: 13px; }
.content th, .content td { padding: 9px 12px; border: 1px solid var(--cream-border); text-align: left; }
.content th { background: var(--cream-soft); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; }
.content blockquote { border-left: 3px solid var(--green); background: rgba(36,90,36,0.03); padding: 12px 16px; margin: 14px 0; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; color: var(--text-muted); font-style: italic; }
.content hr { border: none; height: 1px; background: var(--cream-border); margin: 24px 0; }
.content strong { font-weight: 600; color: var(--text); }
.breadcrumb { font-size: 12px; color: var(--text-light); margin-bottom: 14px; }
.breadcrumb a { color: var(--green); text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }
.meta { font-size: 12px; color: var(--text-light); margin-bottom: 20px; }
.hero { text-align: center; padding: 56px 0 40px; }
.hero h1 { font-size: 36px; font-weight: 700; color: var(--text); margin-bottom: 10px; letter-spacing: -0.02em; }
.hero p { font-size: 15px; color: var(--text-muted); max-width: 480px; margin: 0 auto; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-top: 32px; }
.grid-card { background: var(--white); border: 1px solid var(--cream-border); border-radius: var(--radius); padding: 22px; text-decoration: none; color: var(--text); transition: all 0.2s; box-shadow: var(--shadow); }
.grid-card:hover { border-color: rgba(36,90,36,0.2); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(36,90,36,0.08); }
.grid-card .icon { font-size: 24px; margin-bottom: 8px; }
.grid-card h3 { font-size: 14px; font-weight: 600; margin-bottom: 3px; }
.grid-card p { font-size: 12px; color: var(--text-muted); }
.footer { margin-top: 64px; padding: 24px 0; border-top: 1px solid var(--cream-border); text-align: center; font-size: 12px; color: var(--text-light); }
.footer a { color: var(--green); text-decoration: none; }
.footer a:hover { text-decoration: underline; }
.menu-toggle { display: none; position: fixed; top: 16px; left: 16px; z-index: 20; background: var(--white); color: var(--green); border: 1px solid var(--cream-border); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 18px; cursor: pointer; box-shadow: var(--shadow); }
@media (max-width: 768px) {
  .topbar-nav { display: none; }
  .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 30; }
  .sidebar.open { transform: translateX(0); box-shadow: 4px 0 20px rgba(0,0,0,0.1); }
  .main { margin-left: 0; padding: 24px 20px 60px; }
  .menu-toggle { display: block; }
  .hero h1 { font-size: 28px; }
  .grid { grid-template-columns: 1fr; }
}
.location-badge { font-size: 11px; font-weight: 600; color: var(--green); background: rgba(36,90,36,0.08); padding: 3px 10px; border-radius: 12px; margin-right: 8px; }
.turnstile-wrap { margin-top: 32px; padding: 20px; background: var(--cream-soft); border: 1px solid var(--cream-border); border-radius: var(--radius-sm); }
.turnstile-wrap p { font-size: 12px; color: var(--text-light); margin-bottom: 10px; }

/* Turnstile Gate Overlay */
.ts-gate {
  position: fixed; inset: 0; z-index: 9999;
  background: var(--cream);
  display: flex; align-items: center; justify-content: center; flex-direction: column;
  transition: opacity 0.4s ease, visibility 0.4s;
}
.ts-gate.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
.ts-gate-box {
  background: var(--white); border: 1px solid var(--cream-border);
  border-radius: var(--radius); padding: 40px 48px; text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.06); max-width: 420px; width: 90%;
}
.ts-gate-logo { height: 48px; width: auto; border-radius: 10px; margin-bottom: 16px; }
.ts-gate-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.ts-gate-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }
.ts-gate-spinner {
  width: 28px; height: 28px; border: 3px solid var(--cream-border);
  border-top-color: var(--green); border-radius: 50%;
  animation: spin 0.7s linear infinite; margin: 16px auto 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
.ts-gate-error { font-size: 12px; color: #dc2626; margin-top: 12px; display: none; }
`;

function layout(title, sidebarHtml, contentHtml, activeFile = '') {
  const sitekey = process.env.TURNSTILE_SITEKEY || '0x4AAAAAAA';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Nuri Docs</title>
  <link rel="icon" href="/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${CSS}</style>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
  <div id="ts-gate" class="ts-gate">
    <div class="ts-gate-box">
      <img src="/logo.png" alt="Nuri" class="ts-gate-logo">
      <div class="ts-gate-title">Verify you're human</div>
      <div class="ts-gate-sub">Complete the check below to access Nuri Docs.</div>
      <div class="cf-turnstile" data-sitekey="${sitekey}" data-theme="light" data-callback="onTurnstileSuccess"></div>
      <div id="ts-gate-error" class="ts-gate-error">Verification failed. Please try again.</div>
      <div id="ts-gate-spinner" class="ts-gate-spinner"></div>
    </div>
  </div>
  <button class="menu-toggle" onclick="document.querySelector('.sidebar').classList.toggle('open')">&#9776;</button>
  <header class="topbar">
    <div class="topbar-inner">
      <a href="/" class="topbar-logo" data-spa>
        <img src="/logo.png" alt="Nuri">
        <span>Docs</span>
      </a>
      <nav class="topbar-nav">
        <span id="location-badge" class="location-badge" style="display:none"></span>
        <a href="https://nuri.shubhamos.com" target="_blank">nuri.shubhamos.com</a>
        <a href="https://nuri.shubhamos.com/privacy" target="_blank" rel="noopener" class="privacy-link">Privacy Policy &rarr;</a>
      </nav>
    </div>
  </header>
  <div class="layout">
    <nav class="sidebar">${sidebarHtml}</nav>
    <main class="main">
      <div id="doc-content" class="content">${contentHtml}</div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Nuri. All rights reserved. &middot;
        <a href="https://nuri.shubhamos.com" target="_blank">nuri.shubhamos.com</a> &middot;
        <a href="https://nuri.shubhamos.com/privacy" target="_blank" rel="noopener">Privacy Policy</a>
      </div>
    </main>
  </div>
  <script>
  (function(){
    var TS_LOCAL='nuri_ts_verified';
    var gate=document.getElementById('ts-gate');
    var errEl=document.getElementById('ts-gate-error');
    var spinner=document.getElementById('ts-gate-spinner');

    function hasCookie(name){return document.cookie.split(';').some(function(c){return c.trim().startsWith(name+'=');});}
    function isVerified(){return hasCookie('nuri_ts_verified') || localStorage.getItem(TS_LOCAL)==='1';}

    if(isVerified()){
      gate.classList.add('hidden');
      document.body.style.overflow='';
    } else {
      document.body.style.overflow='hidden';
    }

    window.onTurnstileSuccess=function(token){
      errEl.style.display='none';
      fetch('/api/verify',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({token:token})
      }).then(function(r){return r.json();}).then(function(data){
        if(data.ok){
          try{localStorage.setItem(TS_LOCAL,'1');}catch(e){}
          gate.classList.add('hidden');
          document.body.style.overflow='';
        } else {
          errEl.textContent=data.error||'Verification failed. Please try again.';
          errEl.style.display='block';
          if(spinner)spinner.style.display='none';
        }
      }).catch(function(){
        try{localStorage.setItem(TS_LOCAL,'1');}catch(e){}
        gate.classList.add('hidden');
        document.body.style.overflow='';
      });
    };

    window.onTurnstileError=function(){
      errEl.style.display='block';
      if(spinner)spinner.style.display='none';
    };

    setTimeout(function(){
      if(!isVerified() && !window.turnstile){
        errEl.textContent='Verification service unavailable. Please refresh.';
        errEl.style.display='block';
        if(spinner)spinner.style.display='none';
      }
    },8000);

    // --- Visited tracker ---
    var STORAGE_KEY='nuri_docs_visited';
    function getVisited(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{};}catch(e){return {};}}
    function markVisited(s){var v=getVisited();v[s]=Date.now();localStorage.setItem(STORAGE_KEY,JSON.stringify(v));}
    function isVisited(s){return !!getVisited()[s];}
    var cs=location.pathname.replace('/docs/','').replace('.html','').replace('/','');
    if(cs&&cs!=='')markVisited(cs);
    function updateDots(){document.querySelectorAll('.nav-item').forEach(function(a){var s=a.getAttribute('href').replace('/docs/','').replace('.html','');if(isVisited(s)&&!a.querySelector('.visited-dot')){var d=document.createElement('span');d.className='visited-dot';d.style.cssText='display:inline-block;width:6px;height:6px;border-radius:50%;background:#22c55e;margin-left:6px;vertical-align:middle;';a.appendChild(d);}});}
    updateDots();

    document.querySelectorAll('a[data-spa],.nav-item,.grid-card').forEach(function(link){link.addEventListener('click',function(e){var href=this.getAttribute('href');if(!href||(!href.startsWith('/docs/')&&href!=='/'))return;if(e.metaKey||e.ctrlKey)return;e.preventDefault();history.pushState({},'',href);fetch(href).then(function(r){return r.text();}).then(function(html){var doc=new DOMParser().parseFromString(html,'text/html');var nc=doc.querySelector('#doc-content');var ns=doc.querySelector('.sidebar');if(nc)document.querySelector('#doc-content').innerHTML=nc.innerHTML;if(ns)document.querySelector('.sidebar').innerHTML=ns.innerHTML;document.title=doc.title;var s=href.replace('/docs/','').replace('.html','').replace('/','');if(s)markVisited(s);updateDots();window.scrollTo(0,0);});});});
    window.addEventListener('popstate',function(){location.reload();});

    if(navigator.geolocation){navigator.geolocation.getCurrentPosition(function(pos){var lat=pos.coords.latitude;var lon=pos.coords.longitude;var r='Global';if(lat>6&&lat<38&&lon>68&&lon<98)r='India';else if(lat>24&&lat<50&&lon>-130&&lon<-60)r='North America';else if(lat>-10&&lat<55&&lon>-20&&lon<55)r='Europe';else if(lat>-10&&lat<55&&lon>95&&lon<155)r='Asia Pacific';var b=document.getElementById('location-badge');if(b){b.textContent=r;b.style.display='inline-block';}},function(){},{timeout:5000});}
  })();
  </script>
</body>
</html>`;
}

function buildSidebar(activeFile) {
  return SECTIONS.map(section => {
    const items = section.items.map(item => {
      const isActive = item.file === activeFile;
      const slug = item.file.replace('.md', '').split('/').pop();
      return `<a class="nav-item${isActive ? ' active' : ''}" href="/docs/${slug}" data-spa>${item.label}</a>`;
    }).join('');
    return `<div class="nav-section"><div class="nav-section-title">${section.icon} ${section.title}</div>${items}</div>`;
  }).join('');
}

app.get('/', (req, res) => {
  const cards = SECTIONS.map(section => {
    const slug = section.items[0].file.replace('.md', '').split('/').pop();
    return `<a class="grid-card" href="/docs/${slug}" data-spa><div class="icon">${section.icon}</div><h3>${section.title}</h3><p>${section.items.length} document${section.items.length > 1 ? 's' : ''}</p></a>`;
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
  const updated = doc.frontmatter['last-updated'] || doc.frontmatter.updated || '';
  res.send(layout(title, buildSidebar(docInfo.file), `
    <div class="breadcrumb"><a href="/">Docs</a> &rsaquo; <a href="/docs/${req.params.slug}">${docInfo.section}</a> &rsaquo; ${title}</div>
    <h1>${title}</h1>
    ${updated ? `<div class="meta">Last updated: ${updated}</div>` : ''}
    ${doc.html}
  `, docInfo.file));
});

app.get('/docs', (req, res) => res.redirect('/'));
app.listen(PORT, () => console.log(`Nuri Docs running at http://localhost:${PORT}`));
