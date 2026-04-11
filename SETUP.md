# Setup Guide — Organiser Edition

This guide walks you through forking and configuring this template for your own event from scratch. No coding required.

---

## Prerequisites

- A GitHub account
- Your event's logo, signature image, and seal (PNG files)
- ~20 minutes

---

## Step 1 — Fork the repository

1. Click **Fork** at the top right of this page
2. Choose your GitHub account as the destination
3. Rename the repo to something event-specific (e.g. `my-conf-2026-certificates`)

---

## Step 2 — Enable GitHub Pages

1. In your forked repo, go to **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose `main` branch, `/ (root)` folder
4. Click **Save**

GitHub will give you a URL like:
```
https://YOUR_USERNAME.github.io/my-conf-2026-certificates/
```

Keep this URL — you'll need it in the next step.

---

## Step 3 — Edit the config file

Open `config/certificate.config.json` and update these fields:

```json
{
  "site_title": "My Conference 2026 — Certificates",
  "org_name": "My Conference 2026",
  "org_logo": "assets/img/logo.png",
  "org_tagline": "Your event tagline",
  "org_website": "https://YOUR_USERNAME.github.io/my-conf-2026-certificates/",

  "certificate": {
    "heading_label": "Certificate of Completion",
    "pre_name_text": "This is to certify that",
    "post_name_text": "has successfully completed",
    "footer_left_label": "Date",
    "footer_right_label": "Authorized By",
    "authorized_by": "Your Name, Event Organizer",
    "primary_color": "#1a2e4a",
    "accent_color": "#c8a951"
  },

  "search_page": {
    "headline": "Find Your Certificate",
    "subtext": "Enter your registered email address.",
    "footer_note": "Can't find yours? Email organizer@example.com"
  },

  "seo": {
    "twitter_handle": "@YourHandle"
  }
}
```

**Important:** set `org_website` to your exact GitHub Pages URL. This is what gets encoded in each attendee's QR code.

---

## Step 4 — Replace the images

Upload your images to `assets/img/`. Replace these files:

| File | Size | Notes |
|------|------|-------|
| `logo.png` | ~200×60px | PNG with transparent background |
| `seal.png` | ~100×100px | Circular PNG, transparent background |
| `signature.png` | ~160×60px | PNG with transparent background |
| `og-default.jpg` | 1200×630px | Used as social preview image (LinkedIn, Twitter) |

You can update the file paths in the config if you use different filenames:
```json
"org_logo": "assets/img/my-logo.png",
"certificate": {
  "seal_image": "assets/img/my-seal.png",
  "signature_image": "assets/img/my-signature.png"
}
```

---

## Step 5 — Update the example attendee file

Open `data/jane-doe-at-example-com.json` and update `workshop`, `date`, and `date_iso` to match your event. Attendees will use this as a reference when creating their own files.

```json
{
  "certificate_id": "jane-doe-at-example-com",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "workshop": "My Conference 2026 — Workshop Title",
  "date": "April 5, 2026",
  "date_iso": "2026-04-05",
  "description": "One sentence describing what attendees completed."
}
```

---

## Step 6 — Update PR template and README

1. Open `.github/PULL_REQUEST_TEMPLATE.md` and update the certificate URL to your repo's GitHub Pages URL
2. Open `README.md` and update the badge URLs and certificate URL to point to your fork

---

## Step 7 — Tell your attendees

Share a link to your repo's README. The contribution flow is fully documented there. Attendees need to:

1. Fork the repo
2. Create `data/their-email-id.json`
3. Open a PR

You review and merge. Their certificate goes live immediately after merge.

---

## Step 8 — Test locally before publishing

```bash
# Requires Node.js
npx serve .

# Or Python
python -m http.server 8080
```

1. Open `http://localhost:8080/?id=jane-doe-at-example-com` — verify the sample certificate renders correctly
2. Click **Download PDF** — verify the PDF is landscape A4 with no print dialog
3. Scan the QR code on the certificate — it should open the same URL

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Certificate not found | Check `certificate_id` matches filename exactly |
| Logo not showing | Check file path in config matches actual file location |
| QR code links to wrong URL | Set `org_website` in config to your exact GitHub Pages URL |
| PDF button does nothing | html2pdf.js CDN may be loading slowly — wait 3 seconds and retry |
| Colors not applying | Ensure config has `certificate.primary_color` and `certificate.accent_color` |

---

## Optional: Custom Domain

Add a `CNAME` file at repo root with your custom domain, then configure DNS:

```
certificates.yoursite.com
```

Update `org_website` in config to match the custom domain.

---

*For issues with the template itself, open an issue on the template repository.*
