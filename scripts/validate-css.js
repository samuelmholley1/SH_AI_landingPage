// validate-css.js
// Crawl 1-home ... 9-schedule for link[href*="global.css"] not starting with /shared/
const fs = require('fs');
const path = require('path');

const PAGES = [
  '1-home', '2-reclaim', '3-services', '4-story', '5-audit', '6-proof', '7-contact', '8-feedback', '9-schedule'
];
const ROOT = path.resolve(__dirname, '..');

let results = [];

for (const folder of PAGES) {
  const file = path.join(ROOT, folder, 'index.html');
  if (!fs.existsSync(file)) {
    results.push({ folder, status: 'MISSING' });
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const match = html.match(/<link[^>]+href=["']([^"']*global\.css)["']/i);
  if (!match) {
    results.push({ folder, status: 'NO LINK' });
    continue;
  }
  const href = match[1];
  if (href.startsWith('/shared/')) {
    results.push({ folder, status: 'PASS', href });
  } else {
    results.push({ folder, status: 'FAIL', href });
  }
}

console.table(results);
const failed = results.filter(r => r.status !== 'PASS');
if (failed.length) {
  process.exit(1);
} else {
  console.log('All global.css links are correct!');
}
