import fs from 'node:fs';

const pages = [
  'index.html',
  'rooms/index.html',
  'conference/index.html',
  'contact/index.html',
  'gallery/index.html'
];

for (const page of pages) {
  let html = fs.readFileSync(page, 'utf8');
  html = html.replaceAll('victoryviewhotelandssuites.com', '');
  html = html.replace(/<link rel="canonical"[^>]*>/g, '');
  html = html.replace(/<meta property="og:url"[^>]*>/g, '');
  html = html.replaceAll('/assets/brand/logo.svg', '/assets/brand/logo.png');
  html = html.replaceAll('<span>HOTEL <i>&amp;</i> SUITES</span>', '');
  fs.writeFileSync(page, html);
}
