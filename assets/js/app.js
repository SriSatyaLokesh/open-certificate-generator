'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────
const CONFIG_PATH = 'config/certificate.config.json';
const DATA_PATH   = 'data/';

// ─── Entry Point ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

async function init() {
  showView('loading-view');

  const rawId = getQueryParam('id');
  const id    = rawId ? sanitizeId(rawId) : null;

  try {
    if (id) {
      // Certificate mode: fetch config + attendee data in parallel
      const [config, attendee] = await Promise.all([
        fetchConfig(),
        fetchAttendee(id)
      ]);
      applyConfigColors(config);
      renderCertificateView(config, attendee);
      injectSEOTags(config, attendee);
      injectJSONLD(config, attendee);
      generateQRCode(config);
      wirePDFButton(config, attendee.certificate_id);
      showView('certificate-view');
    } else {
      // Search mode: fetch config only
      const config = await fetchConfig();
      applyConfigColors(config);
      renderSearchView(config);
      injectSearchSEOTags(config);
      injectOrgJSONLD(config);
      showView('search-view');
    }
  } catch (err) {
    console.error('[App] error:', err);
    showError(id);
  }
}

// ─── URL Utilities ────────────────────────────────────────────────────────────

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Sanitise a raw ID or already-converted value.
 * Allows only lowercase alphanumerics and hyphens.
 */
function sanitizeId(raw) {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '');
}

/**
 * Convert a registered email address to a certificate ID.
 *   jane.doe@example.com  →  jane-doe-at-example-com
 */
function sanitizeEmail(email) {
  return email
    .toLowerCase()
    .trim()
    .replace(/\+/g, '-plus-')
    .replace(/@/g,  '-at-')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function fetchConfig() {
  const res = await fetch(CONFIG_PATH);
  if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);
  const config = await res.json();
  validateConfig(config);
  return config;
}

function validateConfig(config) {
  const required = ['org_name', 'certificate'];
  for (const field of required) {
    if (!config[field]) throw new Error(`Invalid config: missing required field "${field}"`);
  }
  const certRequired = ['primary_color', 'border_color'];
  for (const field of certRequired) {
    if (!config.certificate[field]) {
      throw new Error(`Invalid config: missing required certificate field "${field}"`);
    }
  }
}

async function fetchAttendee(id) {
  const res = await fetch(`${DATA_PATH}${id}.json`);
  if (!res.ok) throw new Error(`Certificate not found for ID: ${id}`);
  const data = await res.json();
  validateAttendee(data);
  return data;
}

function validateAttendee(data) {
  const required = ['certificate_id', 'name', 'email', 'workshop', 'date', 'date_iso'];
  for (const field of required) {
    if (!data[field]) throw new Error(`Attendee data missing required field: "${field}"`);
  }
}

// ─── View Management ──────────────────────────────────────────────────────────

function showView(activeId) {
  ['loading-view', 'search-view', 'certificate-view', 'error-view'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== activeId);
  });
}

// ─── Config-Driven CSS Variables ─────────────────────────────────────────────

/**
 * Apply branding from config.certificate.* to CSS custom properties.
 * All visual customisation flows through here — no hardcoded colors.
 */
function applyConfigColors(config) {
  var c    = config.certificate;
  var root = document.documentElement.style;

  root.setProperty('--cert-primary',       c.primary_color    || '#1a2e4a');
  root.setProperty('--cert-accent',        c.accent_color     || '#c8a951');
  root.setProperty('--cert-bg',            c.background_color || '#ffffff');
  root.setProperty('--cert-text',          c.text_color       || '#333333');
  root.setProperty('--cert-muted',         c.muted_color      || '#777777');
  root.setProperty('--cert-border',        c.border_color     || '#c8a951');
  root.setProperty('--cert-border-width',  c.border_width     || '7px');

  if (c.font_heading) root.setProperty('--font-heading', c.font_heading);
  if (c.font_body)    root.setProperty('--font-body',    c.font_body);
}

// ─── Search View ──────────────────────────────────────────────────────────────

function renderSearchView(config) {
  var sp = config.search_page || {};

  setAttr('search-logo', 'src', config.org_logo || '');
  setAttr('search-logo', 'alt', config.org_name || '');
  if (!config.org_logo) {
    var logoEl = document.getElementById('search-logo');
    if (logoEl) logoEl.classList.add('hidden');
  }

  setText('search-org-name',    config.org_name     || '');
  setText('search-headline',    sp.headline         || '');
  setText('search-subtext',     sp.subtext          || '');
  setText('search-footer-note', sp.footer_note      || '');
  setAttr('lookup-input', 'placeholder', sp.input_placeholder || 'your@email.com');
  setText('lookup-btn', sp.button_text || 'Find My Certificate');

  if (config.site_title) document.title = config.site_title;

  // Wire search interaction
  var btn   = document.getElementById('lookup-btn');
  var input = document.getElementById('lookup-input');
  if (btn)   btn.addEventListener('click', handleSearch);
  if (input) input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSearch();
  });
}

