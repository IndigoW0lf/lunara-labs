import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const skipped = new Set(['.git', 'node_modules', 'coverage', 'playwright-report', 'test-results']);
const findings = [];
const textExtensions = new Set([
  '.md',
  '.mjs',
  '.js',
  '.html',
  '.css',
  '.json',
  '.yml',
  '.yaml',
  '.txt',
  '.example',
  '.ts',
  '.tsx',
  '.mts',
]);
const privateLink =
  /https?:\/\/(?:app\.)?notion\.(?:so|com)\b|\blibfile_[a-z0-9]+|\bappgprj_[a-z0-9]+|\/workspace\/(?:scratch|sites)\//i;
const credential =
  /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{24,}|github_pat_[A-Za-z0-9_]{24,})\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/;
const personalEmail = /[A-Z0-9._%+-]+@(?:gmail|hotmail|outlook|yahoo|icloud)\.[A-Z]{2,}/i;
const browserNetwork =
  /\b(?:fetch|WebSocket|XMLHttpRequest|EventSource)\s*\(|\bsendBeacon\s*\(|(?:https?:)?\/\/[^\s'"<>]+\.(?:mjs|js|css|woff2?|ttf)(?:[?'"\s]|$)/i;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue;
    const full = path.join(dir, entry.name),
      relative = path.relative(root, full);
    if (entry.isSymbolicLink()) {
      findings.push(relative + ': symbolic link needs review');
      continue;
    }
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (entry.name.startsWith('.env') && entry.name !== '.env.example') {
      findings.push(relative + ': local environment file must not be shared');
      continue;
    }
    if (
      !textExtensions.has(path.extname(entry.name)) &&
      !['.gitignore', 'package.json'].includes(entry.name)
    )
      continue;
    const text = fs.readFileSync(full, 'utf8');
    if (privateLink.test(text)) findings.push(relative + ': private workspace/reference marker');
    if (credential.test(text)) findings.push(relative + ': possible credential');
    if (personalEmail.test(text)) findings.push(relative + ': personal email address');
    if (
      ['src', 'public', 'build'].some((dir) => relative.startsWith(dir + path.sep)) &&
      ['.mjs', '.js', '.ts', '.tsx', '.mts', '.css', '.html'].includes(path.extname(entry.name)) &&
      browserNetwork.test(text)
    )
      findings.push(relative + ': browser network integration needs review');
  }
}
walk(root);
if (findings.length) {
  console.error(findings.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    'Privacy guard: no configured credential/private-reference patterns or browser data-request APIs found.',
  );
