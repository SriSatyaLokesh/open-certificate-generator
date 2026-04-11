import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const configPath = path.join(root, 'config', 'certificate.config.json');
const dataDir = path.join(root, 'data');

function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateConfig() {
  const config = readJson(configPath);
  const requiredTopLevel = ['org_name', 'certificate', 'search_page', 'pdf', 'seo'];
  for (const key of requiredTopLevel) {
    assert(config[key], `config: missing required key "${key}"`);
  }

  const requiredCertificate = ['primary_color', 'border_color', 'heading_label'];
  for (const key of requiredCertificate) {
    assert(config.certificate[key], `config.certificate: missing required key "${key}"`);
  }
}

function validateDataFiles() {
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));
  assert(files.length > 0, 'data: no .json files found');

  const requiredAttendee = ['certificate_id', 'name', 'email', 'workshop', 'date', 'date_iso'];

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const data = readJson(filePath);
    const expectedId = file.slice(0, -'.json'.length);

    for (const key of requiredAttendee) {
      assert(data[key], `data/${file}: missing required key "${key}"`);
    }

    assert(
      data.certificate_id === expectedId,
      `data/${file}: certificate_id must match filename (expected "${expectedId}")`
    );
  }
}

try {
  validateConfig();
  validateDataFiles();
  console.log('JSON validation passed.');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