function injectSearchSEOTags(config) {
  var seo = config.seo || {};
  var pageUrl = window.location.origin + window.location.pathname;
  var title = seo.home_title || config.site_title || 'Free Certificate Generator | Open Certificate Generator';
  var description = seo.home_description
    || 'Create and share verifiable certificates online for free with no backend and no signup.';
  var image = seo.default_og_image
    ? new URL(seo.default_og_image, window.location.origin).href
    : (config.org_logo ? new URL(config.org_logo, window.location.origin).href : '');

  var canonical = document.getElementById('canonical-tag');
  if (canonical) canonical.setAttribute('href', pageUrl);

  document.title = title;
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);

  setTagContent('og-title', title);
  setTagContent('og-description', description);
  setTagContent('og-url', pageUrl);
  setTagContent('og-image', image);
  setTagContent('og-site-name', config.org_name || 'Open Certificate Generator');

  setTagContent('tw-title', title);
  setTagContent('tw-description', description);
  setTagContent('tw-image', image);
  setTagContent('tw-site', seo.twitter_handle || '');
}

function handleSearch() {
  var input = document.getElementById('lookup-input');
  if (!input) return;
  var value = input.value.trim();
  if (!value) { input.focus(); return; }

  // Accept raw email or raw cert ID
  var id = value.includes('@') ? sanitizeEmail(value) : sanitizeId(value);
  window.location.href = '?id=' + encodeURIComponent(id);
}

// ─── Certificate View ─────────────────────────────────────────────────────────

function renderCertificateView(config, attendee) {
  var c = config.certificate;

  // Dynamic page title
  document.title = attendee.name + ' \u2014 ' + attendee.workshop
    + ' Certificate | ' + config.org_name;

  // Org header
  setImageGraceful('cert-logo', config.org_logo || '');
  setAttr('cert-logo', 'alt', config.org_name || '');
  var orgNameSpan = document.querySelector('#cert-org-name [itemprop="name"]');
  if (orgNameSpan) orgNameSpan.textContent = config.org_name || '';

  // Title block labels
  setText('cert-heading-label',  c.heading_label    || '');
  setText('cert-pre-name-text',  c.pre_name_text    || '');
  setText('cert-post-name-text', c.post_name_text   || '');

  // Attendee name (populate itemprop span inside h1)
  var nameEl = document.getElementById('cert-name');
  if (nameEl) {
    var nameSpan = nameEl.querySelector('[itemprop="name"]');
    if (nameSpan) nameSpan.textContent = attendee.name;
    else          nameEl.textContent   = attendee.name;
  }

  // Workshop (h2)
  setText('cert-workshop', attendee.workshop);

  // Description (optional)
  var descEl = document.getElementById('cert-description');
  if (descEl) {
    if (c.show_description && attendee.description) {
      descEl.textContent = attendee.description;
      descEl.classList.remove('hidden');
    } else {
      descEl.classList.add('hidden');
    }
  }

  // Date
  var dateEl = document.getElementById('cert-date');
  if (dateEl) {
    dateEl.textContent = attendee.date;
    dateEl.setAttribute('datetime', attendee.date_iso);
  }
  setText('cert-date-label', c.footer_left_label || '');

  // Seal (optional)
  if (c.show_seal === false) {
    var sealEl = document.getElementById('cert-seal');
    if (sealEl) sealEl.classList.add('hidden');
  } else {
    setImageGraceful('cert-seal', c.seal_image || '');
  }
  setText('cert-seal-label', c.seal_label || '');

  // Signature
  setImageGraceful('cert-signature', c.signature_image || '');
  setText('cert-authorized-by', c.authorized_by || '');
  setText('cert-sig-label',     c.footer_right_label || '');

  // QR section visibility
  var qrSectionEl = document.getElementById('cert-qr-section');
  if (qrSectionEl) qrSectionEl.classList.toggle('hidden', c.show_qr === false);
}

// ─── QR Code ──────────────────────────────────────────────────────────────────

