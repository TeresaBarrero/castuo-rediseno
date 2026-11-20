// Cabecera: oculta la barra de servicio, se fija con desenfoque, se esconde al bajar y reaparece al subir.
// Menú móvil a pantalla completa con foco atrapado y Esc. Buscador en <dialog>.
import { $, $$, focusables, openDialog, closeDialog, reduced } from './util';

let lastY = 0;
let ticking = false;
let scrollBound = false;

function measure() {
  const h = $('[data-header]');
  const svc = $('[data-svc]');
  if (!h || !svc) return;
  h.style.setProperty('--svc-h', `${svc.offsetHeight}px`);
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const h = $('[data-header]');
    const svc = $('[data-svc]');
    if (!h) return;
    const y = window.scrollY;
    const sh = svc?.offsetHeight ?? 0;
    h.classList.toggle('is-scrolled', y > sh);
    const top = $('[data-totop]');
    if (top) {
      const on = y > window.innerHeight * 0.8;
      top.classList.toggle('is-on', on);
      top.tabIndex = on ? 0 : -1;
      top.setAttribute('aria-hidden', String(!on));
    }
    const menuOpen = !!$('[data-menu]:not([hidden])');
    const anyDialog = !!$('dialog[open]');
    if (!menuOpen && !anyDialog) {
      if (y > lastY + 4 && y > 240) h.classList.add('is-hidden');
      else if (y < lastY - 4 || y <= 240) h.classList.remove('is-hidden');
    }
    lastY = y;
  });
}

/* ───── Menú móvil ───── */
let menuOpener: HTMLElement | null = null;
function openMenu(btn: HTMLElement) {
  const m = $('[data-menu]');
  if (!m) return;
  menuOpener = btn;
  m.hidden = false;
  m.classList.remove('is-closing');
  m.classList.add('is-open');
  btn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('is-locked');
  $('[data-menu-close]', m)?.focus();
}
function closeMenu(restore = true) {
  const m = $('[data-menu]');
  if (!m || m.hidden) return;
  const finish = () => {
    m.hidden = true;
    m.classList.remove('is-open', 'is-closing');
    document.body.classList.remove('is-locked');
  };
  $('[data-menu-open]')?.setAttribute('aria-expanded', 'false');
  if (reduced()) finish();
  else { m.classList.add('is-closing'); m.addEventListener('animationend', finish, { once: true }); setTimeout(finish, 400); }
  if (restore) (menuOpener ?? $('[data-menu-open]'))?.focus();
}

/* ───── Buscador ───── */
interface Doc { t: string; u: string; c: string; k: string }
let index: Doc[] | null = null;
async function loadIndex() {
  if (index) return index;
  try { index = await (await fetch('/search.json')).json(); } catch { index = []; }
  return index!;
}
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export async function runSearch(q: string, list: HTMLElement, status?: HTMLElement | null) {
  const docs = await loadIndex();
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) { list.innerHTML = ''; if (status) status.textContent = ''; return; }
  const hits = docs.filter((d) => { const h = norm(`${d.t} ${d.k} ${d.c}`); return terms.every((t) => h.includes(t)); }).slice(0, 12);
  list.innerHTML = hits.length
    ? hits.map((d) => `<li><a href="${d.u}"><small>${d.c}</small><span>${d.t}</span></a></li>`).join('')
    : `<li class="none">Sin resultados para «${q.replace(/</g, '&lt;')}».</li>`;
  if (status) status.textContent = `${hits.length} resultados`;
}

export function bindHeader() {
  if (!scrollBound) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    scrollBound = true;
  }
  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    const ob = t.closest<HTMLElement>('[data-menu-open]');
    if (ob) { openMenu(ob); return; }
    if (t.closest('[data-menu-close]')) { closeMenu(); return; }
    if (t.closest('[data-menu] a')) { closeMenu(false); return; }
    const so = t.closest('[data-search-open]');
    if (so) {
      const d = $<HTMLDialogElement>('[data-search]');
      openDialog(d, so);
      loadIndex();
      $<HTMLInputElement>('[data-search-input]')?.focus();
      return;
    }
    if (t.closest('[data-search-close]')) { closeDialog($<HTMLDialogElement>('[data-search]')); return; }
    if (t.closest('[data-totop]')) {
      window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
      // Devuelve el foco al principio de la página (el logo de la cabecera)
      $<HTMLElement>('.brand')?.focus({ preventScroll: true });
      return;
    }
  });
  document.addEventListener('keydown', (e) => {
    const m = $('[data-menu]');
    if (!m || m.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key === 'Tab') {
      const f = focusables(m);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('input', (e) => {
    const i = e.target as HTMLInputElement;
    if (i.matches('[data-search-input]')) runSearch(i.value, $('[data-search-results]')!, $('[data-search-status]'));
  });
  window.addEventListener('submit', (e) => {
    const f = e.target as HTMLFormElement;
    if (f.matches('[data-search-form]')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const first = $<HTMLAnchorElement>('[data-search-results] a');
      if (first) { closeDialog($<HTMLDialogElement>('[data-search]')); first.click(); }
    }
  }, true);
}

export function initHeader() {
  measure();
  lastY = window.scrollY;
  $('[data-header]')?.classList.remove('is-hidden');
  onScroll();
  closeMenu(false);
  for (const d of $$<HTMLDialogElement>('dialog')) d.addEventListener('close', () => {
    if (!$$('dialog[open]').length) document.body.classList.remove('is-locked');
    const op = (d as any)._opener as HTMLElement | undefined;
    if (op && document.contains(op)) op.focus();
  });
}
