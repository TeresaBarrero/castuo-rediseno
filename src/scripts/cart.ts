// Carrito local del concepto: estado en memoria + localStorage. No hay pago real.
import { $, $$, eur, announce, reduced, openDialog, closeDialog } from './util';

export interface Line { id: string; name: string; variant?: string; price: number; qty: number; img?: string; url?: string }
const KEY = 'castuo-concepto-carrito';

let lines: Line[] = load();

function load(): Line[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* modo privado */ }
}
const count = () => lines.reduce((n, l) => n + l.qty, 0);
const total = () => lines.reduce((n, l) => n + l.qty * l.price, 0);
const key = (l: Pick<Line, 'id' | 'variant'>) => `${l.id}::${l.variant ?? ''}`;

export function addToCart(item: Omit<Line, 'qty'>, qty = 1, source?: Element | null) {
  const k = key(item);
  const found = lines.find((l) => key(l) === k);
  if (found) found.qty += qty; else lines.push({ ...item, qty });
  save();
  const after = () => { render(); bump(); openDrawer(); };
  if (source && !reduced()) fly(source).then(after); else after();
  announce(`${item.name}${item.variant ? ' (' + item.variant + ')' : ''} añadido al carrito. ${count()} productos en total.`);
}

function setQty(k: string, qty: number) {
  const l = lines.find((x) => key(x) === k);
  if (!l) return;
  if (qty <= 0) lines = lines.filter((x) => key(x) !== k); else l.qty = qty;
  save(); render();
  announce(`Carrito actualizado: ${count()} productos, ${eur(total())}.`);
}

function bump() {
  const n = $('[data-cart-count]');
  if (!n || reduced()) return;
  n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump');
}

