import fs from 'node:fs';

const homePath = 'index.html';
let home = fs.readFileSync(homePath, 'utf8');
home = home.replace('https:///assets/images/hotel-exterior.png', 'https://victory-view-hotel-suite.vercel.app/assets/images/hotel-exterior.png');
home = home.replace('"url":"https:///"', '"url":"https://victory-view-hotel-suite.vercel.app/"');
home = home.replace(/<span>05° 32′ N · 05° 52′ E<\/span>/, '');
home = home.replace('<span class="night-label">OVWIAN AXIS · OPEN EVENINGS</span>', '');
const homeStart = home.indexOf('<section class="location-section"');
const homeEnd = home.indexOf('</section>', homeStart) + '</section>'.length;
if (homeStart < 0 || homeEnd < '</section>'.length) throw new Error('Homepage Find us section not found');
let homeSection = home.slice(homeStart, homeEnd);
if (!homeSection.includes('data-map-embed')) {
  const mapStart = homeSection.indexOf('</div></section>');
  if (mapStart < 0) throw new Error('Homepage location grid end not found');
  const replacement = `<div class="location-map-stack">
    <iframe class="map-embed" data-map-embed title="Map showing Victory View Hotel &amp; Suites at 122 DSC Expressway, Udu" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    <div class="map-fallback" hidden><p>122 DSC Expressway, Ovwian Axis, Udu, Delta State, Nigeria</p></div>
    <a class="map-directions-button" href="https://www.google.com/maps/search/?api=1&amp;query=Victory+View+Hotel+122+DSC+Expressway+Ovwian+Axis+Udu+Delta+State" target="_blank" rel="noopener">Get directions</a>
  </div>`;
  const updated = homeSection.slice(0, mapStart) + `</div>${replacement}` + homeSection.slice(mapStart + '</div>'.length);
  home = home.slice(0, homeStart) + updated + home.slice(homeEnd);
}
const findUsStart = home.indexOf('<section class="location-section"');
const findUsEnd = home.indexOf('</section>', findUsStart) + '</section>'.length;
homeSection = home.slice(findUsStart, findUsEnd);
homeSection = homeSection.replace('class="location-grid"', 'class="location-grid location-grid-map"');
home = home.slice(0, findUsStart) + homeSection + home.slice(findUsEnd);
fs.writeFileSync(homePath, home);

const contactPath = 'contact/index.html';
let contact = fs.readFileSync(contactPath, 'utf8');
if (!contact.includes('data-map-embed')) {
  const contactStart = contact.indexOf('<section class="map-section">');
  const contactEnd = contact.indexOf('</section>', contactStart) + '</section>'.length;
  if (contactStart < 0 || contactEnd < '</section>'.length) throw new Error('Contact map section not found');
  const contactMap = `<section class="map-section contact-map-section"><div class="wrap location-map-stack">
  <iframe class="map-embed" data-map-embed title="Map showing Victory View Hotel &amp; Suites at 122 DSC Expressway, Udu" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
  <div class="map-fallback" hidden><p>122 DSC Expressway, Ovwian Axis, Udu, Delta State, Nigeria</p></div>
  <a class="map-directions-button" href="https://www.google.com/maps/search/?api=1&amp;query=Victory+View+Hotel+122+DSC+Expressway+Ovwian+Axis+Udu+Delta+State" target="_blank" rel="noopener">Get directions</a>
</div></section>`;
  contact = contact.slice(0, contactStart) + contactMap + contact.slice(contactEnd);
  fs.writeFileSync(contactPath, contact);
}
