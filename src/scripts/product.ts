// Ficha de producto: selector de formato (precio, €/L, total, foto con crossfade), cantidad,
// galería con miniaturas, lightbox accesible y barra fija «Añadir al carrito» en móvil.
import { $, $$, eur, openDialog, closeDialog, announce } from './util';

interface Fmt { key: string; label: string; title: string; short: string; price: number; litres?: number; img?: string; out?: boolean }

export function initProduct() {
  const root = $('[data-product]');
  if (!root || root.dataset.bound) return;
  root.dataset.bound = '1';
  const fmts: Fmt[] = JSON.parse(root.dataset.formats ?? '[]');
  const base = JSON.parse(root.dataset.base ?? '{}');
  let idx = Math.max(0, fmts.findIndex((f) => f.key === root.dataset.initial));
  let qty = 1;

  const priceEl = $('[data-p-price]', root);
  const perEl = $('[data-p-per]', root);
  const totalEls = $$('[data-p-total]');
  const qtyEl = $('[data-p-qty]', root);
  const titleEl = $('[data-p-title]', root);
  const crumbEl = $('[data-p-crumb]');
  const specEl = $('[data-p-spec-fmt]');
  const addBtns = $$<HTMLElement>('[data-p-add]');

  function update(push = false) {
    const f = fmts[idx];
    if (!f) return;
    if (priceEl) priceEl.textContent = eur(f.price);
    if (perEl) perEl.textContent = f.litres ? `${eur(f.price / f.litres)}/L` : '';
    for (const t of totalEls) t.textContent = eur(f.price * qty);
    if (qtyEl) qtyEl.textContent = String(qty);
    if (titleEl && fmts.length > 1) titleEl.textContent = f.title;
    if (crumbEl && fmts.length > 1) crumbEl.textContent = f.short;
    if (specEl) specEl.textContent = f.title.charAt(0).toUpperCase() + f.title.slice(1);
    for (const b of $$<HTMLElement>('[data-fmt]', root!)) b.setAttribute('aria-pressed', String(Number(b.dataset.fmt) === idx));
    // Crossfade de la foto principal
    for (const m of $$<HTMLElement>('[data-main-img]', root!)) {
      const on = m.dataset.mainImg === f.key;
      const was = m.classList.contains('is-active');
      if (was && !on) {
        m.classList.remove('is-active'); m.classList.add('is-leaving');
        setTimeout(() => m.classList.remove('is-leaving'), 520);
      }
      if (on && !was) { m.classList.add("is-entering"); setTimeout(() => m.classList.remove("is-entering"), 520); }
      if (on) { m.classList.remove("is-leaving"); m.classList.add("is-active"); }
      m.setAttribute('aria-hidden', String(!on));
    }
    const sel = $<HTMLSelectElement>('[data-fmt-select]', root!);
    if (sel) sel.value = String(idx);
    for (const b of addBtns) {
      b.dataset.add = JSON.stringify({ ...base, variant: fmts.length > 1 ? f.short : undefined, price: f.price, img: f.img ?? base.img });
      b.toggleAttribute('disabled', !!f.out);
    }
    if (push && fmts.length > 1) {
      const u = new URL(location.href); u.searchParams.set('formato', f.key);
      history.replaceState(history.state, '', u);
    }
  }

  root.addEventListener('click', (e) => {
    const t = e.target as Element;
    const fb = t.closest<HTMLElement>('[data-fmt]');
    if (fb) { idx = Number(fb.dataset.fmt); update(true); announce(`${fmts[idx].short}: ${eur(fmts[idx].price)}`); return; }
    const q = t.closest<HTMLElement>('[data-p-q]');
    if (q) { qty = Math.max(1, Math.min(99, qty + Number(q.dataset.pQ))); update(); return; }
    const th = t.closest<HTMLElement>('[data-thumb]');
    if (th) { openLightbox(Number(th.dataset.thumb), th); return; }
    const z = t.closest<HTMLElement>('[data-zoom]');
    if (z) { const active = $<HTMLElement>('[data-main-img].is-active', root); openLightbox(Number(active?.dataset.gIdx ?? 0), z); }
  });
  root.addEventListener('change', (e) => {
    const s = (e.target as HTMLElement).closest<HTMLSelectElement>('[data-fmt-select]');
    if (!s) return;
    idx = Number(s.value); update(true); announce(`${fmts[idx].short}: ${eur(fmts[idx].price)}`);
  });
  // Formato inicial desde la URL
  const fromUrl = new URL(location.href).searchParams.get('formato');
  const i = fmts.findIndex((f) => f.key === fromUrl);
  if (i >= 0) idx = i;
  update();
  for (const m of $$<HTMLElement>('[data-main-img].is-leaving', root)) m.classList.remove('is-leaving');

  // Barra fija en móvil cuando el botón principal sale de pantalla (por arriba)
  // (comprobación en scroll + rAF: un IntersectionObserver no se dispara si un salto
  // de scroll pasa por encima del botón sin llegar a intersecarlo)
  checkSticky();
  if (!stickyBound) {
    stickyBound = true;
    let tick = false;
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; checkSticky(); }); } }, { passive: true });
  }
}

let stickyBound = false;
function checkSticky() {
  const main = $('[data-p-main-add]');
  const bar = $('[data-sticky-atc]');
  if (!main || !bar) return;
  const show = main.getBoundingClientRect().bottom < 0;
  if (bar.classList.contains('is-on') === show) return;
  bar.classList.toggle('is-on', show);
  bar.toggleAttribute('inert', !show);
}

/* Lightbox */
let lbIdx = 0;
function lbItems() { return $$<HTMLTemplateElement>('[data-lb-src]'); }
function lbShow(i: number) {
  const items = lbItems();
  if (!items.length) return;
  lbIdx = (i + items.length) % items.length;
  const fig = $('[data-lb-figure]');
  if (!fig) return;
  fig.innerHTML = '';
  fig.appendChild(items[lbIdx].content.cloneNode(true));
  const c = $('[data-lb-count]');
  if (c) c.textContent = `${lbIdx + 1} / ${items.length}`;
}
export function openLightbox(i: number, opener?: Element | null) {
  lbShow(i);
  openDialog($<HTMLDialogElement>('[data-lightbox]'), opener);
}
export function bindLightbox() {
  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t.closest('[data-lb-prev]')) lbShow(lbIdx - 1);
    else if (t.closest('[data-lb-next]')) lbShow(lbIdx + 1);
    else if (t.closest('[data-lb-close]')) closeDialog($<HTMLDialogElement>('[data-lightbox]'));
    else { const g = t.closest<HTMLElement>('[data-gallery-open]'); if (g) openLightbox(Number(g.dataset.galleryOpen), g); }
  });
  document.addEventListener('keydown', (e) => {
    const lb = $<HTMLDialogElement>('[data-lightbox]');
    if (!lb?.open) return;
    if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
    if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
  });
}
