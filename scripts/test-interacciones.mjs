// Pruebas de interacción con Playwright (requiere `npm run preview`).
import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:4321';
const out = [];
const ok = (cond, msg) => { out.push(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) process.exitCode = 1; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`${page.url()} → ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${page.url()} → ${m.text()}`); });

// Inicio: añadir al carrito desde «Los más pedidos»
await page.goto(BASE + '/');
await page.locator('.best [data-add]').first().click();
await page.waitForSelector('[data-cart-drawer][open]');
ok(await page.locator('[data-cart-count]').first().textContent() === '1', 'Inicio: añadir al carrito suma 1 y abre el mini-carrito');
ok((await page.locator('[data-cart-drawer] [data-cart-lines] li').count()) === 1, 'Mini-carrito muestra la línea');
await page.locator('[data-cart-drawer] [data-qty="1"]').click();
ok((await page.locator('[data-cart-drawer] [data-cart-total]').textContent()).includes('16,00'), 'Cantidad +1 actualiza total (16,00 €)');
await page.locator('[data-cart-drawer] [data-checkout]').click();
await page.waitForSelector('[data-concept-modal][open]');
ok((await page.locator('[data-cm-title]').textContent()).includes('castuo.es'), 'Finalizar compra abre el modal de concepto');
await page.keyboard.press('Escape');
ok(!(await page.locator('[data-concept-modal][open]').count()), 'Esc cierra el modal');

// Acordeón
const acc = page.locator('#hfaq-b1');
await acc.click();
ok(await acc.getAttribute('aria-expanded') === 'true', 'Acordeón de FAQ abre con aria-expanded');
ok(await page.locator('#hfaq-b0').getAttribute('aria-expanded') === 'false', 'Acordeón cierra el anterior');

// Tienda: filtro sincronizado con URL
await page.goto(BASE + '/tienda/');
await page.locator('[data-filter-cat="vino"]').click();
ok(page.url().includes('categoria=vino'), 'Tienda: filtro sincroniza ?categoria=vino');
const visible = await page.locator('[data-filter-grid] [data-item]:not([hidden])').count();
ok(visible === 5, `Tienda: 5 vinos visibles (${visible})`);
await page.goto(BASE + '/tienda/?categoria=estuches');
ok((await page.locator('[data-filter-grid] [data-item]:not([hidden])').count()) === 6, 'Tienda: ?categoria=estuches al cargar muestra 6');
await page.locator('[data-filter-cat="todo"]').click();
await page.locator('input[data-filter-price][value="gt50"]').check();
ok((await page.locator('[data-filter-grid] [data-item]:not([hidden])').count()) === 4, 'Tienda: filtro «Más de 50 €» → 4');
await page.selectOption('[data-sort]', 'asc');
const firstPrice = await page.locator('[data-filter-grid] [data-item]:not([hidden])').first().getAttribute('data-price');
ok(firstPrice === '52.8', `Orden por precio ascendente (${firstPrice})`);

// Ficha: selector de formato
await page.goto(BASE + '/producto/aceite-de-oliva-virgen-extra/');
await page.locator('[data-fmt="1"]').click();
ok((await page.locator('[data-p-price]').textContent()).includes('8,00'), 'Ficha: formato 500 ml → 8,00 €');
ok((await page.locator('[data-p-per]').textContent()).includes('16,00'), 'Ficha: €/L 16,00');
ok(page.url().includes('formato=500ml'), 'Ficha: formato en la URL');
await page.locator('[data-p-q="1"]').click();
ok((await page.locator('.pd__add [data-p-total]').textContent()).includes('16,00'), 'Ficha: cantidad 2 → total 16,00 €');
await page.locator('.pd__add').click();
await page.waitForSelector('[data-cart-drawer][open]');
ok((await page.locator('[data-cart-count]').first().textContent()) === '4', 'Ficha: añade 2 unidades (total 4)');
await page.keyboard.press('Escape');
await page.locator('[data-thumb="2"]').click();
await page.waitForSelector('[data-lightbox][open]');
ok((await page.locator('[data-lb-count]').textContent()) === '3 / 9', 'Lightbox abre en la foto elegida');
await page.keyboard.press('ArrowRight');
ok((await page.locator('[data-lb-count]').textContent()) === '4 / 9', 'Lightbox: flecha derecha avanza');
await page.keyboard.press('Escape');

