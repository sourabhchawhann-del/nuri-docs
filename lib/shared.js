const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT_DIR = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

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
  const fullPath = path.join(CONTENT_DIR, filePath);
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

function mkdirp(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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

/* Top bar */
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
.topbar-logo img { height: 36px; width: auto; border-radius: 8px; transition: transform 0.3s ease, box-shadow 0.3s; }
.topbar-logo:hover img { transform: scale(1.05); box-shadow: 0 2px 12px rgba(36,90,36,0.12); }
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

/* Layout */
.layout { display: flex; min-height: calc(100vh - 64px); }

/* Sidebar */
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
  text-decoration: none; transition: all 0.2s ease, border-left-color 0.15s;
  border-left: 2px solid transparent;
  margin: 0 8px 1px 0; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  animation: slideInLeft 0.25s ease-out both;
}
.nav-item:hover { color: var(--text); background: rgba(36,90,36,0.03); padding-left: 38px; }
.nav-item.active {
  color: var(--green); background: rgba(36,90,36,0.06);
  border-left-color: var(--green); font-weight: 600;
}
.nav-section:nth-child(1) .nav-item:nth-child(1) { animation-delay: 0.02s; }
.nav-section:nth-child(1) .nav-item:nth-child(2) { animation-delay: 0.04s; }
.nav-section:nth-child(1) .nav-item:nth-child(3) { animation-delay: 0.06s; }
.nav-section:nth-child(1) .nav-item:nth-child(4) { animation-delay: 0.08s; }
.nav-section:nth-child(2) .nav-item:nth-child(1) { animation-delay: 0.10s; }
.nav-section:nth-child(2) .nav-item:nth-child(2) { animation-delay: 0.12s; }
.nav-section:nth-child(2) .nav-item:nth-child(3) { animation-delay: 0.14s; }
.nav-section:nth-child(2) .nav-item:nth-child(4) { animation-delay: 0.16s; }
.nav-section:nth-child(2) .nav-item:nth-child(5) { animation-delay: 0.18s; }
.nav-section:nth-child(2) .nav-item:nth-child(6) { animation-delay: 0.20s; }
.nav-section:nth-child(2) .nav-item:nth-child(7) { animation-delay: 0.22s; }
.nav-section:nth-child(2) .nav-item:nth-child(8) { animation-delay: 0.24s; }
.nav-section:nth-child(3) .nav-item:nth-child(1) { animation-delay: 0.26s; }

/* Main content */
.main { flex: 1; margin-left: 260px; padding: 40px 48px 80px; max-width: 860px; }

