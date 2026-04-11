# Contributing

There are two ways to contribute — [claiming your certificate](#claiming-your-certificate) (most participants) or [improving the template](#improving-the-template) (developers).

---

## Claiming Your Certificate

> This is the most common contribution. Follow these steps to get your certificate published.

### 1. Fork the repository

Click **Fork** at the top right. Work from your fork — do not push directly to `main`.

### 2. Convert your email to a file ID

Apply these rules to the email you registered with:

| Rule | Example |
|------|---------|
| Lowercase everything | `Jane.Doe@Example.com` → `jane.doe@example.com` |
| Replace `@` with `-at-` | → `jane.doe-at-example.com` |
| Replace every `.` with `-` | → `jane-doe-at-example-com` |
| Replace `+` with `-plus-` | `jane+tag@...` → `jane-plus-tag-at-...` |

**Your filename:** `data/jane-doe-at-example-com.json`

### 3. Create your data file

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

**Rules:**
- `certificate_id` must exactly match the filename without `.json`
- `name`, `email`, and `description` must be your own — do not copy the placeholder values from `data/jane-doe-at-example-com.json`
- `workshop`, `date`, and `date_iso` must match exactly what the organiser specifies

### 4. Open a Pull Request

Open a PR from your fork's `main` branch to this repository's `main`.

- The PR description auto-fills with a checklist — complete every item before submitting
- One data file per PR
- PRs with unchanged sample/placeholder data will be closed without merging

### 5. Get your certificate

Once the organiser merges your PR, your certificate is live at:

```
https://srisatyalokesh.github.io/certificate-generator/?id=jane-doe-at-example-com
```

---

## Improving the Template

For bug fixes, accessibility improvements, or enhancements to the template itself.

### Prerequisites

No build toolchain required.

```bash
npx serve .
# or
python -m http.server 8080
```

Open `http://localhost:8080/?id=jane-doe-at-example-com` to test.

### Workflow

1. Fork and create a branch: `git checkout -b fix/description`
2. Make your change and test locally in at least one browser
3. Open a PR against `main` with a clear description of the problem and solution

### What we welcome

- Bug fixes with a clear reproduction case
- Accessibility improvements (`aria`, keyboard navigation, contrast)
- Browser compatibility fixes
- Documentation improvements

### What we won't merge

- New npm/build dependencies
- Changes to `config/certificate.config.json` values (those are per-event)
- Modifications to existing attendee data files in `data/`

---

## Code Style

- Vanilla JS only — no frameworks, no bundlers
- `'use strict'` at top of all JS files
- 2-space indentation
- Match the existing file style and keep changes consistent with surrounding code
- Descriptive function names that read as actions: `renderCertificateView`, `injectSEOTags`

---

## Questions

Open an issue on GitHub or contact the organiser directly (see the search page footer note).
