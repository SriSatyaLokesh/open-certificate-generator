import fs from 'node:fs';
import path from 'node:path';

const htmlPath = path.join(process.cwd(), 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const requiredIds = [
  'loading-view',
  'search-view',
  'certificate-view',
  'error-view',
  'lookup-input',
  'lookup-btn',
  'download-btn',
  'cert-qr',
  'json-ld-block'
];

try {
  assert(/<!DOCTYPE html>/i.test(html), 'index.html: missing DOCTYPE');
  assert(html.includes('assets/css/style.css'), 'index.html: missing style.css include');
  assert(html.includes('assets/css/print.css'), 'index.html: missing print.css include');
  assert(html.includes('assets/js/app.js'), 'index.html: missing app.js include');

  for (const id of requiredIds) {
    const idPattern = new RegExp(`id=["']${id}["']`);
    assert(idPattern.test(html), `index.html: missing required id "${id}"`);
  }

  console.log('HTML structure validation passed.');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
