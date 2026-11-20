// Formularios ficticios: validan en cliente y muestran una confirmación. NO se envía ningún dato.
import { $, $$ } from './util';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: HTMLFormElement) {
  const errors: string[] = [];
  for (const el of $$<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea', f)) {
    let msg = '';
    const label = f.querySelector(`label[for="${el.id}"]`)?.textContent?.trim() || el.name;
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      if (el.required && !el.checked) msg = 'Debes aceptar la política de privacidad.';
    } else if (el.required && !el.value.trim()) msg = `Completa el campo «${label}».`;
    else if (el instanceof HTMLInputElement && el.type === 'email' && el.value && !EMAIL.test(el.value)) msg = 'Escribe un correo electrónico válido.';
    else if (el instanceof HTMLInputElement && el.type === 'number' && el.value && (Number(el.value) < Number(el.min || 1))) msg = `«${label}» debe ser al menos ${el.min || 1}.`;
    else if (el instanceof HTMLInputElement && el.type === 'date' && el.value && el.min && el.value < el.min) msg = 'Elige una fecha a partir de hoy.';
    el.setAttribute('aria-invalid', String(!!msg));
    const err = el.id ? $(`#${el.id}-err`, f) : null;
    if (err) err.textContent = msg;
    if (msg) errors.push(msg);
  }
  return errors;
}

export function bindForms() {
  // Captura en window: se ejecuta antes que el ClientRouter de Astro, que intercepta los formularios.
  window.addEventListener('submit', (e) => {
    const f = e.target as HTMLFormElement;
    if (!f.matches('[data-fake-form]')) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const out = $('[data-form-msg]', f);
    const errors = validate(f);
    if (errors.length) {
      if (out) { out.className = 'form-msg err'; out.textContent = errors.length === 1 ? errors[0] : `Revisa ${errors.length} campos: ${errors[0]}`; }
      $<HTMLElement>('[aria-invalid="true"]', f)?.focus();
      return;
    }
    if (out) { out.className = 'form-msg ok'; out.textContent = f.dataset.ok ?? 'Enviado (simulación).'; }
    f.reset();
    $$('[aria-invalid]', f).forEach((el) => el.removeAttribute('aria-invalid'));
  }, true);
  document.addEventListener('input', (e) => {
    const el = e.target as HTMLElement;
    if (el.getAttribute('aria-invalid') === 'true') { el.removeAttribute('aria-invalid'); const err = el.id ? document.getElementById(`${el.id}-err`) : null; if (err) err.textContent = ''; }
  });
}
