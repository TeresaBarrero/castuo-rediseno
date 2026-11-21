// Interacciones del blog «Cuaderno Castúo»: buscador, «El año en el campo», índice con sección activa,
// compartir y barra de progreso de lectura (alternativa en JS cuando no hay animation-timeline o hay reduced-motion).
import { $, $$, reduced, announce } from './util';

const cleanups: (() => void)[] = [];
export function cleanupBlog() { cleanups.splice(0).forEach((f) => f()); }

/* ───────── Buscador (índice JSON generado en build) ───────── */
interface Doc { t: string; u: string; c: string; d: string; k: string; b: string }
let index: Promise<Doc[]> | null = null;
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
function loadIndex() {
  index ??= fetch('/blog/search.json').then((r) => r.json()).catch(() => { index = null; return []; });
  return index;
}
function highlight(text: string, terms: string[]) {
  const n = norm(text);
  const marks: [number, number][] = [];
  for (const t of terms) { let i = n.indexOf(t); while (i > -1) { marks.push([i, i + t.length]); i = n.indexOf(t, i + t.length); } }
  if (!marks.length) return esc(text);
  marks.sort((a, b) => a[0] - b[0]);
  let out = '', pos = 0;
  for (const [a, b] of marks) { if (a < pos) continue; out += esc(text.slice(pos, a)) + '<mark>' + esc(text.slice(a, b)) + '</mark>'; pos = b; }
  return out + esc(text.slice(pos));
}
function search(docs: Doc[], q: string) {
  const terms = norm(q).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return { terms, hits: [] as Doc[] };
  const scored = docs.map((d) => {
    const t = norm(d.t), k = norm(`${d.c} ${d.d} ${d.k}`), b = norm(d.b);
    let s = 0;
    for (const term of terms) {
      if (t.includes(term)) s += 10; else if (k.includes(term)) s += 4; else if (b.includes(term)) s += 1; else return { d, s: 0 };
    }
    return { d, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  return { terms, hits: scored.map((x) => x.d) };
}
function initSearch() {
  const root = $('[data-blog-search]');
  if (!root) return;
  const input = $<HTMLInputElement>('[data-bs-input]', root)!;
  const panel = $('[data-bs-panel]', root)!;
  const status = $('[data-bs-status]', root)!;
  const list = $('[data-bs-results]', root)!;
  const form = input.form!;
  let timer = 0;
  const close = () => { panel.hidden = true; };
  const run = async () => {
    const q = input.value.trim();
    if (q.length < 2) { close(); status.textContent = ''; list.innerHTML = ''; return; }
    const { terms, hits } = search(await loadIndex(), q);
    panel.hidden = false;
    status.textContent = hits.length ? `${hits.length} ${hits.length === 1 ? 'artículo' : 'artículos'} para «${q}»` : `Ningún artículo para «${q}». Prueba con otra palabra o busca en toda la web.`;
    list.innerHTML = hits.slice(0, 8).map((h) => `<li><a href="${h.u}"><small>${esc(h.c)}</small>${highlight(h.t, terms)}</a></li>`).join('')
      + (hits.length ? '' : `<li><a href="/buscar/?q=${encodeURIComponent(q)}"><small>Toda la web</small>Buscar «${esc(q)}» en productos y páginas</a></li>`);
  };
  const onInput = () => { clearTimeout(timer); timer = window.setTimeout(run, 140); };
  const onSubmit = (e: Event) => { e.preventDefault(); e.stopImmediatePropagation(); run().then(() => $<HTMLAnchorElement>('a', list)?.focus()); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !panel.hidden) { close(); input.focus(); }
    if (e.key === 'ArrowDown' && (e.target === input) && !panel.hidden) { e.preventDefault(); $<HTMLAnchorElement>('a', list)?.focus(); }
    const links = $$<HTMLAnchorElement>('a', list), i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (i > -1 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); (links[i + (e.key === 'ArrowDown' ? 1 : -1)] ?? input).focus(); }
  };
  const onDoc = (e: Event) => { if (!root.contains(e.target as Node)) close(); };
  input.addEventListener('input', onInput);
  input.addEventListener('focus', loadIndex, { once: true });
  form.addEventListener('submit', onSubmit, true);
  root.addEventListener('keydown', onKey);
  document.addEventListener('click', onDoc);
  cleanups.push(() => { input.removeEventListener('input', onInput); form.removeEventListener('submit', onSubmit, true); root.removeEventListener('keydown', onKey); document.removeEventListener('click', onDoc); });
  // Etiquetas de los artículos: /blog/?q=Guareña abre la búsqueda
  const q = new URL(location.href).searchParams.get('q');
  if (q) { input.value = q; run(); }
}

/* ───────── El año en el campo ───────── */
function initYear() {
  const root = $('[data-year]');
  if (!root) return;
  const btns = $$<HTMLButtonElement>('[data-month]', root);
  const select = (m: number, focus = false, say = false) => {
    for (const b of btns) {
      const on = Number(b.dataset.month) === m;
      b.setAttribute('aria-pressed', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    }
    for (const p of $$('[data-panel-month]', root)) p.classList.toggle('is-on', Number(p.dataset.panelMonth) === m);
    if (say) {
      const p = $(`[data-panel-month="${m}"]`, root)!;
      announce($$('.yr__card', p).map((c) => c.textContent!.replace(/\s+/g, ' ').trim()).join('. '));
    }
  };
  select(new Date().getMonth() + 1); // abre el mes actual
  const onClick = (e: Event) => { const b = (e.target as Element).closest<HTMLButtonElement>('[data-month]'); if (b) select(Number(b.dataset.month), false, true); };
  const onKey = (e: KeyboardEvent) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-month]');
    if (!b) return;
    const i = btns.indexOf(b);
    const n = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: btns.length - 1 }[e.key];
    if (n === undefined) return;
    e.preventDefault();
    select(Number(btns[(n + btns.length) % btns.length].dataset.month), true, true);
  };
  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKey);
  cleanups.push(() => { root.removeEventListener('click', onClick); root.removeEventListener('keydown', onKey); });
}

