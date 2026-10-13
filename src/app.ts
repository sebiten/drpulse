import { languages, translations, type Locale } from './locales';

const CF = 'https://legacy.curseforge.com/wow/addons/drpulse';
const commandValues = ['/drift', '/drift unlock', '/drift lock', '/drift preview', '/drift history', '/drift add <spellID> <category>', '/drift remove <spellID>', '/drift reset'];
const escape = (text: string): string => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const get = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};
const isLocale = (value: string | null): value is Locale => value !== null && Object.hasOwn(languages, value);
let locale: Locale = 'en';
try { const saved = localStorage.getItem('drpulse-language'); if (isLocale(saved)) locale = saved; } catch { /* Selection works even when storage is unavailable. */ }
let category = 0;
let stage = 0;
let query = '';
let toastTimer: ReturnType<typeof setTimeout>;
const splitTitle = (parts: [string, string]): string => `${escape(parts[0])}<br><span>${escape(parts[1])}</span>`;
const cfLink = (label: string, className = 'button'): string => `<a class="${className}" href="${CF}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span></a>`;
// asdas
function render(): void {
  const t = translations[locale];
  document.documentElement.lang = locale;
  document.title = t.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = t.description;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = t.title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = t.description;
  get('#app').innerHTML = `
    <a class="skip-link" href="#contenido">${escape(t.skip)}</a>
    <div class="launcher-shell">
    <header class="site-header">
      <a class="brand" href="#" aria-label="DRPulse"><img src="/drpulse-emblem.png" alt="" width="44" height="44"><span>DR<span class="brand-light">PULSE</span></span></a>
      <nav id="navigation" aria-label="${escape(t.menu)}">${['funciones', 'demo', 'instalacion', 'comandos'].map((id, i) => `<a href="#${id}">${escape(t.nav[i])}</a>`).join('')}</nav>
      <div class="header-controls"><label class="language-control"><span>${escape(t.language)}</span><select id="language" aria-label="${escape(t.language)}">${Object.entries(languages).map(([key, name]) => `<option value="${key}" lang="${key}" ${key === locale ? 'selected' : ''}>${name}</option>`).join('')}</select></label><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">${escape(t.menu)} <span aria-hidden="true">☰</span></button></div>
    </header>
    <main id="contenido">
      <section class="hero" aria-labelledby="hero-title"><div class="hero-art" aria-hidden="true"></div><span class="frame-corner tl" aria-hidden="true"></span><span class="frame-corner tr" aria-hidden="true"></span><span class="frame-corner bl" aria-hidden="true"></span><span class="frame-corner br" aria-hidden="true"></span>
        <div class="hero-content"><p class="eyebrow">${escape(t.kicker)}</p><h1 id="hero-title">${splitTitle(t.hero)}</h1><p class="hero-description">${escape(t.intro)}</p><div class="hero-actions">${cfLink(t.visit)}<a class="text-link" href="#demo"><span class="play" aria-hidden="true">▷</span>${escape(t.explore)}</a></div></div>
        <div class="hero-emblem"><img src="/drpulse-emblem.png" alt="DRPulse" width="1254" height="1254" fetchpriority="high"></div>
        <div class="hero-bottom"><span>WORLD OF WARCRAFT: FOREVER</span><span>${escape(t.arena)}</span></div>
      </section>
      <div class="facts">${t.facts.map((label, i) => `<div><strong>${['08', '03', '00'][i]}</strong><span>${escape(label)}</span></div>`).join('')}<div class="fact-statement">${escape(t.motto)}</div></div>
      <section id="funciones" class="section features"><div class="section-heading"><h2>${splitTitle(t.features)}</h2><p>${escape(t.featuresIntro)}</p></div><div class="feature-layout"><article class="feature-primary"><span class="feature-symbol" aria-hidden="true">⌖</span><h3>${escape(t.featureTitles[0])}</h3><p>${escape(t.featureBodies[0])}</p><div class="tracking-points">${t.tracking.map(label => `<span>${escape(label)}</span>`).join('')}</div><div class="feature-watermark" aria-hidden="true">DR</div></article><div class="feature-secondary">${[1, 2].map(i => `<article class="enamel-plate"><h3>${escape(t.featureTitles[i])}</h3><p>${escape(t.featureBodies[i])}</p></article>`).join('')}</div></div></section>
      <section id="demo" class="section demo-section"><div class="demo-intro"><h2>${splitTitle(t.demoTitle)}</h2><p>${escape(t.demoIntro)}</p><p class="demo-disclaimer">${escape(t.disclaimer)}</p><div class="confidence"><span class="confidence-native">${escape(t.native)}</span><span class="confidence-estimated">${escape(t.estimated)}</span></div><p class="confidence-copy">${escape(t.confidence)}</p></div><div class="demo-panel"><div class="demo-panel-top"><span>${escape(t.lab)}</span><span>${escape(t.interactive)}</span></div><div class="category-tabs" role="group" aria-label="${escape(t.facts[0])}">${t.categories.map((name, i) => `<button data-category="${i}" aria-pressed="${i === category}">${escape(name)}</button>`).join('')}</div><div class="dr-display" aria-live="polite" aria-atomic="true"><div class="dr-ring"><div><span id="dr-value"></span><small>${escape(t.next)}</small></div></div><div class="dr-caption"><span id="category-label"></span><strong id="dr-status"></strong></div></div><div class="dr-stages"><span>100%</span><span>50%</span><span>25%</span><span>${escape(t.immune)}</span></div><div class="demo-controls"><button class="button" id="apply-cc"></button><button class="reset-button" id="reset-cc">↺ ${escape(t.reset)}</button></div></div></section>
      <section class="trust-section"><div class="trust-title"><span aria-hidden="true">◈</span><h2>${escape(t.trustTitle)}</h2></div><div><p>${escape(t.trustBody)}</p><p class="muted">${escape(t.trustNote)}</p></div></section>
      <section id="instalacion" class="section installation"><div class="install-heading"><h2>${splitTitle(t.installTitle)}</h2><p>${escape(t.installIntro)}</p>${cfLink(t.visit, 'text-link')}<div class="compatibility enamel-plate"><span>${escape(t.compatibility)}</span><strong>WoW: Forever</strong><p>${escape(t.version)}</p></div></div><div class="setup-ledger enamel-plate"><div class="panel-rail"><span>${escape(t.nav[2])}</span></div><div class="steps">${t.steps.map((title, i) => `<article><span class="step-number">0${i + 1}</span><div><h3>${escape(title)}</h3><p>${escape(t.stepBodies[i])}</p>${i === 0 ? `<p class="release-note">${escape(t.release)}</p>` : i === 1 ? `<div class="copy-field"><code>_classic_beta_/Interface/AddOns/</code><button data-copy="_classic_beta_/Interface/AddOns/" aria-label="${escape(t.copy)} _classic_beta_/Interface/AddOns/">${escape(t.copy)}</button></div>` : ''}</div></article>`).join('')}</div></div></section>
      <section id="comandos" class="section commands"><div class="section-heading"><h2>${splitTitle(t.commandsTitle)}</h2><p>${escape(t.commandsIntro)}</p></div><div class="console-panel enamel-plate"><div class="panel-rail"><span>${escape(t.nav[3])}</span><span id="command-count" aria-live="polite"></span></div><div class="command-toolbar"><label for="command-search">${escape(t.search)}</label><input id="command-search" type="search" value="${escape(query)}" placeholder="${escape(t.placeholder)}" autocomplete="off"></div><div class="command-list">${commandValues.map((command, i) => `<article class="command-row"><div><code>${escape(command)}</code><p>${escape(t.commandDescriptions[i])}</p></div><button data-copy="${escape(command)}" aria-label="${escape(t.copy)} ${escape(command)}">${escape(t.copy)}</button></article>`).join('')}</div><p id="command-empty" hidden>${escape(t.empty)}</p></div><p class="command-hint">${escape(t.hint)}</p></section>
      <section id="preguntas" class="section faq"><h2>${escape(t.faqTitle)}</h2><div class="faq-items enamel-plate">${t.faq.map(([question, answer], i) => `<details><summary>${escape(question)}<span aria-hidden="true">+</span></summary><p>${escape(answer)}${i === 5 ? ` <a href="${CF}#comments" target="_blank" rel="noopener noreferrer">CurseForge ↗</a>` : ''}</p></details>`).join('')}</div></section>
      <section class="support"><img src="/drpulse-emblem.png" alt="" width="100" height="100" loading="lazy"><div><h2>${escape(t.supportTitle)}</h2><p>${escape(t.supportBody)}</p></div><a class="button button-outline" href="https://paypal.me/sebiten" target="_blank" rel="noopener noreferrer">${escape(t.support)} <span aria-hidden="true">↗</span></a></section>
    </main><footer><a class="brand" href="#"><span>DR<span class="brand-light">PULSE</span></span></a><p>${escape(t.motto)}</p><div><a href="${CF}" target="_blank" rel="noopener noreferrer">CurseForge ↗</a><a href="#preguntas">${escape(t.help)}</a><a href="#instalacion">${escape(t.nav[2])}</a></div><small>${escape(t.legal)}</small></footer><div class="window-status"><span>DRPulse</span><span>WoW: Forever 1.60.1</span><span>Interface 16001</span></div></div><div class="toast" role="status" aria-live="polite"></div>`;
  renderDemo();
  filterCommands();
}
function renderDemo(): void {
  const t = translations[locale];
  get('#dr-value').innerHTML = stage === 3 ? escape(t.immune) : `${[100, 50, 25][stage]}<span>%</span>`;
  get('#dr-value').classList.toggle('immune', stage === 3);
  get('#category-label').textContent = t.categories[category];
  get('#dr-status').textContent = t.states[stage];
  get('.dr-ring').style.setProperty('--arc', `${[100, 50, 25, 0][stage]}%`);
  document.querySelectorAll('.dr-stages span').forEach((element, i) => element.classList.toggle('active', i === stage));
  document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === category)));
  const apply = get<HTMLButtonElement>('#apply-cc');
  apply.disabled = stage === 3;
  apply.textContent = stage === 3 ? t.immune : `${t.apply} ↗`;
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
  locale = event.target.value;
  try { localStorage.setItem('drpulse-language', locale); } catch { /* Current selection still works without storage. */ }
  clearTimeout(toastTimer);
  render();
  get('#language').focus({ preventScroll: true });
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
  const categoryButton = target.closest<HTMLButtonElement>('[data-category]');
  if (categoryButton) { category = Number(categoryButton.dataset.category); stage = 0; renderDemo(); }
  if (target.closest('#apply-cc')) { stage = Math.min(stage + 1, 3); renderDemo(); }
  if (target.closest('#reset-cc')) { stage = 0; renderDemo(); }
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
