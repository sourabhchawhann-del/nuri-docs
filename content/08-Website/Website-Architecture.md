# Website Architecture

- **Document ID**: WB-001
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Active

## Overview

Nuri is a full-stack e-commerce application:

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS.
- **Backend**: Express 4 + TypeScript (REST API).
- **Database**: MariaDB (via Sequelize ORM).
- **Cache/Rate-limit**: Redis (where configured).
- **Storage**: Cloudinary for images.
- **Payments**: Razorpay.
- **Email**: SMTP provider via backend email service.

## High-Level Flow

Browser → Next.js (customer/admin/auth routes) → Express API (`/api/v1`) →
MariaDB + Redis + Cloudinary/Razorpay/SMTP.

## Routing Groups (Frontend)
- `(customer)` — public storefront (shop, product, cart, about, legal pages).
- `admin` — admin dashboard (protected).
- `auth` — login/register.

## API Groups (Backend)
- `auth`, `products`, `categories`, `cart`, `orders`, `wishlist`, `reviews`,
  `coupons`, `address`, `admin`, `upload`, `contact`, `feedback`, `email`,
  `sitemap`, `robots`, `tracking`, `turnstile`, `tag`.
