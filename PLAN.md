# PLAN.md — Certificate Generator Template

## 1. Objective

Create and maintain a reusable, zero-backend, static certificate generator that any organiser can fork, brand, and run on GitHub Pages with no build step and no server.

This plan is the source of truth for:
- Technical architecture
- Implementation contracts
- Validation steps
- Gap tracking and follow-up execution

---

## 2. Scope

### In scope
- Static SPA with 2 modes: search and certificate
- Config-driven branding and copy from JSON
- Attendee certificate rendering from JSON files
- QR code generation
- PDF export (A4 landscape)
- SEO + Open Graph + Twitter tags
- JSON-LD structured data for AEO
- Contribution workflow docs and PR template

### Out of scope
- Backend/API/database
- Authentication
- Admin dashboard
- Email delivery
- CI/CD automation (optional follow-up)

---

## 3. Architecture Overview

## Runtime flow
1. Browser loads `index.html`
2. App checks `?id=` query param
3. App always fetches `config/certificate.config.json`
4. If `id` exists:
   - fetch `data/{id}.json`
   - render certificate
   - inject SEO tags and JSON-LD
   - generate QR code
   - enable PDF download
5. If `id` absent:
   - render search view
   - inject Organization JSON-LD

## Stack
- HTML5 + semantic markup
- CSS3 (screen in `style.css`, print in `print.css`)
- Vanilla JS (`assets/js/app.js`)
- qrcode.js CDN (v1.0.0)
- html2pdf.js CDN (v0.10.1)
- GitHub Pages hosting

---

## 4. File Contracts

## Required structure
- `index.html`
- `robots.txt`
- `README.md`
- `CONTRIBUTING.md`
- `SETUP.md`
- `config/certificate.config.json`
- `data/jane-doe-at-example-com.json`
- `assets/css/style.css`
- `assets/css/print.css`
- `assets/js/app.js`
- `assets/img/logo.png`
- `assets/img/seal.png`
- `assets/img/signature.png`
- `assets/img/og-default.jpg`
- `.github/PULL_REQUEST_TEMPLATE.md`

## DOM IDs expected by app.js
- Views: `loading-view`, `search-view`, `certificate-view`, `error-view`
- Search: `search-logo`, `search-org-name`, `search-headline`, `search-subtext`, `lookup-input`, `lookup-btn`, `search-footer-note`
- Certificate: `certificate`, `download-btn`, `cert-logo`, `cert-org-name`, `cert-heading-label`, `cert-pre-name-text`, `cert-name`, `cert-post-name-text`, `cert-workshop`, `cert-description`, `cert-date`, `cert-date-label`, `cert-seal`, `cert-seal-label`, `cert-signature`, `cert-authorized-by`, `cert-sig-label`, `cert-qr`, `cert-qr-section`
- SEO/AEO/Error: `canonical-tag`, `json-ld-block`, `og-title`, `og-description`, `og-url`, `og-image`, `og-site-name`, `tw-title`, `tw-description`, `tw-image`, `tw-site`, `error-message`, `error-detail`, `retry-btn`

---

## 5. Config Schema Contract

`config/certificate.config.json`

## Top-level keys
- `site_title`
- `org_name`
- `org_logo`
- `org_tagline`
- `org_website`
- `certificate`
- `search_page`
- `pdf`
- `seo`
- `meta`

## `certificate` keys
- Labels/text: `heading_label`, `pre_name_text`, `post_name_text`, `footer_left_label`, `footer_right_label`, `authorized_by`, `seal_label`
- Images: `signature_image`, `seal_image`
- Toggles: `show_qr`, `show_description`, `show_seal`
- Visual: `primary_color`, `accent_color`, `background_color`, `text_color`, `muted_color`, `border_color`, `border_width`, `font_heading`, `font_body`

## `search_page` keys
- `headline`, `subtext`, `input_placeholder`, `button_text`, `footer_note`

## `pdf` keys
- `filename_prefix`, `format`, `orientation`, `margin`

## `seo` keys
- `default_og_image`, `twitter_handle`

## Validation guarantees in app.js
- Config must include `org_name` and `certificate`
- `certificate.primary_color` and `certificate.border_color` required

---

## 6. Data Schema Contract

Each attendee file in `data/` must follow:

```json
{
  "certificate_id": "jane-doe-at-example-com",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "workshop": "Workshop Name",
  "date": "April 5, 2026",
  "date_iso": "2026-04-05",
  "description": "Optional sentence"
}
```

## Required fields
- `certificate_id`, `name`, `email`, `workshop`, `date`, `date_iso`

## Filename rule
- filename must equal `certificate_id` + `.json`

