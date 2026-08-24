# MicJasiri Security-Sanitized Production Baseline

## Provenance

- Source domain: `https://micjasiri.co.ke`
- Production document root: `/home/mmcywidp/public_html`
- Archive filename: `micjasiri-public-html-2026-08-25.zip`
- Archive path: `/Users/admin/Desktop/mcjasiri/micjasiri-public-html-2026-08-25.zip`
- Archive size: 45,384,440 bytes
- Archive SHA-256: `ee77ca6d6da9312a863fa97085310e9ec4bedc9953912866d81bdc3a144a97f7`
- Import date: 2026-08-25 (Africa/Nairobi)
- Original extracted website root: `/tmp/micjasiri-import.iJ5aF7`
- Sanitization working copy: `/Users/admin/Desktop/mcjasiri/micjasiri-sanitized-work`

The original archive is the authoritative historical backup. The Git baseline is intentionally security-sanitized and is not byte-for-byte identical to the production archive.

## Technology

The site is a static, single-page HTML website. `index.html` contains the page markup, embedded CSS, and embedded JavaScript. Images and the hero video are separate production assets, while several partner/portfolio images are embedded as data URIs. There is no React/Vite source project, compiled hashed frontend bundle, WordPress installation, PHP entry point, or package manifest in the backup.

The available file is editable source, but it is monolithic: navigation, sections, forms, content, styles, and scripts are concentrated in one large HTML file. Structural changes are possible with careful regression testing.

## Imported Production Payload

- Imported production files: 28
- Imported production payload: 25,155,299 bytes, before repository documentation and `.gitignore`
- Sanitized `index.html` SHA-256: `9e2301f4a52963ada366194a95bcba4a24594ab9663ef3e823d6c8028e721614`
- All imported production files other than `index.html` match the original extraction byte-for-byte.
- `.htaccess` is preserved.
- The public Formspree configuration, anchors, images, video, and page content are preserved.

### Ten largest imported production files

| File | Bytes |
| --- | ---: |
| `FINAL_SHORTER_VERSION_.mp4` | 3,427,888 |
| `manama.jpg` | 2,364,632 |
| `index.html` | 1,889,685 |
| `drum.jpg` | 1,843,654 |
| `con6.jpg` | 1,809,484 |
| `con2.jpg` | 1,482,130 |
| `50.jpg` | 1,220,074 |
| `con4.jpg` | 1,173,237 |
| `con5.jpg` | 1,038,182 |
| `guitar.jpg` | 961,445 |

## Exclusions

| File | Reason |
| --- | --- |
| `.well-known.zip` | Redundant full-site backup archive; backup archives must not be committed. |
| `main.jpg` | Confirmed by file inspection to be AppleDouble metadata, not a valid visual JPEG asset. |
| `bizz.jpg` | Confirmed by file inspection to be AppleDouble metadata, not a valid visual JPEG asset. |

The actual `.well-known/` directory was inspected separately from `.well-known.zip`. Its `acme-challenge/` directory was empty in the backup, so no SSL challenge token was imported or excluded.

## Security and Large Files

- The original `index.html` contained a hardcoded browser-side administrator credential comparison and an embedded in-memory administrative/contact dataset.
- The fake administrator control, overlay, authentication, datastore, records, mutation helpers, and related styling were removed from the Git version.
- No credential value is recorded in this document.
- The post-sanitization filename and text scans found no credential-like assignment, private-key header, provider secret/token, Bearer token, secret file, nested `.git` directory, ZIP archive, or SQL dump.
- No imported file exceeds 50 MiB, 90 MiB, or GitHub's normal 100 MiB per-file limit.
- `FINAL_SHORTER_VERSION_.mp4` is 3,427,888 bytes.

## Local Run Method

Run from the repository root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

## Known Limitations

- The Git baseline intentionally differs from production because insecure administrator functionality and records were removed.
- The missing local `favicon.png` reference is documented but intentionally not fixed in this baseline.
- Several `href="#"` placeholder links remain unchanged.
- The HTML validator reports pre-existing markup warnings.
- The site remains a large monolithic HTML document with embedded data-URI images.
- No production deployment or cPanel change was performed.

No public application content was intentionally modified except where required to remove the insecure administrator control and implementation. No floating-navigation change or unrelated UI fix is included.
