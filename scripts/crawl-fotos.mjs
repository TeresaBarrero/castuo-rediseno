// Rastreo de fotografías de castuo.es para el concepto de rediseño.
// Respeta robots.txt (solo se bloquean logs/admin/transients) y espera 1 s entre peticiones.
// Uso: node scripts/crawl-fotos.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'https://castuo.es';
const OUT = path.resolve('src/assets/fotos/original');
const RAW = path.resolve('scripts/.crawl');
const UA = 'Mozilla/5.0 (compatible; portfolio-concept-crawler/1.0)';
const DISALLOW = [/\/wp-content\/uploads\/wc-logs\//, /woocommerce_transient_files/, /woocommerce_uploads/, /add-to-cart=/, /\/wp-admin\//];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SEED = [
  '/', '/historia/', '/produccion/', '/valores/', '/servicios/', '/nuestras-fincas/', '/galeria/', '/vinos/', '/tienda/',
];

async function get(url, binary = false) {
  if (DISALLOW.some((r) => r.test(url))) return null;
  await sleep(1000);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) { console.warn('  ✗', res.status, url); return null; }
    return binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
  } catch (e) { console.warn('  ✗', e.message, url); return null; }
}

const pages = new Map(); // url -> html
const EXTRA = process.argv.slice(2).map((p) => (p.startsWith('http') ? p : ROOT + p));
const queue = EXTRA.length ? EXTRA : SEED.map((p) => ROOT + p);
const seen = new Set();
const allowPage = (u) => u.startsWith(ROOT) && !/\.(jpe?g|png|webp|gif|pdf|svg|zip)(\?|$)/i.test(u) && !/(wp-json|feed|xmlrpc|\?|#|wp-login|carrito|cart|checkout|mi-cuenta|my-account|finalizar)/.test(u);
const relevant = (u) => /castuo\.es\/(historia|produccion|valores|servicios|nuestras-fincas|galeria|vinos|tienda|producto|categoria-producto|product-category|premios|galeria-|instalaciones|oficinas|aniversario)/.test(u) || u === ROOT + '/';

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(RAW, { recursive: true });

// Sitemap: añade URLs de producto/páginas relevantes
const sm = EXTRA.length ? null : await get(ROOT + '/wp-sitemap.xml');
if (sm) {
  const subs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => /posts-(page|product)|taxonomies-product_cat/.test(u));
  for (const s of subs) {
    const x = await get(s);
    if (!x) continue;
    for (const m of x.matchAll(/<loc>([^<]+)<\/loc>/g)) if (relevant(m[1])) queue.push(m[1]);
  }
}

while (queue.length && pages.size < 90) {
  const url = queue.shift().replace(/#.*$/, '');
  if (seen.has(url)) continue;
  seen.add(url);
  console.log('→', url);
  const html = await get(url);
  if (!html) continue;
  pages.set(url, html);
  if (!EXTRA.length) for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const u = m[1].replace(/#.*$/, '');
    if (allowPage(u) && relevant(u) && !seen.has(u)) queue.push(u);
  }
}

// Extrae imágenes de uploads
const imgs = new Map(); // original url -> {pages:Set, alts:Set}
const strip = (u) => u.replace(/-\d{2,4}x\d{2,4}(?=\.(jpe?g|png|webp)$)/i, '').replace(/-scaled(?=\.(jpe?g|png|webp)$)/i, '');
for (const [page, html] of pages) {
  await fs.writeFile(path.join(RAW, encodeURIComponent(page) + '.html'), html);
  const found = new Set();
  for (const m of html.matchAll(/(?:src|data-src|href|data-lazy-src|data-large_image)="(https?:\/\/castuo\.es\/wp-content\/uploads\/[^"]+\.(?:jpe?g|png|webp))"/gi)) found.add(m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/gi)) for (const part of m[1].split(',')) { const u = part.trim().split(/\s+/)[0]; if (/wp-content\/uploads\/.+\.(jpe?g|png|webp)$/i.test(u)) found.add(u); }
  for (const m of html.matchAll(/url\((?:'|")?(https?:\/\/castuo\.es\/wp-content\/uploads\/[^'")]+)(?:'|")?\)/gi)) found.add(m[1]);
  for (const u of found) {
    const o = strip(u.replace(/^http:/, 'https:'));
    if (!imgs.has(o)) imgs.set(o, { pages: new Set(), sized: new Set() });
    imgs.get(o).pages.add(page);
    imgs.get(o).sized.add(u);
  }
}
console.log(`\n${pages.size} páginas, ${imgs.size} imágenes únicas`);

const prevPath = path.resolve('scripts/.crawl/catalogo-bruto.json');
const catalog = EXTRA.length ? JSON.parse(await fs.readFile(prevPath, 'utf8').catch(() => '[]')) : [];
const have = new Set(catalog.map((c) => c.url));
for (const [url, info] of imgs) {
  if (have.has(url)) { const c = catalog.find((x) => x.url === url); for (const p of info.pages) if (!c.paginas.includes(p)) c.paginas.push(p); continue; }
  let buf = await get(url, true);
  let used = url;
  if (!buf) { // prueba -scaled y la versión con tamaño más grande
    const cands = [url.replace(/(\.\w+)$/, '-scaled$1'), ...[...info.sized].sort((a, b) => b.length - a.length)];
    for (const c of cands) { buf = await get(c, true); if (buf) { used = c; break; } }
  }
  if (!buf) continue;
  let meta;
  try { meta = await sharp(buf).metadata(); } catch { continue; }
  const name = decodeURIComponent(used.split('/').pop()).toLowerCase().replace(/[^a-z0-9.\-_]/g, '-');
  const ym = used.match(/uploads\/(\d{4})\/(\d{2})\//);
  const file = (ym ? `${ym[1]}-${ym[2]}-` : '') + name;
  await fs.writeFile(path.join(OUT, file), buf);
  catalog.push({ archivo: file, url: used, paginas: [...info.pages], ancho: meta.width, alto: meta.height, formato: meta.format, descripcion: '' });
  console.log('  ✓', file, meta.width + '×' + meta.height);
}
await fs.writeFile(path.resolve('scripts/.crawl/catalogo-bruto.json'), JSON.stringify(catalog, null, 2));
console.log('\nHecho:', catalog.length, 'imágenes');
