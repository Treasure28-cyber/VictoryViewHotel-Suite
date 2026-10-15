import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve();
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const entry of ['index.html', 'rooms', 'conference', 'contact', 'gallery', 'assets']) {
  fs.cpSync(path.join(root, entry), path.join(dist, entry), { recursive: true });
}
const routes = ['index.html', 'rooms/index.html', 'conference/index.html', 'contact/index.html', 'gallery/index.html'];
for (const route of routes) {
  const file = path.join(dist, route);
  if (!fs.existsSync(file)) throw new Error(`Missing route: ${route}`);
}
const pages = routes.map(route => path.join(dist, route));
for (const file of pages) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replaceAll('victoryviewhotelandssuites.com', '');
  html = html.replace(/<link rel="canonical"[^>]*>/g, '').replace(/<meta property="og:url"[^>]*>/g, '');
  html = html.replaceAll('logo.svg', 'logo.png');
  html = html.replaceAll('alt="Victory View Hotel & Suites"', 'alt="Victory View Hotel"');
  html = html.replaceAll('<span>HOTEL <i>&amp;</i> SUITES</span>', '');
  fs.writeFileSync(file, html);
}
console.log(`Built ${routes.length} static pages and copied the hotel assets to dist/.`);
