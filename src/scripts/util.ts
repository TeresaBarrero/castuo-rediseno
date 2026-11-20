export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const eur = (n: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

export function announce(msg: string) {
  const el = $('[data-live]');
  if (!el) return;
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = msg; });
}

/** Elementos enfocables dentro de un contenedor (para atrapar el foco). */
export function focusables(root: HTMLElement) {
  return $$<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', root)
    .filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);
}

/** Abre un <dialog> modal. Los <dialog> nativos ya atrapan el foco y cierran con Esc. */
export function openDialog(d: HTMLDialogElement | null, opener?: Element | null) {
  if (!d || d.open) return;
  (d as any)._opener = opener ?? document.activeElement;
  d.showModal();
  document.body.classList.add('is-locked');
}
export function closeDialog(d: HTMLDialogElement | null, animated = false) {
  if (!d || !d.open) return;
  const done = () => {
    d.classList.remove('is-closing');
    d.close();
  };
  if (animated && !reduced()) {
    d.classList.add('is-closing');
    d.addEventListener('animationend', done, { once: true });
  } else done();
}
export function onDialogClosed(d: HTMLDialogElement) {
  if (!$$('dialog[open]').length) document.body.classList.remove('is-locked');
  const opener = (d as any)._opener as HTMLElement | undefined;
  if (opener && document.contains(opener)) opener.focus();
}