## Email-to-ID conversion rule
- lowercase
- `+` → `-plus-`
- `@` → `-at-`
- `.` → `-`
- remove remaining non `[a-z0-9-]`

---

## 7. Functional Modules

## Module A: Boot + routing
- `init()` decides mode using query param
- Uses `Promise.all` in certificate mode
- Displays loading/error views safely

## Module B: Search view
- Renders all content from `search_page`
- Accepts either email or raw ID
- Enter key and button click both supported

## Module C: Certificate view
- Renders all labels from `certificate` config
- Renders attendee fields from attendee JSON
- Handles missing images gracefully
- Supports optional description and seal visibility

## Module D: QR
- Generates 80x80 QR
- Uses `org_website` + `?id=` when configured
- Falls back to current origin/path when not configured
- Uses high error correction level for print survivability

## Module E: PDF
- html2pdf export with landscape A4
- Filename from `pdf.filename_prefix` + cert ID
- Temporarily hides `.no-print` elements during capture

## Module F: SEO + AEO
- Dynamic title/description/canonical
- Dynamic OG + Twitter tags
- JSON-LD `EducationalOccupationalCredential` on certificate page
- JSON-LD `Organization` on search page

---

## 8. UI/UX and Responsiveness Contract

## Desktop
- Search card centered on branded gradient background
- Certificate shown as a floating card with A4 aspect ratio
- Download button fixed on top-right

## Mobile
- Certificate scales proportionally using container query units (`cqw`)
- Download button becomes bottom full-width CTA
- Search card paddings reduced for narrow screens

## Print/PDF
- `@page` size is A4 landscape
- Certificate uses exact 297mm x 210mm
- Non-print elements hidden
- QR kept crisp via print-color-adjust

---

## 9. Documentation Contract

## `README.md` must provide
- What this template is
- Organiser quick start
- Attendee contribution flow
- Data format example
- Local run steps
- Customization table

## `CONTRIBUTING.md` must provide
- Attendee PR process
- Developer contribution process
- Style expectations

## `.github/PULL_REQUEST_TEMPLATE.md` must provide
- Checklist for filename correctness
- Checklist for required fields
- Certificate URL field for submitter

## `SETUP.md` must provide
- End-to-end organiser setup
- GitHub Pages configuration
- Branding and image replacement steps
- Troubleshooting

---

## 10. Validation and Verification Matrix

Run these checks before considering a release complete.

## A. Local smoke test
1. Serve locally (`npx serve .` or `python -m http.server 8080`)
2. Open `/` and confirm search view renders
3. Enter sample email and navigate to certificate
4. Open direct URL with `?id=jane-doe-at-example-com`

## B. Data/rendering
1. Remove a required attendee field and verify error state
2. Break logo path and verify image is hidden gracefully
3. Toggle `show_description`, `show_qr`, `show_seal` and verify behavior

## C. QR + PDF
1. Download PDF and verify landscape A4
2. Confirm no download button visible in PDF
3. Scan QR on screen and in PDF; verify URL points to certificate page

## D. SEO/AEO
1. Inspect head tags for title, description, canonical
2. Inspect OG and Twitter tags values
3. Validate JSON-LD with Rich Results Test
4. Confirm `robots.txt` is accessible and allows crawl

## E. Responsiveness
1. Test at 375x812 (mobile)
2. Test at 768x1024 (tablet)
3. Test at 1366x768 (desktop)
4. Check certificate text scales proportionally on all breakpoints

---

## 11. Current Status Snapshot

## Completed in current implementation
- Template folder scaffold and file structure
- Config-driven UI and rendering
- Search and certificate flows
- QR generation and PDF export
- SEO and structured data injection
- Mobile scaling improvements
- Docs and contribution assets

## Known deltas / follow-up items
1. Add optional secondary Print button (TRD mentions it; current implementation uses Download only)
2. Add automated schema validation script for attendee JSON (optional hardening)
3. Add optional CI check for PRs (JSON lint + naming check)
4. Add optional accessibility audit pass (keyboard order + contrast report)

---

## 12. Agent Execution Plan (for follow-up agents)

When running a follow-up agent, use this sequence:

1. Read this file and map requested work to sections 5–11
2. Implement one module at a time (small, atomic changes)
3. Re-run validation matrix section 10 after each module
4. Update section 11 status snapshot
5. Keep docs aligned with any behavior changes

## Rule of done
A task is done only when:
- code is implemented
- behavior is manually verified
- docs are updated
- no unresolved contract violations remain in sections 4–10

---

## 13. Change Log (plan-level)

- 2026-04-11: Initial comprehensive technical plan created from live implementation in `certificate-generator`.
