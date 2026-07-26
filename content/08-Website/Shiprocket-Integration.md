# Shiprocket Integration

- **Document ID**: WB-012
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Active

## Overview
Nuri's backend integrates [Shiprocket](https://shiprocket.in) for shipping. Implementation lives in
`nuri-backend/src/services/shiprocket.service.ts` with routes in `src/routes/shiprocket.routes.ts`.

## Configuration (`nuri-backend/.env`)
| Variable | Purpose |
| --- | --- |
| `SHIPROCKET_API_KEY` | Used directly as a Bearer token (preferred if you generated an API token) |
| `SHIPROCKET_API_TOKEN` | Alternative name for the direct token |
| `SHIPROCKET_EMAIL` / `SHIPROCKET_PASSWORD` | Login credentials (service fetches a token at runtime) |
| `SHIPROCKET_BASE_URL` | API base (default `https://apiv1.shiprocket.in/v1/external`) |
| `SHIPROCKET_PICKUP_*` | Origin/pickup address (Vadodara, Gujarat, India) |

> Token auth is cached in Redis (23h) and memory. If both `SHIPROCKET_API_KEY` and email/password
> are set, the direct key takes priority.

## API Surface
| Method & Path | Auth | Purpose |
| --- | --- | --- |
| `POST /api/v1/logistics/rates` | User | Live courier rates for a pincode + weight |
| `GET /api/v1/logistics/track/:awb` | User | Track by AWB |
| `GET /api/v1/logistics/orders/:id/track` | User (owner) | Track a customer's own order |
| `POST /api/v1/logistics/admin/orders/:id/ship` | Admin | Create Shiprocket shipment + mark shipped |
| `POST /api/v1/logistics/webhook` | Public | Shiprocket status push (updates order) |

## Flow
1. **Checkout** calls `POST /rates` with the delivery pincode → shows live shipping charge.
2. **Admin** ships an order via `POST .../admin/orders/:id/ship` → adhoc Shiprocket order created,
   AWB stored as `trackingNumber`, order set to `shipped`, customer emailed.
3. **Tracking** is available to the customer and kept fresh via the Shiprocket webhook, which maps
   Shiprocket statuses to internal `OrderStatus` (`delivered`, `shipped`, `cancelled`, etc.).

## Webhook Relay (Vercel)
Shiprocket posts webhooks to a **standalone Vercel function** (`shiprocket-relay` project) instead of
the backend directly. This avoids Cloudflare Bot Fight Mode, which blocks Shiprocket's requests to the
main site, while keeping the backend private.

```
Shiprocket
   │  POST  (x-api-key)
   ▼
Vercel  /api/fulfillment          (project: shiprocket-relay)
   │  POST  (x-internal-secret)
   ▼
Backend  /api/v1/logistics/webhook   (requires x-internal-secret, else 401)
   │
   ▼
Updates order tracking status
```

- **Relay code**: `shiprocket-relay/api/fulfillment.js` (zero-build Vercel Node function).
- **Backend webhook** (`src/controllers/shiprocket.controller.ts`) now rejects any request missing a
  valid `x-internal-secret` header or non-JSON `Content-Type` with `401`. It never trusts public traffic.

### Secrets
| Secret | Between | Set in |
| --- | --- | --- |
| `SHIPROCKET_WEBHOOK_KEY` | Shiprocket → Vercel | Vercel env + Shiprocket webhook settings |
| `INTERNAL_WEBHOOK_SECRET` | Vercel → Backend | Vercel env + `nuri-backend/.env` (must match) |

### Shiprocket webhook settings
- **URL**: `https://webhook.shubhamos.com/api/fulfillment`
- **Auth Token Type**: `x-api-key`
- **Token**: same value as `SHIPROCKET_WEBHOOK_KEY`

## Notes
- The `address.country` default in the Address model is `South Korea` — ensure checkout sends an
  Indian address (pincode/state) so Shiprocket serviceability works.
- Failed Shiprocket calls return clean `400` errors; order creation never blocks on Shiprocket.
- The relay caps payload at 1 MB and returns `500` if the backend is unreachable; logs never include
  secrets or payload bodies.
