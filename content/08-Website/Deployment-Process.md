# Deployment Process

- **Document ID**: WB-004
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Draft

## Prerequisites
- Node.js (matching engines), MariaDB, Redis, Cloudinary, Razorpay, SMTP credentials.
- `.env` files for both frontend and backend (copied from `.env.example`).

## Backend
1. Install deps: `npm install`
2. Build: `npm run build` (TypeScript)
3. Run migrations/sync + seed as needed.
4. Start: `npm start` (or via Docker Compose).

## Frontend
1. Install deps: `npm install`
2. Build: `npm run build`
3. Start: `npm start` (production) or `npm run dev` (local).

## Environment
- Set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` on frontend.
- Set all backend secrets in `.env` (see Environment-Variables.md template).
- Enforce HTTPS in production.

## Verification
- [ ] Site loads over HTTPS
- [ ] Legal pages reachable from footer
- [ ] Cookie banner appears on first visit
- [ ] Checkout + Razorpay flow tested
- [ ] Sitemap & robots reachable