/** Miniatura que «vuela» desde la foto del producto hasta el icono del carrito. */
function fly(source: Element): Promise<void> {
  const target = $('[data-cart-open]');
  const img = source.matches('img') ? source as HTMLImageElement : source.querySelector('img');
  if (!target || !img) return Promise.resolve();
  const a = img.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  if (!a.width) return Promise.resolve();
  const size = 72;
  const ghost = document.createElement('img');
  ghost.src = img.currentSrc || img.src;
  ghost.alt = '';
  Object.assign(ghost.style, {
    position: 'fixed', zIndex: '300', left: '0', top: '0', width: `${size}px`, height: `${size}px`,
    objectFit: 'cover', borderRadius: '12px', pointerEvents: 'none', boxShadow: '0 10px 30px rgba(23,32,26,.25)',
  });
  document.body.appendChild(ghost);
  const sx = a.left + a.width / 2 - size / 2, sy = a.top + a.height / 2 - size / 2;
  const ex = b.left + b.width / 2 - size / 2, ey = b.top + b.height / 2 - size / 2;
  const anim = ghost.animate([
    { transform: `translate(${sx}px, ${sy}px) scale(1.4)`, opacity: 0 },
    { transform: `translate(${sx}px, ${sy - 30}px) scale(1.1)`, opacity: 1, offset: .2 },
    { transform: `translate(${ex}px, ${ey}px) scale(.25)`, opacity: .6 },
  ], { duration: 750, easing: 'cubic-bezier(.5,0,.2,1)' });
  return anim.finished.then(() => ghost.remove(), () => ghost.remove());
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export function render() {
  const n = count();
  for (const el of $$('[data-cart-count]')) el.textContent = String(n);
  for (const el of $$('[data-cart-label]')) el.textContent = `Carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`;
  for (const list of $$('[data-cart-lines]')) {
    list.innerHTML = lines.map((l) => {
      const k = esc(key(l));
      const thumb = l.img ? `<img src="${esc(l.img)}" alt="" width="72" height="72" loading="lazy">` : '<span class="thumb"></span>';
      return `<li>${thumb}<div><p class="n">${l.url ? `<a href="${esc(l.url)}">${esc(l.name)}</a>` : esc(l.name)}</p>${l.variant ? `<p class="v">${esc(l.variant)}</p>` : ''}
        <div class="q" role="group" aria-label="Cantidad de ${esc(l.name)}"><button type="button" data-qty="-1" data-k="${k}" aria-label="Restar unidad">−</button><span>${l.qty}</span><button type="button" data-qty="1" data-k="${k}" aria-label="Sumar unidad">+</button></div></div>
        <div class="r"><span class="p">${eur(l.qty * l.price)}</span><button type="button" class="rm" data-rm data-k="${k}">Quitar</button></div></li>`;
    }).join('');
  }
  for (const el of $$('[data-cart-total]')) el.textContent = eur(total());
  for (const el of $$('[data-cart-empty]')) el.hidden = n > 0;
  for (const el of $$('[data-cart-foot]')) el.hidden = n === 0;
}

export function openDrawer(opener?: Element | null) {
  openDialog($<HTMLDialogElement>('[data-cart-drawer]'), opener);
}

export function openConceptModal(opener?: Element | null, title?: string, text?: string) {
  const m = $<HTMLDialogElement>('[data-concept-modal]');
  if (!m) return;
  const t = $('[data-cm-title]', m), d = $('[data-cm-text]', m);
  if (t) t.textContent = title ?? 'Esto es un concepto';
  if (d) d.textContent = text ?? 'Esta web es una propuesta de porfolio y no vende productos. Para comprar, visita castuo.es.';
  const drawer = $<HTMLDialogElement>('[data-cart-drawer]');
  if (drawer?.open) closeDialog(drawer);
  openDialog(m, opener);
}

/** Delegación global: se registra una sola vez y funciona tras cada navegación. */
export function bindCart() {
  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    const add = t.closest<HTMLElement>('[data-add]');
    if (add) {
      e.preventDefault();
      const data = JSON.parse(add.dataset.add!);
      const qtyEl = add.dataset.qtyFrom ? $(add.dataset.qtyFrom) : null;
      const qty = qtyEl ? parseInt(qtyEl.textContent || '1', 10) || 1 : 1;
      const src = add.dataset.flyFrom ? $(add.dataset.flyFrom) : add.closest('[data-card]')?.querySelector('img');
      addToCart(data, qty, src);
      return;
    }
    const open = t.closest('[data-cart-open]');
    if (open) { e.preventDefault(); openDrawer(open); return; }
    if (t.closest('[data-cart-close]')) { closeDialog($<HTMLDialogElement>('[data-cart-drawer]'), true); return; }
    const q = t.closest<HTMLElement>('[data-qty][data-k]');
    if (q) { const l = lines.find((x) => key(x) === q.dataset.k); if (l) setQty(q.dataset.k!, l.qty + Number(q.dataset.qty)); return; }
    const rm = t.closest<HTMLElement>('[data-rm]');
    if (rm) { setQty(rm.dataset.k!, 0); return; }
    const co = t.closest('[data-checkout]');
    if (co) { e.preventDefault(); openConceptModal(co, 'Esto es un concepto: para comprar, visita castuo.es', 'Este carrito funciona solo en tu navegador para demostrar la experiencia de compra. No se procesa ningún pago ni se recogen datos.'); return; }
    const concept = t.closest<HTMLElement>('[data-concept]');
    if (concept) { e.preventDefault(); openConceptModal(concept, concept.dataset.conceptTitle, concept.dataset.concept || undefined); return; }
    if (t.closest('[data-cm-close]')) { closeDialog($<HTMLDialogElement>('[data-concept-modal]')); return; }
    // Clic en el fondo de un <dialog> lo cierra
    if (t instanceof HTMLDialogElement && t.open) {
      const r = t.getBoundingClientRect();
      const ev = e as MouseEvent;
      if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) closeDialog(t, t.matches('[data-cart-drawer]'));
    }
  });
  window.addEventListener('storage', (e) => { if (e.key === KEY) { lines = load(); render(); } });
}
