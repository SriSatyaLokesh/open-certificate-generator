<div align="center">

# Open Certificate Generator

**A free online certificate generator on GitHub Pages for issuing verifiable certificates**

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=flat-square&logo=github)](https://github.com/new?template_name=certificate-generator&template_owner=srisatyalokesh)
[![GitHub Stars](https://img.shields.io/github/stars/srisatyalokesh/certificate-generator?style=flat-square&logo=github&label=Stars)](https://github.com/srisatyalokesh/certificate-generator/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/srisatyalokesh/certificate-generator?style=flat-square&logo=github&label=Forks)](https://github.com/srisatyalokesh/certificate-generator/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**Zero backend · Zero cost · Zero build step**

[**🎓 Live Demo →**](https://srisatyalokesh.github.io/certificate-generator/)

</div>

---

## What is this?

A fully static web app that generates personalised, printable, downloadable workshop certificates — hosted free on GitHub Pages.

- Every attendee gets a **unique URL** with a **QR code**
- Certificates are **PDF-downloadable** in landscape A4 with one click
- All branding (colors, logo, labels) is controlled by **one JSON config file** — no HTML edits needed
- Attendees submit their data via **GitHub Pull Requests** — no forms, no backend

**To use this for your own event: fork → edit config JSON → replace images → done.**

---

## Quick Start for Organisers

See [SETUP.md](SETUP.md) for the complete step-by-step setup guide.

The short version:

1. Fork this repository
2. Edit `config/certificate.config.json` — update org name, colors, labels
3. Replace images in `assets/img/` — logo, seal, signature, og-default
4. Enable GitHub Pages: **Settings → Pages → Deploy from `main` branch, `/ (root)`**
5. Update `org_website` in config to your new GitHub Pages URL
6. Share the contribution process with your attendees so they open PRs

---

## For Attendees — Claim Your Certificate

> **Quick start:** Fork → create your JSON file → open a PR → get your URL once merged.

### Step 1 — Fork this repository

Click **Fork** (top-right) to create a copy under your GitHub account.

### Step 2 — Convert your email to a file ID

| Rule | Example |
|------|---------|
| Lowercase everything | `Jane.Doe@Example.com` → `jane.doe@example.com` |
| Replace `@` with `-at-` | `jane.doe@example.com` → `jane.doe-at-example.com` |
| Replace every `.` with `-` | `jane.doe-at-example.com` → `jane-doe-at-example-com` |
| Replace `+` with `-plus-` | `jane+tag@...` → `jane-plus-tag-at-...` |

**Your filename:** `data/jane-doe-at-example-com.json`

### Step 3 — Create your data file

In your fork, create `data/your-id-here.json`:

```json
{
  "certificate_id": "jane-doe-at-example-com",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "workshop": "Your Workshop Name Here",
  "date": "April 5, 2026",
  "date_iso": "2026-04-05",
  "description": "One sentence describing what you learned or completed."
}
```

**Field reference:**

| Field | Required | Description |
|-------|----------|-------------|
| `certificate_id` | ✅ | Must exactly match your filename without `.json` |
| `name` | ✅ | Your full name as it should appear on the certificate |
| `email` | ✅ | The email address you registered with |
| `workshop` | ✅ | Exact workshop title — ask the organiser if unsure |
| `date` | ✅ | Human-readable date: `April 5, 2026` |
| `date_iso` | ✅ | ISO date for structured data: `2026-04-05` |
| `description` | optional | One sentence describing what you completed |

> Do not copy sample data as-is. Update every field with your own details.

### Step 4 — Open a Pull Request

Go back to the **original** repository and open a PR from your fork's `main` branch. The PR description auto-fills with a checklist — complete every item and submit.

### Step 5 — Get your certificate

After your PR is merged, your certificate is live at:

```
https://srisatyalokesh.github.io/certificate-generator/?id=jane-doe-at-example-com
```

You can also search by email on the homepage.

---

## Run Locally

No build step required:

```bash
# Node.js
npx serve .

# Python
python -m http.server 8080
```

Open `http://localhost:8080/?id=jane-doe-at-example-com` to preview the sample certificate.

---

## How It Works

```
Browser loads index.html
  │
  ├── ?id= present → fetch config.json + data/{id}.json in parallel
  │     → render certificate, inject SEO tags + JSON-LD, generate QR
  │
  └── no ?id= → fetch config.json
        → render search / landing page
```

All logic lives in `assets/js/app.js`. All branding in `config/certificate.config.json`. No server, no database, no build pipeline.

---

## Customising the Template

Edit **only** `config/certificate.config.json` — the entire UI reads from it:

| Config field | What it controls |
|---|---|
| `org_name` | Org name on certificate and search page |
| `org_logo` | Logo image path |
| `org_website` | URL encoded in each QR code |
| `certificate.primary_color` | Navy background, border, text |
| `certificate.accent_color` | Gold accent, name color |
| `certificate.heading_label` | e.g. "Certificate of Completion" |
| `certificate.authorized_by` | Name below the signature line |
| `search_page.*` | All search page copy |
| `pdf.*` | PDF filename, format, orientation |
| `seo.twitter_handle` | Twitter Card meta tag |

Replace these images in `assets/img/`:

| File | Recommended size | Purpose |
|------|-----------------|---------|
| `logo.png` | 200×60px, transparent PNG | Org logo on certificate |
| `seal.png` | 100×100px, circular PNG | Verification seal |
| `signature.png` | 160×60px, transparent PNG | Authorized signature |
| `og-default.jpg` | 1200×630px | Social preview (LinkedIn, Twitter) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5 · CSS3 · Vanilla JS (ES6+) |
| PDF | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) v0.10.1 |
| QR Code | [qrcode.js](https://github.com/davidshimjs/qrcodejs) v1.0.0 |
| Fonts | Google Fonts (Playfair Display · EB Garamond · Lato) |
| Hosting | GitHub Pages — $0/month |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT — fork freely, use for any event. See [LICENSE](LICENSE).

---

<div align="center">

Built with ❤️ by [SriSatyaLokesh](https://srisatyalokesh.is-a.dev) as an open-source template · [View the template source](https://github.com/SriSatyaLokesh/certificate-generator)

</div>
