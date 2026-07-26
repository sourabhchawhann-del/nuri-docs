# Folder Structure

- **Document ID**: WB-002
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Active

## Repository Layout

```
daniya/
├── nuri-frontend/            # Next.js storefront & admin
│   ├── src/
│   │   ├── app/
│   │   │   ├── (customer)/   # public pages + legal pages
│   │   │   ├── admin/        # admin dashboard
│   │   │   ├── auth/         # login/register
│   │   │   ├── layout.tsx    # root layout + global metadata
│   │   │   ├── robots.ts     # robots.txt route
│   │   │   └── sitemap.ts    # sitemap route
│   │   ├── components/       # UI, layout, modals
│   │   ├── lib/              # api client, utils, token
│   │   ├── store/            # zustand stores
│   │   └── styles/           # globals
│   └── public/               # static assets (logo, icons, uploads)
├── nuri-backend/             # Express API
│   ├── src/
│   │   ├── controllers/      # route handlers
│   │   ├── middleware/       # auth, cors, csrf, rate-limit, csp, sanitize
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # route definitions
│   │   ├── services/         # business logic
│   │   └── utils/            # helpers
│   └── public/uploads/       # local upload fallback
├── company-docs/             # this documentation system
└── start.sh                  # convenience launcher
```

## Notes
- Keep secrets in `.env` (gitignored); use `.env.example` as a template.
- Never commit `.env`, uploads, or node_modules.
