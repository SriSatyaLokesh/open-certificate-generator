import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const markdownFiles = [
  'README.md',
  'CONTRIBUTING.md',
  'SETUP.md',
  'PLAN.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  '.github/PULL_REQUEST_TEMPLATE.md'
];

function isExternalLink(target) {
  return /^(https?:|mailto:|tel:)/i.test(target);
}

function isAnchorOnly(target) {
  return target.startsWith('#');
}

function normalizeTarget(rawTarget) {
  return rawTarget.split('#')[0].trim();
}

function collectLinks(content) {
  const links = [];
  const regex = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function fileExistsSync(targetPath) {
  try {
    fs.accessSync(targetPath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function checkMarkdownFile(filePath) {
  const absPath = path.join(root, filePath);
  const content = fs.readFileSync(absPath, 'utf8');
  const links = collectLinks(content);
  const fileDir = path.dirname(absPath);

  for (const link of links) {
    if (isExternalLink(link) || isAnchorOnly(link)) {
      continue;
    }

    const normalized = normalizeTarget(link);
    if (!normalized) {
      continue;
    }

    const resolved = path.resolve(fileDir, normalized);
    if (!fileExistsSync(resolved)) {
      throw new Error(`${filePath}: broken relative link "${link}"`);
    }
  }
}

try {
  for (const file of markdownFiles) {
    checkMarkdownFile(file);
  }
  console.log('Markdown link validation passed.');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
