// Capturas a 390 y 1440 px (y otras anchuras con --widths) de cada página.
// Uso: npm run preview (en otra terminal) && node scripts/screenshots.mjs [--out capturas] [--only /,/tienda/] [--widths 390,1440]
import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'http://localhost:4321');
const OUT = arg('--out', 'capturas');
const widths = arg('--widths', '390,1440').split(',').map(Number);
const ROUTES = arg('--only', '/,/tienda/,/tienda/aceite-de-oliva-virgen-extra/,/producto/aceite-de-oliva-virgen-extra/,/producto/estuche-regalo-3-botellas/,/producto/aove-cosecha-temprana-6x2l/,/cooperativa/,/fincas/,/fincas/vina-en-espaldera/,/calidad-y-premios/,/visitas-almazara-guarena/,/blog/,/blog/que-significa-castuo/,/blog/migas-extremenas-con-aceite/,/preguntas-frecuentes/,/socios/,/contacto/,/carrito/,/no-existe/').split(',');

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    // Recorre la página para cargar imágenes lazy
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(400);
    const name = (r === '/' ? 'inicio' : r.replace(/^\/|\/$/g, '').replace(/\//g, '__')) + `-${w}.jpg`;
    await page.screenshot({ path: `${OUT}/${name}`, fullPage: true, type: 'jpeg', quality: 78 });
    console.log('✓', name);
  }
  await ctx.close();
}
await browser.close();
