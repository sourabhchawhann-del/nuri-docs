# Shipping Policy (Internal Record)

- **Document ID**: LP-SP-001
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Active

## Purpose

Internal record of Nuri's shipping policy, aligned with the public `/shipping` page.

## Summary

- Processing time: 1–3 business days after payment confirmation.
- Shipping destinations: India (primary); select international where supported.
- Free standard shipping on orders ≥ ₹1,499 within India.
- Delivery estimates are not guaranteed.
- Risk of loss and title pass to the customer upon delivery.
- Undeliverable packages due to bad addresses may be reshipped at additional cost.

## Notes

Carrier and rate details are managed operationally and should be kept current in the Operations Manual.

## Shipping Provider — Shiprocket
Nuri integrates **Shiprocket** (`apiv1.shiprocket.in`) for courier rate calculation, shipment
creation, and order tracking.

- **Rates**: live courier rates via `/courier/serviceability`, used at checkout.
- **Shipment creation**: admin triggers `POST /api/v1/logistics/admin/orders/:id/ship`, which
  creates an adhoc Shiprocket order, stores the AWB (tracking number) + URL, and marks the order
  `shipped`.
- **Tracking**: customers track via `GET /api/v1/logistics/orders/:id/track`; Shiprocket also posts
  status updates to `POST /api/v1/logistics/webhook`, which auto-updates order status.
- **Credentials**: configured via `SHIPROCKET_API_KEY` (direct token) or `SHIPROCKET_EMAIL` +
  `SHIPROCKET_PASSWORD` (login). Pickup/origin address is set via `SHIPROCKET_PICKUP_*`.
- See `08-Website/Shiprocket-Integration.md` for the technical reference.
