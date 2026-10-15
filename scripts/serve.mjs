import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  let target = path.resolve(root, `.${pathname}`);
  if (!target.startsWith(root)) { res.writeHead(403).end('Forbidden'); return; }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) target = path.join(root, '404.html');
  if (!fs.existsSync(target)) { res.writeHead(404).end('Not found'); return; }
  res.writeHead(target.endsWith('404.html') ? 404 : 200, { 'Content-Type': mime[path.extname(target)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(target).pipe(res);
});
server.listen(4178, '127.0.0.1', () => console.log('Victory View preview ready at http://127.0.0.1:4178'));
