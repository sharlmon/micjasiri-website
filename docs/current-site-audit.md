# Current Site Audit

## Architecture

- Technology: static single-page HTML with embedded CSS and JavaScript.
- Source availability: editable monolithic source; not a compiled frontend bundle.
- Main entry point: `index.html`.
- Header/navigation markup: `index.html`, beginning near line 1045 in the sanitized baseline.
- Mobile-menu markup: `index.html`, beginning near line 1066.
- Homepage hero: `index.html`, beginning near line 1076.
- Main styles: the inline `<style>` block in `index.html`, lines 41–1035.
- Header styles: `#navbar` and related `.nav-*` rules beginning near line 82.
- Main scripts: the inline `<script>` block in `index.html`, lines 1792–2372.
- Scroll/header logic: near line 2070.
- Mobile-menu logic: near line 2076.
- Public contact/Formspree logic: near line 2110.
- WhatsApp control: near line 2374.

## Navigation Behavior

The header is fixed from initial page load. Its desktop height is controlled by `--nav-h: 118px`; the mobile breakpoint changes this to 92px. A passive window scroll listener adds `.scrolled` after 60px, changing background, border, and shadow but not the header height.

The site is a single page. Desktop and mobile menu items use anchors for About, Services, Portfolio, Partners, Clients, and Contact. Get a Quote points to `#contact`, which exists. The former Admin control was a same-page fake browser dashboard and has been intentionally removed; no alternate administrator URL was invented.

At `max-width: 768px`, desktop links and the quote button are hidden and the hamburger control is displayed. The mobile menu is a fixed full-screen overlay. Opening it locks body scrolling; selecting a menu item or pressing Escape closes it. Current accessibility limitations include a non-native hamburger button, no `aria-expanded` synchronization, no focus trap, and no explicit focus restoration.

The header is not duplicated across separate pages because the site has only one HTML page. WhatsApp is implemented in the same `index.html` source. No `scroll-padding-top` or section `scroll-margin-top` is defined for fixed-header anchor offsets.

## Baseline Findings

| ID | Area | Finding | Severity | Evidence | Suggested later action |
| -- | ---- | ------- | -------- | -------- | ---------------------- |
| SEC-01 | Production exposure | The original production file contains browser-side administrator credentials and records. They are removed from Git, but production was not changed. | Critical | Original extraction and sanitization record | In a separately authorized deployment, remove the fake admin implementation and rotate any reused credential. |
| SEC-02 | Public backup | `.well-known.zip` existed in the production root and may be web-accessible. It is excluded from Git only. | High | Original archive inventory | Verify exposure and remove it from production after preserving the authoritative offline backup. |
| REF-01 | Favicon | `index.html` references missing `favicon.png` twice; the archive contains `faviconL.png`. | Low | Lines 32–33; local request returns 404 | Correct the favicon reference in a later bug-fix task. |
| REF-02 | Links | The logo and three partner cards retain `href="#"` placeholders. | Low | Lines 1047, 1514, 1519, 1524 | Replace with intentional destinations or semantic buttons. |
| NAV-01 | Fixed anchors | The fixed header has no anchor-offset compensation. | Medium | No `scroll-padding` or `scroll-margin` rule | Add a shared offset when implementing the floating header. |
| NAV-02 | Mobile accessibility | Hamburger/menu state lacks native button and complete focus/ARIA management. | Medium | Mobile markup and `toggleMobile()` | Add button semantics, `aria-expanded`, focus trap, Escape handling, and focus restoration. |
| HTML-01 | Markup | Validator reports pre-existing unescaped ampersands and minor link/head warnings. | Low | Static HTML validation | Normalize in a separate markup-cleanup task. |
| FORM-01 | Form endpoint | Contact and review submissions use a public browser-side Formspree endpoint. This is expected client configuration but can be spammed. | Medium | Formspree fetch calls in `index.html` | Confirm Formspree filtering, rate limits, ownership, and notification routing. |
| OPS-01 | Server config | `.htaccess` retains a cPanel PHP 8.2 handler although the imported site is static. | Low | `.htaccess` | Retain for baseline; review only during a deployment/configuration task. |
| SRC-01 | Maintainability | Markup, CSS, JavaScript, and large data-URI images are concentrated in one 1.89 MB file. | Medium | `index.html` size and structure | Decompose only in a separately scoped refactor after visual regression coverage exists. |

## Reference Scan Summary

- Missing local files: `favicon.png` only, referenced twice.
- Duplicate IDs: none detected.
- Missing menu-anchor targets: none detected.
- Placeholder links: four `href="#"` values.
- Mixed-content asset requests: none detected; `http://www.w3.org` values are SVG namespace declarations, not network assets.
- Hardcoded localhost or old-domain URLs: none detected.
- Contact form: no HTML `action`; submission is handled by JavaScript and Formspree.
- Public Get a Quote action: valid same-page `#contact` anchor.
- No unrelated finding was fixed during baseline creation.

## Floating-Navigation Risks for the Next Task

- Changing the fixed header height without coordinating `--nav-h`, anchor offsets, logo sizing, and transition timing can cause overlap or apparent content jumps.
- The current `.scrolled` class already exists, so the smallest implementation should extend it rather than add a second scroll-state system.
- Desktop center links use absolute centering and may collide with the logo/right actions at intermediate widths.
- Mobile menu layering uses z-index 999 below the navbar at 1000; changes must preserve the close control and overlay behavior.
- Hero content begins behind a fixed header by design, so any compensating page padding must be visually regression-tested rather than added globally without review.
