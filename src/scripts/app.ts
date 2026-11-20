// Punto de entrada. La delegación de eventos se registra una sola vez;
// lo que depende del DOM de cada página se reinicia en cada `astro:page-load` (View Transitions).
import { bindCart, render as renderCart } from './cart';
import { bindHeader, initHeader } from './header';
import { bindAccordions, cleanupMotion, initMotion } from './motion';
import { initFilters } from './filters';
import { bindLightbox, initProduct } from './product';
import { bindForms } from './forms';
import { bindTabs, initTabs } from './tabs';
import { $$ } from './util';

bindCart();
bindHeader();
bindAccordions();
bindLightbox();
bindForms();
bindTabs();

// Selección de visita (tarjetas → select del formulario)
document.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLElement>('[data-pick-visit]');
  if (!b) return;
  const v = b.dataset.pickVisit!;
  for (const x of $$<HTMLElement>('[data-pick-visit]')) {
    const on = x.dataset.pickVisit === v;
    x.setAttribute('aria-pressed', String(on));
    x.textContent = on ? 'Seleccionada' : 'Elegir esta visita';
    x.closest('article')?.classList.toggle('is-on', on);
  }
  const sel = document.getElementById('v-exp') as HTMLSelectElement | null;
  if (sel) sel.value = v;
});

document.addEventListener('astro:before-swap', cleanupMotion);
document.addEventListener('astro:after-swap', () => document.documentElement.classList.add('js'));
document.addEventListener('astro:page-load', () => {
  document.documentElement.classList.add('js');
  document.body.classList.remove('is-locked');
  initHeader();
  renderCart();
  initMotion();
  initFilters();
  initProduct();
  initTabs();
  const min = new Date().toISOString().slice(0, 10);
  for (const d of $$<HTMLInputElement>('input[type=date][data-min-today]')) d.min = min;
});
