// Local dev server for Hyacinth Legal Support.
// Zero dependencies: Node's http + fs. Serves index.html and /src, reloads the
// browser when a source file changes, and binds to localhost only.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 5173;
const LIVE_RELOAD = !process.argv.includes('--no-reload');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};
// Only these paths are public. Everything else (server.js, build.js, package.json, dist/) is not served.
const PUBLIC = [path.join(ROOT, 'index.html'), path.join(ROOT, 'src') + path.sep];
// Hash routes the app understands; a request like /admin-clients is redirected to /#admin-clients.
const ROUTES = new Set(['home', 'services', 'model', 'difference', 'proof', 'approach', 'contact', 'privacy', 'terms', 'accessibility',
  'overview', 'workflows', 'deadlines', 'reports', 'account', 'help',
  'admin', 'admin-clients', 'admin-workflows', 'admin-team', 'admin-leads', 'admin-content', 'admin-users', 'admin-audit', 'admin-settings', 'admin-design-system']);

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ');
const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cache-Control': 'no-store'
};

const clients = new Set();
const DEV_SCRIPT = "'use strict';\n(() => { const es = new EventSource('/__events'); es.addEventListener('reload', () => location.reload()); })();\n";

function send(res, status, body, type, extra = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': type || 'text/plain; charset=utf-8', ...extra });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', null, { Allow: 'GET, HEAD' });

  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch (_) { return send(res, 400, 'Bad request'); }
  if (pathname.includes('\0')) return send(res, 400, 'Bad request');

  if (LIVE_RELOAD && pathname === '/__events') {
    res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': 'text/event-stream', Connection: 'keep-alive' });
    res.write('retry: 1000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (LIVE_RELOAD && pathname === '/__dev.js') return send(res, 200, DEV_SCRIPT, MIME['.js']);

  if (pathname === '/' || pathname === '/index.html') pathname = '/index.html';
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  if (ROUTES.has(slug)) return send(res, 302, '', null, { Location: '/#' + slug });

  const file = path.resolve(ROOT, '.' + pathname);
  const allowed = PUBLIC.some(p => file === p || file.startsWith(p));
  const hidden = file.split(path.sep).some(seg => seg.startsWith('.'));
  if (!allowed || hidden) {
    if (!path.extname(pathname)) return send(res, 302, '', null, { Location: '/' });
    return send(res, 404, 'Not found');
  }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return path.extname(pathname) ? send(res, 404, 'Not found') : send(res, 302, '', null, { Location: '/' });
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    fs.readFile(file, (e, buf) => {
      if (e) return send(res, 500, 'Could not read file');
      let body = buf;
      if (LIVE_RELOAD && file.endsWith('index.html')) body = Buffer.from(buf.toString('utf8').replace('</body>', '<script src="/__dev.js"></script>\n</body>'));
      res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': type, 'Content-Length': body.length });
      res.end(req.method === 'HEAD' ? undefined : body);
    });
  });
});

if (LIVE_RELOAD) {
  let timer;
  const notify = () => { clearTimeout(timer); timer = setTimeout(() => { for (const c of clients) c.write('event: reload\ndata: now\n\n'); }, 120); };
  try { fs.watch(path.join(ROOT, 'src'), { recursive: true }, notify); } catch (_) { /* recursive watch unsupported; reload manually */ }
  fs.watch(path.join(ROOT, 'index.html'), notify);
}

server.listen(PORT, HOST, () => {
  console.log(`Hyacinth Legal Support running at http://${HOST === '127.0.0.1' ? 'localhost' : HOST}:${PORT}`);
  console.log('  Website        /#home');
  console.log('  Client portal  /#overview');
  console.log('  Admin          /#admin   (any email + password)');
  if (LIVE_RELOAD) console.log('  Live reload is on: saving a file in src/ or index.html refreshes the page.');
});
