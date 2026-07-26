# Cookie Policy (Internal Record)

- **Document ID**: LP-CP-001
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Active

## Purpose

Records Nuri's cookie usage and consent approach, aligned with the public `/cookie-policy` and
`/cookie-preferences` pages.

## Cookie Categories

| Category | Purpose | Requires Consent |
| --- | --- | --- |
| Essential | Authentication, session security, cart, CSRF | No (always on) |
| Analytics | Understand site usage and improve experience | Yes |
| Marketing | Measure campaigns and show relevant content | Yes |

## Consent Mechanism

- A consent banner appears on first visit with **Accept All**, **Deny**, and **Customise** options.
- Choice stored in `localStorage` under key `nuri-cookie-consent`.
- Users can revisit choices any time via `/cookie-preferences` (footer link).
- Declining non-essential cookies does not block site usage.

## Compliance Notes

- Designed for transparency and basic GDPR/CCPA awareness and Indian privacy considerations.
- No personal data is sold. Analytics/marketing cookies load only after consent.
- This notice does not constitute legal advice; review with counsel before international launch.
