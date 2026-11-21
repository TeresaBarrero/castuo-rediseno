// Lighthouse en móvil (configuración por defecto: Moto G Power, 4G lenta) sobre el build servido en local.
// Uso: npm run preview (otra terminal) && node scripts/lighthouse.mjs [/ruta,/otra]
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE = process.env.BASE || 'http://localhost:4321';
const routes = (process.argv[2] || '/,/tienda/,/producto/aceite-de-oliva-virgen-extra/,/cooperativa/,/fincas/,/calidad-y-premios/,/visitas-almazara-guarena/,/blog/,/blog/que-significa-castuo/,/preguntas-frecuentes/,/socios/,/contacto/').split(',');
await fs.mkdir('lighthouse', { recursive: true });
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
const rows = [];
for (const r of routes) {
  const res = await lighthouse(BASE + r, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
  const c = res.lhr.categories, a = res.lhr.audits;
  const row = {
    ruta: r,
    rendimiento: Math.round(c.performance.score * 100), accesibilidad: Math.round(c.accessibility.score * 100),
    buenas: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
    LCP: a['largest-contentful-paint'].displayValue, CLS: a['cumulative-layout-shift'].displayValue, TBT: a['total-blocking-time'].displayValue,
  };
  rows.push(row);
  const fails = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode === 'binary').map((x) => x.id);
  console.log(JSON.stringify(row), fails.length ? `· fallos: ${fails.join(', ')}` : '');
  await fs.writeFile(`lighthouse/${r === '/' ? 'inicio' : r.replace(/^\/|\/$/g, '').replace(/\//g, '__')}.json`, JSON.stringify(res.lhr));
}
await chrome.kill();
await fs.writeFile('lighthouse/resumen.json', JSON.stringify(rows, null, 2));
