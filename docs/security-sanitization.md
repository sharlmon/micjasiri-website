# Security Sanitization Record

## Authoritative Source

- Original archive: `micjasiri-public-html-2026-08-25.zip`
- Original archive SHA-256: `ee77ca6d6da9312a863fa97085310e9ec4bedc9953912866d81bdc3a144a97f7`
- Original extraction: `/tmp/micjasiri-import.iJ5aF7`
- Sanitization copy: `/Users/admin/Desktop/mcjasiri/micjasiri-sanitized-work`

The original ZIP and original extracted backup remain unchanged. Sanitization was performed only in a new copy.

## Files Intentionally Excluded

- `.well-known.zip`: an intact redundant full-site archive nested inside the production document root. It was excluded because Git must not contain backup archives and because a publicly reachable site backup would increase exposure.
- `main.jpg`: confirmed AppleDouble metadata rather than a valid visual asset.
- `bizz.jpg`: confirmed AppleDouble metadata rather than a valid visual asset.

The empty `.well-known/acme-challenge/` structure was distinguished from the excluded `.well-known.zip`; no challenge token was present.

## Sections Intentionally Removed from `index.html`

- The public Admin navigation button.
- Admin-button, overlay, login, dashboard, table, form, status, and responsive CSS.
- The complete administrator overlay/login/dashboard HTML.
- The hardcoded browser-side username/password comparison and fake login/logout functions.
- The browser-only administrator datastore.
- All contact-like names, email addresses, messages, statuses, dates, and administrative records held in that datastore.
- The contact-form success callback that mirrored submissions into the browser-only admin store. Formspree submission remains unchanged.
- Administrator message rendering, statistics, portfolio, service, partner, settings, and success-notification functions.
- Administrator backdrop and keyboard event handling.
- The obsolete hidden-admin-trigger comment.

The combined administrator/mobile Escape handler was replaced with a mobile-menu-only Escape handler so existing public mobile-menu behavior remains available.

## Rationale

Client-side credentials cannot provide authentication: every visitor can download and inspect the comparison logic and credential literals. Preserving those values in Git would perpetuate a prohibited hardcoded administrator password and falsely imply that the browser-only dashboard was protected.

The embedded contact records were removed because they were delivered to every public visitor as JavaScript data. Their provenance and consent status were not established, and they were unnecessary for public page operation. No replacement personal records were invented.

`.well-known.zip` was excluded because it duplicates the site as a backup archive and is unrelated to the actual `.well-known/` protocol directory. Backup archives are intentionally barred from Git.

## Verification

- No secret value is included in this document.
- The sanitized `index.html` contains no Admin UI/code marker, hardcoded credential comparison, login implementation, administrator datastore, or embedded administrative/contact dataset.
- The exact source-to-sanitized `index.html` diff is 2 inserted lines and 449 deleted lines.
- Original `index.html`: 1,916,077 bytes.
- Sanitized `index.html`: 1,889,685 bytes.
- Net reduction: 26,392 bytes.
- The public Formspree endpoint, contact form, main navigation anchors, layout, images, video, and WhatsApp control were retained.

This Git baseline is intentionally security-sanitized and is therefore not byte-for-byte identical to current production. The historical archive and its checksum remain the authoritative record of the original production files.
