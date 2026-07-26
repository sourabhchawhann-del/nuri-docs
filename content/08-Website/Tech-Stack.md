# Tech Stack

- **Document ID**: WB-003
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Active

## Frontend
- Next.js 14.2 (App Router, React Server Components)
- React 18, TypeScript 5
- Tailwind CSS (custom forest/bamboo theme)
- Zustand (state), TanStack Query (data), React Hook Form + Zod (forms)
- lucide-react (icons), react-hot-toast (toasts)
- Next Image (AVIF/WebP optimization)

## Backend
- Node.js + Express 4, TypeScript 5
- Sequelize 6 ORM over MariaDB
- Redis (rate limiting / cache where configured)
- Helmet (security headers), express-rate-limit, express-validator
- Bcrypt (password hashing), jsonwebtoken (auth)
- Cloudinary (image CDN), Razorpay (payments)
- Nodemailer/SMTP (email)

## Infra & Tooling
- Docker / Docker Compose (backend)
- Cloudflare tunnel (dev exposure)
- ESLint / TypeScript strict mode
