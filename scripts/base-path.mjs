// Post-build: publica el sitio bajo una subruta (GitHub Pages de proyecto, p. ej. /castuo-rediseno/).
// Reescribe en dist/ las rutas internas absolutas ("/tienda/", "/_astro/…") y las URL completas del sitio
// (canónicas, Open Graph, JSON-LD, sitemap) añadiendo el prefijo. Uso: BASE_PATH=/castuo-rediseno node scripts/base-path.mjs
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');
const SITE = (process.env.SITE_URL || 'https://teresabarrero.github.io').replace(/\/$/, '');
if (!BASE) { console.log('BASE_PATH vacío: no se reescribe nada'); process.exit(0); }

const SEGMENTS = ['_astro', 'og', 'tienda', 'producto', 'cooperativa', 'fincas', 'calidad-y-premios', 'visitas-almazara-guarena', 'blog', 'preguntas-frecuentes', 'socios', 'contacto', 'carrito', 'buscar', 'legal', 'favicon.png', 'apple-touch-icon.png', 'search.json', 'sitemap-index.xml', 'sitemap-0.xml', 'robots.txt'];
const seg = SEGMENTS.map((s) => s.replace(/\./g, '\\.')).join('|');
// Caracteres que pueden preceder a una ruta: comillas, &quot;, paréntesis (url()), espacio/coma (srcset), =
const PRE = '(["\'`(\\s,=]|&quot;)'; // incluye la comilla invertida de los template literals del JS minificado
const reSeg = new RegExp(`${PRE}\\/(?=(?:${seg})(?:[\\/"'\`?#),\\s&]|$))`, 'g');
const reHome = new RegExp(`${PRE}\\/(?=["'#]|&quot;)`, 'g'); // href="/" y "/#..."
const siteEsc = SITE.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const reAbs = new RegExp(`${siteEsc}(?!${BASE.replace(/\//g, '\\/')}(?:\\/|$))(\\/|(?=["'<\\s]))`, 'g');

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
let n = 0;
for (const f of walk('dist').filter((x) => /\.(html|js|json|xml|css|txt|webmanifest)$/.test(x))) {
  const s = fs.readFileSync(f, 'utf8');
  let out = s.replace(reAbs, `${SITE}${BASE}/`);
  if (/\.(html|json|css)$/.test(f)) out = out.replace(reSeg, `$1${BASE}/`).replace(reHome, `$1${BASE}/`);
  else if (/\.js$/.test(f)) out = out.replace(reSeg, `$1${BASE}/`); // en JS, solo rutas con segmento conocido
  if (out !== s) { fs.writeFileSync(f, out); n++; }
}
console.log(`Prefijo ${BASE} aplicado en ${n} archivos (sitio ${SITE}${BASE}/)`);
