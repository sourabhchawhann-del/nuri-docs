# Maintenance Checklist

- **Document ID**: WB-006
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Checklist

## Weekly
- [ ] Review error logs (backend + frontend).
- [ ] Check failed payments / Razorpay webhooks.
- [ ] Verify inventory counts vs. backend.
- [ ] Review customer support inbox.

## Monthly
- [ ] Apply dependency updates (npm audit fix review).
- [ ] Review CSP/security headers after changes.
- [ ] Backup database (see Backup-Procedure.md).
- [ ] Update sitemap if routes changed.

## Quarterly
- [ ] Review legal pages for accuracy.
- [ ] Rotate secrets where policy requires.
- [ ] Performance review (Lighthouse).

## Before Any Deploy
- [ ] Type-check both apps.
- [ ] Smoke-test checkout, auth, and legal pages.
- [ ] Confirm env vars set in target environment.