/* Content typography */
.content { animation: fadeIn 0.3s ease-out; }
.content h1 { font-size: 28px; font-weight: 700; color: var(--text); margin-bottom: 6px; letter-spacing: -0.02em; animation: fadeInUp 0.35s ease-out; }
.content h2 { font-size: 20px; font-weight: 600; margin: 32px 0 10px; color: var(--text); padding-bottom: 8px; border-bottom: 1px solid var(--cream-border); animation: fadeInUp 0.4s ease-out; }
.content h3 { font-size: 16px; font-weight: 600; margin: 20px 0 8px; }
.content h4 { font-size: 14px; font-weight: 600; margin: 16px 0 4px; color: var(--text-muted); }
.content p { margin-bottom: 12px; color: #333; animation: fadeIn 0.45s ease-out; }
.content ul, .content ol { margin: 6px 0 14px 20px; animation: fadeIn 0.45s ease-out; }
.content li { margin-bottom: 5px; color: #333; }
.content a {
  color: var(--green); text-decoration: none;
  background-image: linear-gradient(var(--green), var(--green));
  background-size: 0% 1px; background-position: 0 100%; background-repeat: no-repeat;
  transition: background-size 0.3s ease;
}
.content a:hover { background-size: 100% 1px; }
.content code {
  font-family: 'JetBrains Mono', monospace; font-size: 13px;
  background: #f3f4f6; padding: 2px 6px; border-radius: 4px; color: var(--green);
}
.content pre {
  background: #1a1a2e; color: #e0e0e0; padding: 18px 20px;
  border-radius: var(--radius-sm); overflow-x: auto; margin: 14px 0 20px;
  font-size: 13px; line-height: 1.6;
}
.content pre code { background: none; padding: 0; color: inherit; }
.content table { width: 100%; border-collapse: collapse; margin: 14px 0 20px; font-size: 13px; animation: fadeIn 0.45s ease-out; }
.content th, .content td { padding: 9px 12px; border: 1px solid var(--cream-border); text-align: left; }
.content th { background: var(--cream-soft); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; }
.content tr { transition: background 0.15s; }
.content tbody tr:hover { background: rgba(36,90,36,0.02); }
.content blockquote {
  border-left: 3px solid var(--green); background: rgba(36,90,36,0.03);
  padding: 12px 16px; margin: 14px 0; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--text-muted); font-style: italic; animation: fadeIn 0.45s ease-out;
}
.content hr { border: none; height: 1px; background: var(--cream-border); margin: 24px 0; }
.content strong { font-weight: 600; color: var(--text); }

/* Breadcrumb & meta */
.breadcrumb { font-size: 12px; color: var(--text-light); margin-bottom: 14px; animation: fadeIn 0.3s ease-out; }
.breadcrumb a { color: var(--green); text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }
.meta { font-size: 12px; color: var(--text-light); margin-bottom: 20px; }

/* Hero */
.hero { text-align: center; padding: 56px 0 40px; }
.hero h1 { font-size: 36px; font-weight: 700; color: var(--text); margin-bottom: 10px; letter-spacing: -0.02em; animation: fadeInUp 0.5s ease-out; }
.hero p { font-size: 15px; color: var(--text-muted); max-width: 480px; margin: 0 auto; animation: fadeInUp 0.6s ease-out; }

/* Grid */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-top: 32px; }
.grid-card {
  background: var(--white); border: 1px solid var(--cream-border);
  border-radius: var(--radius); padding: 22px; text-decoration: none; color: var(--text);
  transition: all 0.2s; box-shadow: var(--shadow);
  opacity: 0; animation: fadeInUp 0.4s ease-out forwards;
}
.grid-card:hover {
  border-color: rgba(36,90,36,0.2); transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(36,90,36,0.08);
}
.grid-card:active { transform: scale(0.98); transition: transform 0.1s; }
.grid-card:nth-child(1) { animation-delay: 0.05s; }
.grid-card:nth-child(2) { animation-delay: 0.1s; }
.grid-card:nth-child(3) { animation-delay: 0.15s; }
.grid-card:nth-child(4) { animation-delay: 0.2s; }
.grid-card:nth-child(5) { animation-delay: 0.25s; }
.grid-card:nth-child(6) { animation-delay: 0.3s; }
.grid-card .icon { font-size: 24px; margin-bottom: 8px; }
.grid-card h3 { font-size: 14px; font-weight: 600; margin-bottom: 3px; }
.grid-card p { font-size: 12px; color: var(--text-muted); }

/* Footer */
.footer {
  margin-top: 64px; padding: 24px 0; border-top: 1px solid var(--cream-border);
  text-align: center; font-size: 12px; color: var(--text-light);
  animation: fadeIn 0.5s ease-out 0.3s both;
}
.footer a { color: var(--green); text-decoration: none; }
.footer a:hover { text-decoration: underline; }

/* Mobile */
.menu-toggle {
  display: none; position: fixed; top: 16px; left: 16px; z-index: 20;
  background: var(--white); color: var(--green); border: 1px solid var(--cream-border);
  border-radius: var(--radius-sm); padding: 8px 12px; font-size: 18px;
  cursor: pointer; box-shadow: var(--shadow);
}
@media (max-width: 768px) {
  .topbar-nav { display: none; }
  .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; z-index: 30; }
  .sidebar.open { transform: translateX(0); box-shadow: 4px 0 20px rgba(0,0,0,0.1); }
  .main { margin-left: 0; padding: 24px 20px 60px; }
  .menu-toggle { display: block; }
  .hero h1 { font-size: 28px; }
  .grid { grid-template-columns: 1fr; }
}

/* Location badge */
.location-badge {
  font-size: 11px; font-weight: 600; color: var(--green); background: rgba(36,90,36,0.08);
  padding: 3px 10px; border-radius: 12px; margin-right: 8px;
  animation: fadeIn 0.5s ease-out 1s both, badgePulse 2s ease-in-out 1.5s 1;
}

/* Visited dot */
.visited-dot { animation: popIn 0.3s ease-out; }

/* SPA transition */
.content.transitioning {
  animation: none; opacity: 0; transform: translateY(8px);
  transition: opacity 0.15s, transform 0.15s;
}
.content.transitioning.active { opacity: 1; transform: translateY(0); }

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
  animation: scaleIn 0.35s ease-out;
}
.ts-gate-logo { height: 48px; width: auto; border-radius: 10px; margin-bottom: 16px; }
.ts-gate-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.ts-gate-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }
.ts-gate-spinner {
  width: 28px; height: 28px; border: 3px solid var(--cream-border);
  border-top-color: var(--green); border-radius: 50%;
  animation: spin 0.7s linear infinite; margin: 16px auto 0;
}
.ts-gate-error { font-size: 12px; color: #dc2626; margin-top: 12px; display: none; }

/* Keyframes */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes badgePulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(36,90,36,0.15); } 50% { box-shadow: 0 0 0 4px rgba(36,90,36,0); } }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }

