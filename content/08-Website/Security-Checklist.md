# Security Checklist

- **Document ID**: WB-008
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Checklist

## Already Implemented (verified in code)
- [x] Helmet security headers
- [x] Content-Security-Policy (CSP) configured in next.config.js
- [x] Rate limiting (express-rate-limit + Redis)
- [x] Input validation (express-validator)
- [x] Output sanitization (sanitize middleware)
- [x] CSRF protection (csrf middleware)
- [x] CORS restricted to allowed origin
- [x] Password hashing (bcrypt)
- [x] JWT auth with refresh tokens
- [x] Honeypot + Turnstile (bot protection)
- [x] Idempotency + HMAC signing for sensitive routes
- [x] XSS protection via CSP + sanitization

## To Maintain
- [ ] Keep dependencies patched (`npm audit`).
- [ ] Rotate JWT and webhook secrets periodically.
- [ ] Enforce HTTPS + HSTS in production.
- [ ] Review CSP after adding new third-party scripts.
- [ ] Monitor auth anomalies (anomaly/risk-score services present).
- [ ] Restrict admin routes by role server-side (not just UI).
- [ ] Regular secret scan of repo.
