import { languages, translations, type Locale } from './locales';
import { renderPage, commandValues, icon } from './page';
import { seo, localePath } from './seo';
import { initDrGuide } from './dr-guide';

const get = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};
const isLocale = (value: string | null): value is Locale => value !== null && Object.hasOwn(languages, value);
const pathLocale = window.location.pathname.split('/')[1];
const locale: Locale = isLocale(pathLocale) ? pathLocale : 'en';
let query = '';
let toastTimer: ReturnType<typeof setTimeout>;
function render(): void {
  document.documentElement.lang = locale;
  document.title = seo[locale].title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = seo[locale].description;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = seo[locale].title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = seo[locale].description;
  if (!get('#app').hasChildNodes()) get('#app').innerHTML = renderPage(locale, query);
  filterCommands();
  document.querySelectorAll<HTMLElement>('.feature-secondary article').forEach((article, i) => article.insertAdjacentHTML('afterbegin', `<div class="feature-spells" aria-hidden="true">${icon(i === 0 ? 0 : 3)}${icon(i === 0 ? 1 : 4)}${icon(i === 0 ? 2 : 5)}</div>`));
}
const normalize = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function filterCommands(): void {
  const t = translations[locale];
  let count = 0;
  document.querySelectorAll<HTMLElement>('.command-row').forEach((row, i) => {
    const match = normalize(`${commandValues[i]} ${t.commandDescriptions[i]}`).includes(normalize(query.trim()));
    row.hidden = !match;
    if (match) count++;
  });
  get('#command-count').textContent = `${count} ${t.count[count === 1 ? 0 : 1]}`;
  get('#command-empty').hidden = count !== 0;
}
function closeMenu(): void {
  get('.menu-toggle').setAttribute('aria-expanded', 'false');
  get('#navigation').classList.remove('open');
}
document.addEventListener('change', event => {
  if (!(event.target instanceof HTMLSelectElement) || event.target.id !== 'language' || !isLocale(event.target.value)) return;
  window.location.assign(localePath(event.target.value) + window.location.hash);
});
document.addEventListener('input', event => {
  if (event.target instanceof HTMLInputElement && event.target.id === 'command-search') { query = event.target.value; filterCommands(); }
});
document.addEventListener('click', async event => {
  if (!(event.target instanceof Element)) return;
  const target = event.target;
  if (target.closest('.menu-toggle')) {
    const button = get('.menu-toggle');
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    get('#navigation').classList.toggle('open', open);
  }
  if (target.closest('#navigation a')) closeMenu();
  const copyButton = target.closest<HTMLButtonElement>('[data-copy]');
  if (copyButton?.dataset.copy) {
    let success = true;
    try { await navigator.clipboard.writeText(copyButton.dataset.copy); } catch { success = false; }
    const toast = get('.toast');
    toast.textContent = success ? translations[locale].copied : translations[locale].copyError;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && get('.menu-toggle').getAttribute('aria-expanded') === 'true') { closeMenu(); get('.menu-toggle').focus(); }
});
render();
initDrGuide();

