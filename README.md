# Nuri Docs

Internal documentation for Nuri — company, legal, brand, operations, marketing, finance, and technical docs.

## Structure

```
nuri-docs/
├── content/          # Markdown documents (read at build/runtime)
│   ├── 01-Company/
│   ├── 02-Legal/
│   ├── 03-Brand/
│   ├── 04-Products/
│   ├── 05-Operations/
│   ├── 06-Marketing/
│   ├── 07-Finance/
│   ├── 08-Website/
│   └── 09-Templates/
├── server.js         # Express server (local development)
├── build.js          # Static site generator (Vercel deployment)
├── vercel.json       # Vercel config
└── package.json
```

## Local Development

```bash
npm install
npm start
# Open http://localhost:4000
```

## Vercel Deployment

The site is deployed as a static site on Vercel:

1. `build.js` reads all markdown from `content/` and generates static HTML into `public/`
2. Vercel serves the static files
3. Routes: `/` (home), `/docs/:slug` (doc pages)

To add a new document:
1. Add a `.md` file in the appropriate `content/` subdirectory
2. Add the entry to `SECTIONS` in `build.js` and `server.js`
3. Push to GitHub — Vercel auto-deploys

## Adding Documents

Each markdown file supports YAML frontmatter:

```yaml
---
title: Document Title
last-updated: 2026-07-26
---

# Content starts here
```

## Tech Stack

- **Express** — local dev server
- **gray-matter** — markdown frontmatter parsing
- **marked** — markdown to HTML
- **Vercel** — hosting & deployment
