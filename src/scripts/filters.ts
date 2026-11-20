// Filtros de Tienda, Fincas y Blog. El grid se reordena con FLIP (fundido + desplazamiento)
// y el filtro se sincroniza con la URL (?categoria=).
import { $, $$, reduced, announce } from './util';

interface State { cat: string; fmts: string[]; prices: string[]; sort: string }

function priceMatch(p: number, r: string) {
  if (r === 'lt15') return p < 15;
  if (r === '15-50') return p >= 15 && p <= 50;
  if (r === 'gt50') return p > 50;
  return true;
}

function apply(root: HTMLElement, s: State, animate = true) {
  const grid = $('[data-filter-grid]', root)!;
  const items = $$('[data-item]', grid);
  const before = new Map(items.map((el) => [el, el.getBoundingClientRect()]));
  const wasHidden = new Map(items.map((el) => [el, el.hidden]));

  let shown = 0;
  for (const el of items) {
    const cats = (el.dataset.cat ?? '').split(' ');
    const fmts = (el.dataset.formats ?? '').split(' ');
    const price = Number(el.dataset.price ?? 0);
    const ok = (s.cat === 'todo' || cats.includes(s.cat))
      && (!s.fmts.length || s.fmts.some((f) => fmts.includes(f)))
      && (!s.prices.length || s.prices.some((r) => priceMatch(price, r)));
    el.hidden = !ok;
    if (ok) shown++;
  }
  // Orden
  if (s.sort) {
    const sorted = [...items].sort((a, b) => {
      const pa = Number(a.dataset.price), pb = Number(b.dataset.price);
      if (s.sort === 'asc') return pa - pb;
      if (s.sort === 'desc') return pb - pa;
      if (s.sort === 'new') return Number(b.dataset.new ?? 0) - Number(a.dataset.new ?? 0) || Number(a.dataset.order) - Number(b.dataset.order);
      return Number(a.dataset.order) - Number(b.dataset.order);
    });
    sorted.forEach((el) => grid.appendChild(el));
  }

  for (const b of $$<HTMLElement>('[data-filter-cat]', root)) {
    const on = b.dataset.filterCat === s.cat;
    if (b.tagName === 'A') { if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }
    else b.setAttribute('aria-pressed', String(on));
  }
  for (const c of $$('[data-filter-count]', root)) c.textContent = `${shown} ${c.dataset.unit ?? 'resultados'}`;
  const empty = $('[data-filter-empty]', root);
  if (empty) empty.hidden = shown > 0;
  const title = $('[data-filter-title]', root);
  if (title) { const b = $<HTMLElement>(`[data-filter-cat="${s.cat}"]`, root); title.textContent = b?.dataset.title ?? title.textContent; }

  if (!animate || reduced()) return;
  // FLIP
  for (const el of items) {
    if (el.hidden) continue;
    const a = before.get(el)!;
    const b = el.getBoundingClientRect();
    if (wasHidden.get(el) || !a.width) {
      el.animate([{ opacity: 0, transform: 'translateY(16px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.2,.7,.2,1)', delay: 60 });
    } else {
      const dx = a.left - b.left, dy = a.top - b.top;
      if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  }
}

function readState(root: HTMLElement): State {
  const param = root.dataset.param ?? 'categoria';
  const url = new URL(location.href);
  const def = root.dataset.default ?? 'todo';
  const valid = $$<HTMLElement>('[data-filter-cat]', root).map((b) => b.dataset.filterCat);
  const fromUrl = url.searchParams.get(param);
  return {
    cat: fromUrl && valid.includes(fromUrl) ? fromUrl : def,
    fmts: $$<HTMLInputElement>('[data-filter-fmt]:checked', root).map((i) => i.value),
    prices: $$<HTMLInputElement>('[data-filter-price]:checked', root).map((i) => i.value),
    sort: $<HTMLSelectElement>('[data-sort]', root)?.value ?? '',
  };
}

function syncUrl(root: HTMLElement, s: State) {
  const param = root.dataset.param ?? 'categoria';
  const url = new URL(location.href);
  if (s.cat === (root.dataset.default ?? 'todo')) url.searchParams.delete(param); else url.searchParams.set(param, s.cat);
  history.replaceState(history.state, '', url);
}

export function initFilters() {
  for (const root of $$('[data-filter-root]')) {
    if (root.dataset.bound) continue;
    root.dataset.bound = '1';
    const flt = $<HTMLDetailsElement>('[data-flt]', root);
    if (flt && window.matchMedia('(min-width: 961px)').matches) flt.open = true;
    let s = readState(root);
    apply(root, s, false);
    root.addEventListener('click', (e) => {
      const b = (e.target as Element).closest<HTMLElement>('[data-filter-cat]');
      if (!b) return;
      // En /tienda/ los chips son enlaces a la categoría: con JS filtramos sin recargar
      if (b.tagName === 'A' && !root.hasAttribute('data-inline-links')) return;
      e.preventDefault();
      s = { ...s, cat: b.dataset.filterCat! };
      apply(root, s);
      syncUrl(root, s);
      announce(`Mostrando ${b.textContent?.trim()}`);
    });
    root.addEventListener('change', (e) => {
      const t = e.target as HTMLElement;
      if (!t.matches('[data-filter-fmt], [data-filter-price], [data-sort]')) return;
      s = { ...readState(root), cat: s.cat };
      apply(root, s);
    });
    root.addEventListener('click', (e) => {
      if (!(e.target as Element).closest('[data-filter-reset]')) return;
      $$<HTMLInputElement>('input[type=checkbox]', root).forEach((i) => (i.checked = false));
      s = { cat: root.dataset.default ?? 'todo', fmts: [], prices: [], sort: s.sort };
      apply(root, s); syncUrl(root, s);
    });
  }
}
