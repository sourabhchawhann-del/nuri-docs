# Backup Procedure

- **Document ID**: WB-007
- **Version**: 1.0
- **Created Date**: July 19, 2026
- **Status**: Draft

## Database (MariaDB)
- Schedule automated dumps: `mysqldump nuri > backup-$(date +%F).sql`
- Store backups off-server (object storage or encrypted drive).
- Retain at least 7 daily, 4 weekly, 3 monthly copies.
- Test restore periodically.

## Media (Cloudinary)
- Cloudinary replicates assets; export a manifest periodically.
- For local `public/uploads`, include in backup routine.

## Code
- Git repository is the source of truth; ensure regular pushes.
- Do not store `.env` or secrets in backups unencrypted.

## Recovery
- Restore DB from latest verified dump.
- Redeploy backend/frontend from git at the matching tag.
- Verify with smoke test before informing users.
