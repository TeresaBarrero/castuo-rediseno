// Pestañas accesibles (role=tablist): flechas, Inicio/Fin, sincronizadas con el #hash.
import { $, $$ } from './util';

function select(root: HTMLElement, id: string, focus = false) {
  const tabs = $$<HTMLButtonElement>('[data-tab]', root);
  if (!tabs.some((t) => t.dataset.tab === id)) return;
  for (const t of tabs) {
    const on = t.dataset.tab === id;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  }
  for (const p of $$<HTMLElement>('[data-panel]', root)) p.hidden = p.dataset.panel !== id;
}

export function bindTabs() {
  document.addEventListener('click', (e) => {
    const t = (e.target as Element).closest<HTMLButtonElement>('[data-tab]');
    if (!t) return;
    const root = t.closest<HTMLElement>('[data-tabs]')!;
    select(root, t.dataset.tab!);
    history.replaceState(history.state, '', `#${t.dataset.tab}`);
  });
  document.addEventListener('keydown', (e) => {
    const t = (e.target as Element).closest?.<HTMLButtonElement>('[data-tab]');
    if (!t) return;
    const root = t.closest<HTMLElement>('[data-tabs]')!;
    const tabs = $$<HTMLButtonElement>('[data-tab]', root);
    const i = tabs.indexOf(t);
    let n = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault();
    select(root, tabs[n].dataset.tab!, true);
    history.replaceState(history.state, '', `#${tabs[n].dataset.tab}`);
  });
}

export function initTabs() {
  for (const root of $$<HTMLElement>('[data-tabs]')) {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h) select(root, h);
  }
}
