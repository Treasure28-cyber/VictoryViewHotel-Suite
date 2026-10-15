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
for (const name of files) {
  const html = fs.readFileSync(path.join(root, name), 'utf8');
  for (const photo of photos) {
    const source = `assets/images/${photo}`;
    if (html.includes(source) && ![path.resolve(root, source), path.resolve(root, path.dirname(name), `../${source}`)].some(candidate => fs.existsSync(candidate))) failures.push(`${name}: broken photo ${photo}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Checks passed: ${files.length} pages, ${checkedLinks} local references, ${photos.length} supplied hotel photos, page metadata, navigation and WhatsApp bookings.`);