/* === HOME PAGE === */
.home-wrap { max-width: 100%; margin-left: 0; padding: 0; }
.home-hero {
  position: relative; text-align: center; padding: 72px 32px 56px;
  background: linear-gradient(180deg, rgba(36,90,36,0.03) 0%, transparent 100%);
  overflow: hidden;
}
.home-hero::before {
  content: ''; position: absolute; top: -120px; left: 50%; transform: translateX(-50%);
  width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(36,90,36,0.06) 0%, transparent 70%);
  pointer-events: none; animation: heroGlow 6s ease-in-out infinite;
}
@keyframes heroGlow {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.6; }
  50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
}
.home-hero-logo {
  width: 72px; height: 72px; border-radius: 18px; margin: 0 auto 20px;
  box-shadow: 0 8px 32px rgba(36,90,36,0.12);
  animation: logoFloat 3s ease-in-out infinite;
}
@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.home-hero h1 {
  font-size: 44px; font-weight: 800; letter-spacing: -0.03em;
  margin-bottom: 12px; position: relative;
  animation: fadeInUp 0.5s ease-out;
}
.home-hero h1 .accent {
  background: linear-gradient(135deg, var(--green) 0%, var(--green-light) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.home-hero p {
  font-size: 17px; color: var(--text-muted); max-width: 520px; margin: 0 auto 28px;
  line-height: 1.7; animation: fadeInUp 0.6s ease-out 0.1s both;
}
.home-hero-actions {
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}
.home-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600;
  text-decoration: none; transition: all 0.25s ease; cursor: pointer; border: none;
}
.home-btn-primary {
  background: var(--green); color: var(--white);
  box-shadow: 0 4px 16px rgba(36,90,36,0.25);
}
.home-btn-primary:hover {
  background: var(--green-hover); transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(36,90,36,0.3);
}
.home-btn-secondary {
  background: var(--white); color: var(--text);
  border: 1px solid var(--cream-border); box-shadow: var(--shadow);
}
.home-btn-secondary:hover {
  border-color: rgba(36,90,36,0.2); transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

/* Stats bar */
.home-stats {
  display: flex; justify-content: center; gap: 48px; padding: 28px 32px;
  margin: 0 auto; max-width: 700px;
  animation: fadeIn 0.5s ease-out 0.3s both;
}
.home-stat { text-align: center; }
.home-stat-num {
  font-size: 28px; font-weight: 800; color: var(--green);
  letter-spacing: -0.02em; line-height: 1;
}
.home-stat-label {
  font-size: 12px; color: var(--text-light); font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;
}

/* Divider */
.home-divider {
  height: 1px; background: var(--cream-border); max-width: 800px;
  margin: 0 auto; border: none;
}

/* Section header */
.home-section-header {
  text-align: center; padding: 48px 32px 8px;
}
.home-section-header h2 {
  font-size: 24px; font-weight: 700; letter-spacing: -0.02em;
  color: var(--text); margin-bottom: 6px;
}
.home-section-header p {
  font-size: 14px; color: var(--text-muted);
}

/* Section cards */
.home-sections {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px; padding: 24px 32px; max-width: 1000px; margin: 0 auto;
}
.home-section-card {
  background: var(--white); border: 1px solid var(--cream-border);
  border-radius: 16px; padding: 28px; text-decoration: none; color: var(--text);
  transition: all 0.3s ease; box-shadow: var(--shadow); position: relative;
  opacity: 0; animation: fadeInUp 0.5s ease-out forwards;
  display: flex; flex-direction: column;
}
.home-section-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--green), var(--green-light));
  opacity: 0; transition: opacity 0.3s;
}
.home-section-card:hover {
  border-color: rgba(36,90,36,0.2); transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(36,90,36,0.1);
}
.home-section-card:hover::before { opacity: 1; }
.home-section-card:nth-child(1) { animation-delay: 0.05s; }
.home-section-card:nth-child(2) { animation-delay: 0.12s; }
.home-section-card:nth-child(3) { animation-delay: 0.19s; }
.home-section-card-top {
  display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
}
.home-section-card-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; background: rgba(36,90,36,0.06);
}
.home-section-card-title {
  font-size: 17px; font-weight: 700; color: var(--text);
}
.home-section-card-count {
  font-size: 12px; color: var(--text-light); font-weight: 500;
}
.home-section-card-desc {
  font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;
}
.home-section-card-list {
  list-style: none; padding: 0; margin: 0; flex: 1;
}
.home-section-card-list li {
  padding: 6px 0; border-top: 1px solid var(--cream-border);
  font-size: 13px; color: var(--text); display: flex; align-items: center; gap: 8px;
}
.home-section-card-list li::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  background: var(--green); opacity: 0.4; flex-shrink: 0;
}
.home-section-card-arrow {
  font-size: 18px; color: var(--text-light); transition: all 0.25s;
  margin-top: 16px; text-align: right;
}
.home-section-card:hover .home-section-card-arrow {
  color: var(--green); transform: translateX(3px);
}

