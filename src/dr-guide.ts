import type { Locale } from './locales';
import { guideCopy } from './dr-guide-copy';

const levels = ['half', 'quarter', 'immune'] as const;
const percentages = ['50', '25', '0'];
const pips = (count: number): string => `<span class="dr-pips" aria-hidden="true">${[0, 1, 2].map(i => `<i${i < count ? ' class="lit"' : ''}></i>`).join('')}</span>`;

export function renderDrGuide(locale: Locale): string {
  const t = guideCopy[locale];
  return `<section id="leer-dr" class="section dr-guide" aria-labelledby="dr-guide-title">
    <div class="dr-guide-heading"><h2 id="dr-guide-title">${t.title[0]}<br><span>${t.title[1]}</span></h2><p>${t.intro}</p></div>
    <ol class="dr-legend" aria-label="${t.label}">
      ${levels.map((level, i) => `<li class="dr-step" data-tone="${level}">
        <div class="dr-step-signal">${pips(i + 1)}<span class="dr-step-index" aria-hidden="true">0${i + 1}</span></div>
        <div class="dr-step-percentage">${percentages[i]}<span>%</span></div>
        <div class="dr-step-copy"><h3>${t.states[i]}</h3><p>${t.descriptions[i]}</p></div>
      </li>`).join('')}
    </ol>
    <p class="dr-category-note">${t.category}</p>
    <div class="dr-timer-explainer">
      <span class="dr-timer-symbol" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="22" r="13"/><path d="M16 3h8M20 3v6M20 15v8l5 3M30 11l3-3"/></svg></span>
      <div class="dr-timer-copy"><h3>${t.timerTitle}</h3><p>${t.timerBody}</p></div>
      <div class="dr-reset-summary"><span class="dr-reset-values">0<span>s</span><svg viewBox="0 0 32 16" fill="none" aria-hidden="true"><path d="M1 8h28M23 2l6 6-6 6"/></svg>100<span>%</span></span><span>${t.ready}</span></div>
    </div>
  </section>`;
}

export function initDrGuide(): void {
  const root = document.querySelector<HTMLElement>('.dr-guide');
  if (!root || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    root.classList.add('is-visible');
    observer.disconnect();
  }, { threshold: 0.12 });
  observer.observe(root);
}
