import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const files = ['index.html', 'rooms/index.html', 'conference/index.html', 'contact/index.html', 'gallery/index.html'];
const failures = [];
let checkedLinks = 0;
for (const name of files) {
  const full = path.join(root, name);
  if (!fs.existsSync(full)) { failures.push(`Missing route ${name}`); continue; }
  const html = fs.readFileSync(full, 'utf8');
  const page = name.split('/')[0] || 'home';
  for (const tag of ['<html lang="en-NG">', '<meta name="description"', '<meta name="viewport"', '<title>', '<h1']) if (!html.includes(tag)) failures.push(`${name}: missing ${tag}`);
  if (!html.includes('Victory View Hotel')) failures.push(`${name}: hotel name missing`);
  if (!html.includes('wa.me/2348101064294')) failures.push(`${name}: WhatsApp booking link missing`);
  if (!html.includes('assets/brand/logo.png')) failures.push(`${name}: supplied hotel logo missing`);
  if (html.includes('rel="canonical"') || html.includes('property="og:url"')) failures.push(`${name}: unverified domain metadata present`);
  const refs = [...html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)].map(match => match[1]).filter(ref => !/^(?:[a-z]+:|\/\/|#)/i.test(ref));
  for (const href of new Set(refs)) {
    checkedLinks++;
    const assetPath = path.resolve(root, href.startsWith('/') ? `.${href}` : path.join(path.dirname(name), href));
    const candidates = [assetPath, path.join(assetPath, 'index.html')];
    if (!candidates.some(candidate => candidate.startsWith(root) && fs.existsSync(candidate))) failures.push(`${name}: broken local link ${href}`);
  }
  if (page === 'rooms' && ['Single Room', 'Semi-single Room', 'Double Room', 'Executive Room'].some(room => !html.includes(room))) failures.push('Rooms route: a confirmed room type is missing');
}
  const photos = ['hotel-exterior.png', 'room-warm.png', 'room-sunlit.png', 'room-red.png', 'jacuzzi.png', 'event-hall.png', 'dining-room.png', 'bar.png', 'lounge.png', 'lobby.png'];
for (const photo of photos) if (!fs.existsSync(path.join(root, 'assets', 'images', photo))) failures.push(`Missing hotel photo ${photo}`);
const eventHall = fs.readFileSync(path.join(root, 'assets', 'images', 'event-hall.png'));
const eventHallWidth = eventHall.readUInt32BE(16);
const eventHallHeight = eventHall.readUInt32BE(20);
if (eventHallWidth < 1300 || eventHallHeight < 950) failures.push(`Event hall photo should be enhanced/upscaled; found ${eventHallWidth}x${eventHallHeight}`);
for (const route of ['rooms/', 'conference/', 'contact/']) {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const routeName = route.slice(0, -1);
  if (!home.includes(`href="/${route}"`) && !home.includes(`href="${route}"`) && !home.includes(`href="${routeName === 'gallery' ? 'gallery' : route}"`)) failures.push(`Homepage: missing navigation to ${route}`);
}
for (const route of ['rooms/', 'conference/', 'contact/']) {
  const routeName = route.slice(0, -1);
  const file = path.join(root, routeName, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const expected = `../${route}`;
  if (!html.includes(`href="${expected}"`) && !html.includes(`href="/${route}"`)) failures.push(`${routeName}: missing cross-page navigation`);
}
if (!fs.readFileSync(path.join(root, 'gallery/index.html'), 'utf8').includes('Hotel Gallery')) failures.push('Gallery route: missing gallery page title');
const homeHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const contactHtml = fs.readFileSync(path.join(root, 'contact/index.html'), 'utf8');
for (const [name, html] of [['Home', homeHtml], ['Contact', contactHtml]]) {
  if (!html.includes('data-map-embed')) failures.push(`${name}: Google Maps embed missing`);
  if (!html.includes('allowfullscreen')) failures.push(`${name}: map is missing allowfullscreen`);
  if (!html.includes('title="Map showing Victory View Hotel &amp; Suites at 122 DSC Expressway, Udu"')) failures.push(`${name}: map title missing or incorrect`);
  if (!html.includes('loading="lazy"') || !html.includes('referrerpolicy="no-referrer-when-downgrade"')) failures.push(`${name}: map loading or referrer attributes missing`);
  if (!html.includes('map-fallback')) failures.push(`${name}: address fallback missing`);
  if (!html.includes('target="_blank" rel="noopener"')) failures.push(`${name}: directions link attributes missing`);
  if (!html.includes('>Get directions</a>')) failures.push(`${name}: directions button label mismatch`);
}
if (!fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8').includes("export const MAP_EMBED_URL = 'https://www.google.com/maps?q=Victory+View+Hotel+%26+Suites+122+DSC+Expressway+Ovwian+Axis+Udu+Delta+State+Nigeria&output=embed'")) failures.push('Map embed URL constant mismatch');
if (!homeHtml.includes('rel="noopener noreferrer">Get directions')) failures.push('Home: existing Get directions button missing');
if (!homeHtml.includes('https://victory-view-hotel-suite.vercel.app/assets/images/hotel-exterior.png')) failures.push('Home: absolute social preview image missing');
if (homeHtml.includes('05° 32′ N') || homeHtml.includes('OPEN EVENINGS')) failures.push('Home: unverified coordinates or bar hours remain');
if (!contactHtml.includes('contact-map-section')) failures.push('Contact: map is not in full-width section');
const css = fs.readFileSync(path.join(root, 'assets/styles.css'), 'utf8');
if (!css.includes('height: 420px')) failures.push('Map: desktop height must be 420px');
if (!css.includes('height: 320px')) failures.push('Map: mobile height must be 320px');
if (!css.includes('width: 100%')) failures.push('Map: responsive full-width sizing missing');
if (!css.includes('rgba(201,168,76,.3)')) failures.push('Map: soft gold frame missing');
if (!css.includes('.map-scroll-safe.map-active')) failures.push('Map: mobile scroll-safe activation missing');
for (const name of files) {
  const html = fs.readFileSync(path.join(root, name), 'utf8');
  for (const photo of photos) {
    const source = `assets/images/${photo}`;
    if (html.includes(source) && ![path.resolve(root, source), path.resolve(root, path.dirname(name), `../${source}`)].some(candidate => fs.existsSync(candidate))) failures.push(`${name}: broken photo ${photo}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Checks passed: ${files.length} pages, ${checkedLinks} local references, ${photos.length} supplied hotel photos, page metadata, navigation and WhatsApp bookings.`);