/* Featured docs */
.home-featured {
  max-width: 1000px; margin: 0 auto; padding: 0 32px 48px;
}
.home-featured-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.home-featured-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; background: var(--white); border: 1px solid var(--cream-border);
  border-radius: 10px; text-decoration: none; color: var(--text);
  transition: all 0.2s; font-size: 13px; font-weight: 500;
}
.home-featured-item:hover {
  border-color: rgba(36,90,36,0.2); background: rgba(36,90,36,0.02);
  transform: translateX(4px);
}
.home-featured-item .icon { font-size: 18px; opacity: 0.7; }
.home-featured-item .arrow {
  margin-left: auto; color: var(--text-light); transition: color 0.2s;
}
.home-featured-item:hover .arrow { color: var(--green); }

/* Home CTA */
.home-cta {
  text-align: center; padding: 48px 32px 56px;
  background: linear-gradient(180deg, transparent 0%, rgba(36,90,36,0.02) 100%);
}
.home-cta h2 {
  font-size: 22px; font-weight: 700; margin-bottom: 8px;
}
.home-cta p {
  font-size: 14px; color: var(--text-muted); margin-bottom: 20px;
}

/* Home footer */
.home-footer {
  padding: 28px 32px; border-top: 1px solid var(--cream-border);
  text-align: center; font-size: 12px; color: var(--text-light);
}
.home-footer a { color: var(--green); text-decoration: none; }
.home-footer a:hover { text-decoration: underline; }
.home-footer-links {
  display: flex; justify-content: center; gap: 20px; margin-bottom: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .home-hero { padding: 48px 20px 40px; }
  .home-hero h1 { font-size: 30px; }
  .home-hero p { font-size: 15px; }
  .home-stats { gap: 24px; }
  .home-stat-num { font-size: 22px; }
  .home-sections { grid-template-columns: 1fr; padding: 16px 20px; }
  .home-featured-grid { grid-template-columns: 1fr; }
  .home-hero-actions { flex-direction: column; align-items: center; }
}
`;

const CLIENT_JS = `
(function(){
  var TS_LOCAL='nuri_ts_verified';
  var gate=document.getElementById('ts-gate');
  var errEl=document.getElementById('ts-gate-error');
  var spinner=document.getElementById('ts-gate-spinner');
  var isHome=!document.getElementById('doc-content');
  var isDoc=!!document.getElementById('doc-content');

  function hasCookie(n){return document.cookie.split(';').some(function(c){return c.trim().startsWith(n+'=');});}
  function isVerified(){return hasCookie('nuri_ts_verified')||localStorage.getItem(TS_LOCAL)==='1';}

  if(isVerified()){gate.classList.add('hidden');document.body.style.overflow='';}
  else{document.body.style.overflow='hidden';}

  window.onTurnstileSuccess=function(token){
    errEl.style.display='none';
    fetch('/api/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:token})})
    .then(function(r){return r.json();}).then(function(d){
      if(d.ok){try{localStorage.setItem(TS_LOCAL,'1');}catch(e){}gate.classList.add('hidden');document.body.style.overflow='';}
      else{errEl.textContent=d.error||'Verification failed. Please try again.';errEl.style.display='block';if(spinner)spinner.style.display='none';}
    }).catch(function(){try{localStorage.setItem(TS_LOCAL,'1');}catch(e){}gate.classList.add('hidden');document.body.style.overflow='';});
  };
  window.onTurnstileError=function(){errEl.style.display='block';if(spinner)spinner.style.display='none';};
  setTimeout(function(){if(!isVerified()&&!window.turnstile){errEl.textContent='Verification service unavailable. Please refresh.';errEl.style.display='block';if(spinner)spinner.style.display='none';}},8000);

  var STORAGE_KEY='nuri_docs_visited';
  function getVisited(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{};}catch(e){return {};}}
  function markVisited(s){var v=getVisited();v[s]=Date.now();localStorage.setItem(STORAGE_KEY,JSON.stringify(v));}
  function isVisited(s){return !!getVisited()[s];}
  var cs=location.pathname.replace('/docs/','').replace('.html','').replace('/','');
  if(cs&&cs!=='')markVisited(cs);

  function updateDots(){document.querySelectorAll('.nav-item').forEach(function(a){var s=a.getAttribute('href').replace('/docs/','').replace('.html','');if(isVisited(s)&&!a.querySelector('.visited-dot')){var d=document.createElement('span');d.className='visited-dot';d.style.cssText='display:inline-block;width:6px;height:6px;border-radius:50%;background:#22c55e;margin-left:6px;vertical-align:middle;';a.appendChild(d);}});}
  updateDots();

  document.querySelectorAll('a[data-spa]').forEach(function(link){
    link.addEventListener('click',function(e){
      var href=this.getAttribute('href');
      if(!href)return;
      if(e.metaKey||e.ctrlKey)return;
      if(!href.startsWith('/docs/')&&href!=='/')return;
      e.preventDefault();
      if(href==='/'){
        window.location.href='/';
        return;
      }
      if(isHome){
        window.location.href=href;
        return;
      }
      var container=document.querySelector('#doc-content');
      if(!container){window.location.href=href;return;}
      container.classList.add('transitioning');
      setTimeout(function(){
        history.pushState({spa:true},'',href);
        fetch(href).then(function(r){return r.text();}).then(function(html){
          var doc=new DOMParser().parseFromString(html,'text/html');
          var nc=doc.querySelector('#doc-content');
          var ns=doc.querySelector('.sidebar');
          if(nc)container.innerHTML=nc.innerHTML;
          if(ns){var sb=document.querySelector('.sidebar');if(sb)sb.innerHTML=ns.innerHTML;}
          document.title=doc.title;
          var s=href.replace('/docs/','').replace('.html','').replace('/','');
          if(s)markVisited(s);
          updateDots();
          window.scrollTo(0,0);
          requestAnimationFrame(function(){container.classList.remove('transitioning');});
        });
      },120);
    });
  });

  window.addEventListener('popstate',function(e){
    if(e.state&&e.state.spa){location.reload();}
    else{location.reload();}
  });

  if(navigator.geolocation){navigator.geolocation.getCurrentPosition(function(pos){
    var lat=pos.coords.latitude,lon=pos.coords.longitude;
    var r='Global';
    if(lat>6&&lat<38&&lon>68&&lon<98)r='India';
    else if(lat>24&&lat<50&&lon>-130&&lon<-60)r='North America';
    else if(lat>-10&&lat<55&&lon>-20&&lon<55)r='Europe';
    else if(lat>-10&&lat<55&&lon>95&&lon<155)r='Asia Pacific';
    var b=document.getElementById('location-badge');
    if(b){b.textContent=r;b.style.display='inline-block';}
  },function(){},{timeout:5000});}
})();
`;

const TURNSTILE_SITEKEY = process.env.TURNSTILE_SITEKEY || '0x4AAAAAAA';

function layout(title, sidebarHtml, contentHtml) {
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
      <div class="cf-turnstile" data-sitekey="${TURNSTILE_SITEKEY}" data-theme="light" data-callback="onTurnstileSuccess"></div>
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
  <script>${CLIENT_JS}</script>
</body>
</html>`;
}

function homeLayout(contentHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuri Documentation</title>
  <link rel="icon" href="/logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${CSS}</style>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
  <div id="ts-gate" class="ts-gate">
    <div class="ts-gate-box">
      <img src="/logo.png" alt="Nuri" class="ts-gate-logo">
      <div class="ts-gate-title">Verify you're human</div>
      <div class="ts-gate-sub">Complete the check below to access Nuri Docs.</div>
      <div class="cf-turnstile" data-sitekey="${TURNSTILE_SITEKEY}" data-theme="light" data-callback="onTurnstileSuccess"></div>
      <div id="ts-gate-error" class="ts-gate-error">Verification failed. Please try again.</div>
      <div id="ts-gate-spinner" class="ts-gate-spinner"></div>
    </div>
  </div>
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
  <div class="home-wrap">
    ${contentHtml}
  </div>
  <script>${CLIENT_JS}</script>
</body>
</html>`;
}

module.exports = {
  SECTIONS, CSS, CLIENT_JS, TURNSTILE_SITEKEY,
  CONTENT_DIR, PUBLIC_DIR, ROOT_DIR,
  readDoc, findDocBySlug, buildSidebar, mkdirp, layout, homeLayout,
};
