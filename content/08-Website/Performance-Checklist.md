# Performance Checklist

- **Document ID**: WB-009
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Checklist

## Images
- [ ] Use Next Image (AVIF/WebP) — configured.
- [ ] Lazy-load below-the-fold images.
- [ ] Correct sizes attributes to avoid layout shift.

## Caching
- [ ] Static assets immutable cache (configured in next.config.js).
- [ ] API responses cached where safe (e.g. products revalidate).
- [ ] CDN for images (Cloudinary).

## Runtime
- [ ] React Server Components for static content.
- [ ] Minimize client JS bundles (optimizePackageImports).
- [ ] Remove console in production (configured).

## Monitoring
- [ ] Run Lighthouse monthly (target 90+ mobile).
- [ ] Track Core Web Vitals (LCP, CLS, INP).