function generateQRCode(config) {
  var c = config.certificate;
  if (c.show_qr === false) return;

  var container = document.getElementById('cert-qr');
  if (!container || typeof QRCode === 'undefined') return;

  container.innerHTML = '';

  // Use org_website + id as QR target if set, otherwise current URL
  var base = (config.org_website && config.org_website.trim())
    ? config.org_website.trim()
    : window.location.origin + window.location.pathname;
  var id     = getQueryParam('id');
  var qrUrl  = id
    ? base + (base.indexOf('?') === -1 ? '?' : '&') + 'id=' + encodeURIComponent(id)
    : base;

  new QRCode(container, {
    text:         qrUrl,
    width:        68,
    height:       68,
    colorDark:    c.primary_color   || '#1a2e4a',
    colorLight:   '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  });
}

// ─── PDF Download ─────────────────────────────────────────────────────────────

function wirePDFButton(config, certId) {
  var btn = document.getElementById('download-btn');
  if (!btn) return;

  var originalHTML = btn.innerHTML;
  var pdf          = config.pdf || {};

  function restoreButton(noPrintNodes) {
    noPrintNodes.forEach(function(el) { el.classList.remove('invisible'); });
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }

  btn.addEventListener('click', function() {
    if (typeof html2pdf === 'undefined') {
      alert('PDF library is still loading. Please try again in a moment.');
      return;
    }
    btn.disabled    = true;
    btn.textContent = 'Generating\u2026';

    var element  = document.getElementById('certificate');
    var noPrint  = document.querySelectorAll('.no-print');
    noPrint.forEach(function(el) { el.classList.add('invisible'); });

    var opt = {
      margin:      pdf.margin != null ? pdf.margin : 0,
      filename:    (pdf.filename_prefix || 'certificate') + '-' + certId + '.pdf',
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF:       {
        unit:        'mm',
        format:      pdf.format      || 'a4',
        orientation: pdf.orientation || 'landscape'
      }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .catch(function(err) {
        console.error('[PDF] generation failed:', err);
        alert('Failed to generate PDF. Please try again.');
      })
      .finally(function() {
        restoreButton(noPrint);
      });
  });
}

// ─── SEO Meta Tag Injection ───────────────────────────────────────────────────

function injectSEOTags(config, attendee) {
  var pageUrl     = window.location.href;
  var title       = attendee.name + ' \u2014 ' + attendee.workshop
    + ' Certificate | ' + config.org_name;
  var description = attendee.name + ' successfully completed \u201c' + attendee.workshop
    + '\u201d on ' + attendee.date + '. Issued by ' + config.org_name + '.';

  var seo   = config.seo || {};
  var image = seo.default_og_image
    ? new URL(seo.default_og_image, window.location.origin).href
    : (config.org_logo ? new URL(config.org_logo, window.location.origin).href : '');

  // Canonical
  var canonical = document.getElementById('canonical-tag');
  if (canonical) canonical.setAttribute('href', pageUrl);

  // Standard
  document.title = title;
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);

  // Open Graph
  setTagContent('og-title',       title);
  setTagContent('og-description', description);
  setTagContent('og-url',         pageUrl);
  setTagContent('og-image',       image);
  setTagContent('og-site-name',   config.org_name || '');

  // Twitter Card
  setTagContent('tw-title',       title);
  setTagContent('tw-description', description);
  setTagContent('tw-image',       image);
  setTagContent('tw-site',        seo.twitter_handle || '');
}

// ─── JSON-LD: Certificate (AEO) ───────────────────────────────────────────────

function injectJSONLD(config, attendee) {
  var schema = {
    '@context':          'https://schema.org',
    '@type':             'EducationalOccupationalCredential',
    'name':              attendee.workshop + ' \u2014 Certificate of Completion',
    'description':       attendee.description || (attendee.name + ' completed ' + attendee.workshop + '.'),
    'credentialCategory':'Certificate of Completion',
    'dateCreated':       attendee.date_iso,
    'url':               window.location.href,
    'identifier':        attendee.certificate_id,
    'recognizedBy': {
      '@type': 'Organization',
      'name':  config.org_name,
      'url':   config.org_website || '',
      'logo':  config.org_logo ? new URL(config.org_logo, window.location.origin).href : ''
    },
    'about': {
      '@type': 'Person',
      'name':  attendee.name,
      'email': attendee.email
    }
  };
  var el = document.getElementById('json-ld-block');
  if (el) el.textContent = JSON.stringify(schema, null, 2);
}

// ─── JSON-LD: Organization (Search View / AEO) ────────────────────────────────

function injectOrgJSONLD(config) {
  var schema = {
    '@context':   'https://schema.org',
    '@type':      'Organization',
    'name':       config.org_name,
    'url':        config.org_website || window.location.origin,
    'description':config.org_tagline || ''
  };
  if (config.org_logo) {
    schema.logo = new URL(config.org_logo, window.location.origin).href;
  }
  var el = document.getElementById('json-ld-block');
  if (el) el.textContent = JSON.stringify(schema, null, 2);
}

// ─── Error View ───────────────────────────────────────────────────────────────

function showError(id) {
  var msgEl    = document.getElementById('error-message');
  var detailEl = document.getElementById('error-detail');

  if (id && msgEl) {
    msgEl.textContent = 'Certificate not found.';
    if (detailEl) {
      detailEl.textContent = 'We could not find a certificate for: ' + id;
      detailEl.classList.remove('hidden');
    }
  }

  var retryBtn = document.getElementById('retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', function() {
      window.location.href = './';
    }, { once: true });
  }

  showView('error-view');
}

// ─── DOM Helpers ──────────────────────────────────────────────────────────────

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setAttr(id, attr, value) {
  var el = document.getElementById(id);
  if (el) el.setAttribute(attr, value);
}

function setTagContent(id, value) {
  var el = document.getElementById(id);
  if (el) el.setAttribute('content', value);
}

/**
 * Set image src gracefully — hides element if src is empty or image 404s.
 * onerror must be assigned before src to catch synchronous failures.
 */
function setImageGraceful(id, src) {
  var el = document.getElementById(id);
  if (!el) return;

  if (!src) {
    el.classList.add('hidden');
    el.removeAttribute('src');
    return;
  }

  el.classList.remove('hidden');
  el.onload = function() { this.classList.remove('hidden'); };
  el.onerror = function() { this.classList.add('hidden'); };
  el.src = src;
}
