import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
const routes = ['/', '/tienda/', '/producto/aceite-de-oliva-virgen-extra/', '/cooperativa/', '/blog/migas-extremenas-con-aceite/', '/preguntas-frecuentes/', '/visitas-almazara-guarena/'];
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
for (const r of routes) {
  const res = await lighthouse('http://localhost:4323' + r, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['seo'] });
  const fails = Object.values(res.lhr.audits).filter((x) => x.score !== null && x.score < 1 && x.scoreDisplayMode === 'binary').map((x) => x.id);
  console.log(r, 'SEO', Math.round(res.lhr.categories.seo.score * 100), fails.join(','));
}
await chrome.kill();
