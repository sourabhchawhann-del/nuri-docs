# Environment Variables (Template)

- **Document ID**: WB-005
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Template

> Copy `.env.example` to `.env` and fill real values. Never commit `.env`.

## Frontend (`nuri-frontend/.env`)
```
NEXT_PUBLIC_API_URL=https://api.nuri.example.com/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_SITE_URL=https://nuri.example.com
```

## Backend (`nuri-backend/.env`)
```
PORT=5000
NODE_ENV=production

# Database (MariaDB)
DB_HOST=
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASSWORD=

# Auth
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
BCRYPT_SALT_ROUNDS=

# CORS
FRONTEND_URL=
ALLOWED_ORIGIN=

# Email (SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Rate limiting
RATE_LIMIT_WINDOW_MS=
RATE_LIMIT_MAX_REQUESTS=

# Uploads
MAX_FILE_SIZE=
ALLOWED_FILE_TYPES=

# JWT
JWT_ISSUER=
JWT_AUDIENCE=
```

## Security
- Store secrets in a secrets manager or environment, not in code.
- Rotate `JWT_SECRET` and payment/webhook secrets periodically.