// Estuche: selector desplegable
await page.goto(BASE + '/producto/estuche-regalo-3-botellas/');
await page.selectOption('[data-fmt-select]', '19');
ok((await page.locator('[data-p-price]').textContent()).includes('32,20'), 'Estuche 3: composición más cara 32,20 €');

// Agotado
await page.goto(BASE + '/producto/aove-cosecha-temprana-6x2l/');
ok(await page.locator('.pd__notify').count() === 1, 'Agotado: formulario «Avísame» en lugar de comprar');
await page.locator('.pd__notify button[type=submit]').click();
ok((await page.locator('.pd__notify [data-form-msg]').getAttribute('class')).includes('err'), 'Avísame vacío muestra error');
await page.fill('#notify-mail', 'prueba@ejemplo.es');
await page.locator('.pd__notify button[type=submit]').click();
ok((await page.locator('.pd__notify [data-form-msg]').getAttribute('class')).includes('ok'), 'Avísame válido muestra confirmación ficticia');

// Formulario de visitas
await page.goto(BASE + '/visitas-almazara-guarena/');
await page.locator('[data-pick-visit="Grupos y centros educativos"]').click();
ok((await page.inputValue('#v-exp')) === 'Grupos y centros educativos', 'Visitas: elegir tarjeta rellena el select');
await page.locator('.vform button[type=submit]').click();
ok((await page.locator('#v-name').getAttribute('aria-invalid')) === 'true', 'Visitas: validación marca campos inválidos');

// FAQ: pestañas y hash
await page.goto(BASE + '/preguntas-frecuentes/#vino');
ok(!(await page.locator('#vino').getAttribute('hidden') !== null), 'FAQ: #vino abre esa pestaña');

// Blog: filtro
await page.goto(BASE + '/blog/');
await page.locator('[data-filter-cat="en-la-cocina"]').click();
ok((await page.locator('[data-filter-grid] [data-item]:not([hidden])').count()) === (await page.locator('[data-filter-grid] [data-item][data-cat="en-la-cocina"]').count()), 'Blog: filtro En la cocina (detalle en test-blog.mjs)');
await page.locator('[data-filter-cat="noticias"]').click();
ok(await page.locator('[data-filter-empty]').isHidden(), 'Blog: Noticias muestra sus artículos');

// Menú móvil
const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await m.newPage();
mp.on('pageerror', (e) => errors.push(`(móvil) ${e.message}`));
await mp.goto(BASE + '/');
await mp.locator('[data-menu-open]').click();
ok(await mp.locator('[data-menu]').isVisible(), 'Menú móvil se abre');
ok(await mp.evaluate(() => document.body.classList.contains('is-locked')), 'Menú móvil bloquea el scroll');
for (let i = 0; i < 15; i++) await mp.keyboard.press('Tab');
ok(await mp.evaluate(() => !!document.activeElement?.closest('[data-menu]')), 'Foco atrapado dentro del menú');
await mp.keyboard.press('Escape');
await mp.waitForTimeout(450);
ok(!(await mp.locator('[data-menu]').isVisible()), 'Esc cierra el menú');
ok(await mp.evaluate(() => document.activeElement?.hasAttribute('data-menu-open')), 'El foco vuelve al botón de menú');
// Barra fija en ficha (móvil)
await mp.goto(BASE + '/producto/aceite-de-oliva-virgen-extra/');
await mp.evaluate(() => window.scrollTo(0, 2600));
await mp.waitForTimeout(600);
ok(await mp.locator('[data-sticky-atc].is-on').count() === 1, 'Ficha móvil: aparece la barra fija «Añadir»');
// Sin scroll horizontal
for (const w of [360, 390]) {
  await mp.setViewportSize({ width: w, height: 800 });
  for (const r of ['/', '/tienda/', '/producto/estuche-regalo-3-botellas/', '/cooperativa/', '/calidad-y-premios/', '/visitas-almazara-guarena/', '/blog/', '/preguntas-frecuentes/', '/socios/', '/contacto/', '/carrito/']) {
    await mp.goto(BASE + r);
    const ov = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (ov > 0) ok(false, `Scroll horizontal en ${r} a ${w}px (+${ov}px)`);
  }
}
ok(true, 'Comprobado scroll horizontal a 360 y 390 px');

await browser.close();
console.log(out.join('\n'));
console.log(errors.length ? `\nErrores de consola:\n${[...new Set(errors)].join('\n')}` : '\nSin errores de consola.');
