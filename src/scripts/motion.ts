// Animaciones contenidas. Todas respetan prefers-reduced-motion (sin movimiento; solo opacidad instantánea).
import { $, $$, reduced } from './util';

const observers: IntersectionObserver[] = [];
let rafScroll: (() => void)[] = [];
let scrollBound = false;

export function cleanupMotion() {
  observers.splice(0).forEach((o) => o.disconnect());
  rafScroll = [];
}

function onScrollFrame() {
  let tick = false;
  const run = () => { tick = false; rafScroll.forEach((f) => f()); };
  window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(run), { passive: true });
}

/* 1 · Entrada del hero: H1 por líneas, después texto y botones, foto con escala y recorte */
export function heroIntro() {
  const h = $('[data-hero-title]');
  if (!h || h.dataset.split) return;
  const root = h.closest<HTMLElement>('[data-hero]');
  if (reduced()) { root?.classList.add('is-ready', 'is-in'); return; }
  const text = h.textContent!.trim().replace(/\s+/g, ' ');
  h.setAttribute('aria-label', text);
  const words = text.split(' ');
  h.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  // Agrupa palabras por línea según su posición
  const lines: string[][] = [];
  let top = -1;
  for (const w of $$('.w', h)) {
    if (Math.abs(w.offsetTop - top) > 4) { lines.push([]); top = w.offsetTop; }
    lines[lines.length - 1].push(w.textContent!);
  }
  h.innerHTML = lines.map((l, i) => `<span class="line" aria-hidden="true"><span class="line__in" style="--i:${i}">${l.join(' ')}</span></span>`).join('');
  h.dataset.split = '1';
  root?.style.setProperty('--lines', String(lines.length));
  root?.classList.add('is-ready');
  requestAnimationFrame(() => requestAnimationFrame(() => root?.classList.add('is-in')));
}

/* 2 · Revelado al hacer scroll, escalonado dentro de cada grupo */
export function reveal() {
  const els = $$('[data-reveal]:not(.is-in)');
  if (!els.length) return;
  for (const g of $$('[data-reveal-group]')) {
    $$(':scope > [data-reveal], :scope > * > [data-reveal]', g).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 8) * 80}ms`));
  }
  if (reduced() || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
  observers.push(io);
}

/* 3 · Contadores de la franja de cifras */
function fmt(n: number, el: HTMLElement) {
  const dec = Number(el.dataset.decimals ?? 0);
  const group = el.dataset.group !== 'false';
  let s: string;
  try {
    s = new Intl.NumberFormat('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: (group ? 'always' : false) as any }).format(n);
  } catch {
    s = n.toFixed(dec).replace('.', ',');
    if (group) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  return `${el.dataset.prefix ?? ''}${s}${el.dataset.suffix ?? ''}`;
}
export function counters() {
  const els = $$('[data-count]');
  if (!els.length) return;
  const final = (el: HTMLElement) => { el.textContent = fmt(Number(el.dataset.count), el); };
  if (reduced()) { els.forEach(final); return; }
  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.count);
    const t0 = performance.now(), dur = 1200;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3); // ease-out
      const dec = Number(el.dataset.decimals ?? 0);
      el.textContent = fmt(Number((to * e).toFixed(dec)), el);
      if (p < 1) requestAnimationFrame(step); else final(el);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); }
  }, { threshold: 0.5 });
  els.forEach((el) => { el.textContent = fmt(0, el); io.observe(el); });
  observers.push(io);
}

/* 4 · Parallax suave (máx. 40 px). CSS scroll-driven si existe; si no, rAF. */
export function parallax() {
  const els = $$('[data-parallax]');
  if (!els.length || reduced()) return;
  if (CSS.supports('animation-timeline: view()')) return; // lo resuelve CSS
  const vh = () => window.innerHeight;
  rafScroll.push(() => {
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh()) continue;
      const p = (r.top + r.height / 2 - vh() / 2) / (vh() / 2 + r.height / 2); // -1..1
      const img = el.querySelector<HTMLElement>('img');
      if (img) img.style.transform = `translate3d(0, ${(-p * 20).toFixed(1)}px, 0) scale(1.1)`;
    }
  });
}

/* 12 · Línea de tiempo: la línea oliva se dibuja con el scroll y cada hito se ilumina al cruzarla */
export function timeline() {
  const tl = $('[data-timeline]');
  if (!tl) return;
  const items = $$('[data-tl-item]', tl);
  if (reduced()) { tl.style.setProperty('--p', '1'); items.forEach((i) => i.classList.add('is-lit')); return; }
  rafScroll.push(() => {
    const r = tl.getBoundingClientRect();
    const mark = window.innerHeight * 0.6;
    const p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
    tl.style.setProperty('--p', p.toFixed(4));
    const y = r.top + p * r.height;
    for (const it of items) {
      const dot = it.getBoundingClientRect().top + 28;
      it.classList.toggle('is-lit', dot <= y + 1);
    }
  });
}

/* 13 · Trazabilidad: los pasos se activan en secuencia */
export function trace() {
  const el = $('[data-trace]');
  if (!el) return;
  if (reduced()) { el.classList.add('is-on'); return; }
  const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { el.classList.add('is-on'); io.disconnect(); } }, { threshold: 0.35 });
  io.observe(el);
  observers.push(io);
}

/* 10 · Acordeones con aria-expanded (la altura se anima en CSS con grid-template-rows) */
export function bindAccordions() {
  document.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-acc-btn]');
    if (!b) return;
    const open = b.getAttribute('aria-expanded') !== 'true';
    const group = b.closest('[data-acc-group]');
    if (open && group?.hasAttribute('data-single')) {
      for (const o of $$<HTMLButtonElement>('[data-acc-btn][aria-expanded="true"]', group)) if (o !== b) o.setAttribute('aria-expanded', 'false');
    }
    b.setAttribute('aria-expanded', String(open));
  });
}

export function initMotion() {
  if (!scrollBound) { onScrollFrame(); scrollBound = true; }
  heroIntro();
  reveal();
  counters();
  parallax();
  timeline();
  trace();
  requestAnimationFrame(() => rafScroll.forEach((f) => f()));
}