/* ───────── Índice: sección activa con IntersectionObserver ───────── */
function initToc() {
  const nav = $('[data-toc]');
  if (!nav || !('IntersectionObserver' in window)) return;
  const links = $$<HTMLAnchorElement>('[data-toc-link]', nav);
  const heads = links.map((a) => document.getElementById(a.dataset.tocLink!)).filter(Boolean) as HTMLElement[];
  const mark = () => {
    // Sección activa: el último H2 que ya ha cruzado el tercio superior de la pantalla
    const y = window.innerHeight * 0.35;
    let cur = heads[0];
    for (const h of heads) if (h.getBoundingClientRect().top <= y) cur = h;
    for (const a of links) { if (a.dataset.tocLink === cur?.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }
  };
  const io = new IntersectionObserver(() => mark(), { rootMargin: '0px 0px -60% 0px', threshold: [0, 1] });
  heads.forEach((h) => io.observe(h));
  // Un salto brusco (Inicio, enlace del índice) puede no cruzar ningún umbral: se recalcula también al hacer scroll
  let tick = false;
  const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; mark(); }); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  mark();
  cleanups.push(() => { io.disconnect(); window.removeEventListener('scroll', onScroll); });
}

/* ───────── Compartir ───────── */
const toast = (msg: string) => {
  const t = $('[data-toast]');
  if (!t) { announce(msg); return; }
  t.textContent = msg;
  clearTimeout((t as any)._h);
  (t as any)._h = setTimeout(() => { t.textContent = ''; }, 2600);
};
async function copyLink() {
  try { await navigator.clipboard.writeText(location.href); toast('Enlace copiado'); }
  catch { toast('No se ha podido copiar. Copia la dirección de la barra del navegador.'); }
}
async function nativeShare() {
  const title = document.querySelector('h1')?.textContent?.trim() ?? document.title;
  try { await navigator.share({ title, url: location.href }); } catch { /* cancelado */ }
}
export function bindShare() {
  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    if (t.closest('[data-copy-link]')) copyLink();
    else if (t.closest('[data-share]')) nativeShare();
    else if (t.closest('[data-share-any]')) ('share' in navigator ? nativeShare() : copyLink());
  });
}
function initShare() {
  if ('share' in navigator) for (const b of $$('[data-share]')) b.hidden = false;
}

/* ───────── Barra de progreso de lectura ───────── */
function initProgress() {
  const bar = $('[data-rprog]');
  if (!bar) return;
  if (CSS.supports('animation-timeline: scroll()') && !reduced()) return; // la resuelve CSS
  let tick = false;
  const update = () => {
    tick = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
  };
  const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
  cleanups.push(() => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); });
}

export function initBlog() {
  initSearch();
  initYear();
  initToc();
  initShare();
  initProgress();
}
