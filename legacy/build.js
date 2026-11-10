// Builds the single-file version used for the Claude artifact:
// dist/hyacinth-legal-support.html (styles and scripts inlined, no build tools).
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const index = read('index.html');

const head = index.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = index.match(/<body>([\s\S]*?)<\/body>/)[1].trim();
const meta = head
  .split('\n')
  .filter(l => /<title>|name="description"|rel="preconnect"|fonts\.googleapis\.com\/css2/.test(l))
  .join('\n');
const styles = [...head.matchAll(/<link rel="stylesheet" href="(src\/[^"]+)">/g)].map(m => m[1]);
const scripts = [...head.matchAll(/<script src="(src\/[^"]+)" defer><\/script>/g)].map(m => m[1]);

for (const f of [...styles, ...scripts]) {
  const src = read(f);
  if (/<\/(script|style)/i.test(src)) throw new Error(`${f} contains a closing tag that would break inlining`);
}

// The artifact viewer supplies <!doctype>, <html>, <head> and <body>, so the output starts at <title>.
const out = [
  meta.split('\n')[0],
  '<meta name="claude:viewport-fit-sides" content="cover">',
  ...meta.split('\n').slice(1),
  ...styles.map(f => `<style>\n${read(f)}</style>`),
  body,
  // Classic inline scripts share one global scope and run in order, exactly like the deferred files.
  ...scripts.map(f => `<script>\n${read(f)}</script>`)
].join('\n');

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const target = path.join(ROOT, 'dist', 'hyacinth-legal-support.html');
fs.writeFileSync(target, out);
console.log(`Built ${path.relative(ROOT, target)} (${(Buffer.byteLength(out) / 1024).toFixed(0)} KB) from ${styles.length} stylesheets and ${scripts.length} scripts.`);
