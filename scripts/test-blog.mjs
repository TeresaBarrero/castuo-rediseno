// Pruebas de interacción del blog «Cuaderno Castúo» con Playwright (requiere `npm run preview`).
// Uso: node scripts/test-blog.mjs
import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:4321';
const out = [];
const ok = (cond, msg) => { out.push(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) process.exitCode = 1; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`${page.url()} → ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${page.url()} → ${m.text()}`); });

// ── Portada
await page.goto(BASE + '/blog/');
ok((await page.locator('h1').count()) === 1, 'Portada: un solo H1');
ok((await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim() === 'Cuaderno Castúo', 'Portada: H1 «Cuaderno Castúo»');
const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
ok(ld.some((s) => s.includes('"@type":"Blog"')), 'Portada: JSON-LD Blog');
ok(ld.some((s) => s.includes('"BreadcrumbList"')), 'Portada: JSON-LD BreadcrumbList');
ok((await page.title()) === 'Cuaderno Castúo · Blog de aceite, vino y campo extremeño', 'Portada: title de la nota s-bp');

// Pestañas: filtran con FLIP y sincronizan ?categoria=
const total = await page.locator('[data-filter-grid] [data-item]:not([hidden])').count();
await page.locator('[data-filter-cat="en-la-cocina"]').click();
ok(page.url().includes('categoria=en-la-cocina'), 'Pestañas: sincronizan ?categoria=en-la-cocina');
const cocina = await page.locator('[data-filter-grid] [data-item]:not([hidden])').count();
const cocinaEsperado = await page.locator('[data-filter-grid] [data-item][data-cat="en-la-cocina"]').count();
ok(cocina === 3, `Pestañas: «En la cocina» muestra las 3 recetas, también las de otras páginas (${cocina})`);
ok(await page.locator('.pag').isHidden(), 'Pestañas: la paginación se oculta al filtrar');
ok(cocina === cocinaEsperado && cocina > 0 && cocina < total, `Pestañas: «En la cocina» muestra ${cocina} de ${total}`);
ok(await page.locator('[data-filter-cat="en-la-cocina"]').getAttribute('aria-current') === 'page', 'Pestañas: aria-current en la activa');
ok(await page.locator('.bf').isHidden(), 'Pestañas: al filtrar se oculta el destacado');
await page.waitForTimeout(900);
const gy = (await page.locator('[data-filter-grid]').boundingBox()).y;
ok(gy >= 0 && gy < 900, `Pestañas: los resultados quedan a la vista (y = ${Math.round(gy)})`);
ok((await page.locator('[data-filter-count]').textContent()).trim() === `${cocina} artículos`, 'Pestañas: el contador coincide');
await page.locator('[data-filter-cat="noticias"]').click();
ok(await page.locator('[data-filter-empty]').isHidden() && (await page.locator('[data-filter-grid] [data-item]:not([hidden])').count()) > 0, 'Pestañas: «Noticias» con artículos (sin estado vacío)');
await page.locator('[data-filter-cat="todo"]').click();
ok(await page.locator('.bf').isVisible(), 'Pestañas: «Todo» recupera el destacado');
await page.goto(BASE + '/blog/?categoria=vino');
ok((await page.locator('[data-filter-grid] [data-item]:not([hidden])').count()) === (await page.locator('[data-filter-grid] [data-item][data-cat="vino"]').count()), 'Pestañas: ?categoria=vino filtra al cargar');

// Buscador
await page.goto(BASE + '/blog/');
await page.locator('#bq').fill('migas');
await page.waitForSelector('[data-bs-panel]:not([hidden])');
ok((await page.locator('[data-bs-results] a').first().textContent()).includes('Migas'), 'Buscador: «migas» encuentra la receta');
ok((await page.locator('[data-bs-status]').textContent()).includes('para «migas»'), 'Buscador: estado en role=status');
await page.locator('#bq').fill('cosecha temprana');
await page.waitForTimeout(300);
ok((await page.locator('[data-bs-results] a').first().textContent()).toLowerCase().includes('cosecha temprana'), 'Buscador: varias palabras, sin tildes');
await page.keyboard.press('ArrowDown');
ok(await page.evaluate(() => document.activeElement?.closest('[data-bs-results]') !== null), 'Buscador: flecha abajo lleva a los resultados');
await page.keyboard.press('Escape');
ok(await page.locator('[data-bs-panel]').isHidden(), 'Buscador: Esc cierra el panel');
await page.goto(BASE + '/blog/?q=Chamizo');
await page.waitForSelector('[data-bs-panel]:not([hidden])');
ok((await page.locator('[data-bs-results] a').first().textContent()).includes('castúo'), 'Buscador: ?q= (etiquetas) abre la búsqueda');

// El año en el campo
const month = new Date().getMonth() + 1;
ok(await page.locator(`[data-month="${month}"]`).getAttribute('aria-pressed') === 'true', 'Año en el campo: abre el mes actual');
await page.locator('[data-month="3"]').click();
ok(await page.locator('[data-month="3"]').getAttribute('aria-pressed') === 'true', 'Año en el campo: clic en marzo (aria-pressed)');
ok(await page.locator('[data-panel-month="3"]').evaluate((e) => e.classList.contains('is-on')), 'Año en el campo: muestra el panel de marzo');
await page.locator('[data-month="3"]').focus();
await page.keyboard.press('ArrowRight');
ok(await page.locator('[data-month="4"]').getAttribute('aria-pressed') === 'true', 'Año en el campo: flecha derecha → abril');
ok(await page.evaluate(() => document.activeElement?.getAttribute('data-month') === '4'), 'Año en el campo: el foco sigue la selección');
await page.keyboard.press('End');
ok(await page.locator('[data-month="12"]').getAttribute('aria-pressed') === 'true', 'Año en el campo: Fin → diciembre');
await page.keyboard.press('ArrowRight');
ok(await page.locator('[data-month="1"]').getAttribute('aria-pressed') === 'true', 'Año en el campo: da la vuelta a enero');

// Newsletter ficticia
await page.locator('#nl-blog').fill('no-es-correo');
await page.locator('#nl-blog').press('Enter');
ok((await page.locator('#nl-blog-msg').textContent()).includes('válido'), 'La carta castúa: valida el correo');
await page.locator('#nl-blog').fill('prueba@correo.es');
await page.locator('#nl-blog').press('Enter');
ok((await page.locator('#nl-blog-msg').textContent()).includes('Gracias'), 'La carta castúa: confirma sin enviar');

// ── Artículo
await page.goto(BASE + '/blog/que-significa-castuo/');
ok((await page.locator('h1').count()) === 1, 'Artículo: un solo H1');
ok((await page.title()) === 'Qué significa castúo · Origen de la palabra | Castuo', 'Artículo: title de la nota s-ba');
const ald = (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n');
for (const t of ['BlogPosting', 'FAQPage', 'BreadcrumbList']) ok(ald.includes(`"${t}"`), `Artículo: JSON-LD ${t}`);
ok(ald.includes('"author":{"@type":"Organization"'), 'Artículo: autor como Organization');
ok((await page.locator('[data-toc-link]').count()) === 5, 'Índice: 5 secciones generadas desde los H2');
ok((await page.locator('blockquote').innerText()).includes('cultivan por sí mismo sus propios campos'), 'Cita de Luis Chamizo');
await page.locator('.cifras').scrollIntoViewIfNeeded();
await page.waitForTimeout(1600);
ok((await page.locator('.cifras__n').nth(2).textContent()) === '+1.100', 'Cifras: terminan en el valor real (+1.100)');
ok((await page.locator('.cifras__n').first().textContent()) === '1965', 'Cifras: 1965 sin separador de miles');
await page.locator('#de-137-socios-a-más-de-1100, [id^="de-137"]').first().scrollIntoViewIfNeeded();
await page.evaluate(() => { const h = document.querySelector('[id^="de-137"]'); window.scrollTo(0, h.getBoundingClientRect().top + scrollY - 100); });
await page.waitForTimeout(300);
ok((await page.locator('[data-toc-link][aria-current="true"]').textContent()).includes('137'), 'Índice: resalta la sección activa');
const p = await page.evaluate(() => { const s = document.querySelector('[data-rprog] span'); return new DOMMatrix(getComputedStyle(s).transform).a; });
ok(p > 0.2 && p < 1, `Progreso de lectura ligado al scroll (${p.toFixed(2)})`);
await page.locator('[data-copy-link]').click();
await page.waitForTimeout(200);
ok((await page.locator('[data-toast]').textContent()) === 'Enlace copiado', 'Copiar enlace: aviso «Enlace copiado» (aria-live)');
ok((await page.evaluate(() => navigator.clipboard.readText())).includes('/blog/que-significa-castuo/'), 'Copiar enlace: copia la URL');
const faq = page.locator('#faqa-b1');
await faq.click();
ok(await faq.getAttribute('aria-expanded') === 'true', 'Preguntas rápidas: acordeón abre');
ok((await page.locator('.rel [data-reveal]').count()) === 3, 'Sigue leyendo: 3 artículos');
ok((await page.locator('a[href="/calidad-y-premios/"]').count()) > 0, 'Artículo: enlaza a Calidad y premios');

// Móvil: índice en <details> y barra inferior
const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await m.newPage();
await mp.goto(BASE + '/blog/que-significa-castuo/');
ok(await mp.locator('details.tocm').isVisible(), 'Móvil: índice en <details>');
ok(await mp.locator('.toc').isHidden(), 'Móvil: índice lateral oculto');
ok(await mp.locator('[data-abar]').isVisible(), 'Móvil: barra inferior con «Compartir» y el producto');
const sw = await mp.evaluate(() => document.documentElement.scrollWidth);
ok(sw <= 390, `Móvil: sin scroll horizontal (${sw}px)`);
await mp.goto(BASE + '/blog/');
ok((await mp.evaluate(() => document.documentElement.scrollWidth)) <= 390, 'Móvil: portada sin scroll horizontal');

// Paginación
const p2 = await page.goto(BASE + '/blog/pagina/2/');
ok(p2.ok() && (await page.locator('[data-reveal-group] .pc').count()) > 0, 'Paginación: /blog/pagina/2/ con artículos');
await page.goto(BASE + '/blog/');
ok((await page.locator('.pag a[rel="next"]').count()) === 1, 'Paginación: «Siguientes» en la portada');
ok((await page.locator('[data-filter-grid] [data-item]:not([hidden])').count()) === 9, 'Paginación: 9 artículos por página');
await page.goto(BASE + '/blog/arranca-la-campana-de-aceituna/');
ok(await page.locator('.demo').isVisible(), 'Noticias inventadas: aviso «Contenido de ejemplo»');

// Páginas de categoría, RSS y redirección
const cat = await page.goto(BASE + '/blog/en-la-cocina/');
ok(cat.ok() && (await page.title()).startsWith('Recetas extremeñas'), 'Categoría: página propia con su title');
ok(await page.locator('[aria-current="page"][href="/blog/en-la-cocina/"]').count() === 1, 'Categoría: pestaña activa');
const rss = await page.goto(BASE + '/blog/rss.xml');
const xml = await rss.text();
ok(rss.ok() && (xml.match(/<item>/g) || []).length >= 6, 'RSS: /blog/rss.xml con los artículos');
await page.goto(BASE + '/blog/como-elegir-aceite-de-oliva-virgen-extra/');
await page.waitForURL('**/como-leer-la-etiqueta-del-aceite/');
ok(page.url().endsWith('/blog/como-leer-la-etiqueta-del-aceite/'), 'Redirección: URL antigua → etiqueta');

// Reduced motion: el título no se anima y las cifras muestran el valor final
const r = await browser.newContext({ reducedMotion: 'reduce' });
const rp = await r.newPage();
await rp.goto(BASE + '/blog/');
ok(await rp.locator('.bh__li').first().evaluate((e) => getComputedStyle(e).animationName === 'none'), 'Reduced motion: «Cuaderno Castúo» sin animación');
await rp.goto(BASE + '/blog/que-significa-castuo/');
ok((await rp.locator('.cifras__n').nth(1).textContent()) === '137', 'Reduced motion: cifras con su valor final');

await browser.close();
console.log(out.join('\n'));
if (errors.length) { console.log('\nErrores de consola:\n' + errors.join('\n')); process.exitCode = 1; }
console.log(`\n${out.filter((l) => l.startsWith('✓')).length}/${out.length} pruebas superadas`);
