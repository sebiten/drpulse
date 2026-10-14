import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
for (const locale of ['en', 'es', 'de', 'fr', 'pt']) {
  const path = locale === 'en' ? '' : `${locale}/`;
  const html = readFileSync(new URL(`${path}index.html`, dist), 'utf8');
  assert.ok(html.includes(`<html lang="${locale}">`));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`rel="canonical" href="https://www.drpulse.dev/${path}"`));
  assert.equal((html.match(/rel="alternate" hreflang=/g) || []).length, 6);
  assert.ok(html.includes('Diminish DR Tracker') && html.includes('id="instalacion"'));
  assert.ok(!html.includes('/arena.png') && !html.includes('/drpulse-emblem.png'));
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(schema);
  assert.equal(JSON.parse(schema[1]).inLanguage, locale);
  for (const match of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)) {
    assert.ok(existsSync(new URL(match[1].slice(1), dist)), `Missing asset: ${match[1]}`);
  }
  console.log(`${locale}: static content, canonical, hreflang, schema and assets OK`);
}
assert.equal((readFileSync(new URL('sitemap.xml', dist), 'utf8').match(/<loc>/g) || []).length, 5);
assert.ok(readFileSync(new URL('robots.txt', dist), 'utf8').includes('/sitemap.xml'));
console.log('Sitemap and robots OK');
