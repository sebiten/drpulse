import type { Locale } from './locales';
import { guideCopy } from './dr-guide-copy';

const levels = ['half', 'quarter', 'immune'] as const;
const percentages = ['50%', '25%', '0%'];
const durations = [4, 2, 0];
const pips = (count: number): string => `<span class="dr-pips" aria-hidden="true">${[0, 1, 2].map(i => `<i${i < count ? ' class="lit"' : ''}></i>`).join('')}</span>`;

export function renderDrGuide(locale: Locale): string {
  const t = guideCopy[locale];
  return `<section id="leer-dr" class="section dr-guide" aria-labelledby="dr-guide-title" data-level="half">
    <div class="dr-guide-heading"><h2 id="dr-guide-title">${t.title[0]}<br><span>${t.title[1]}</span></h2><p>${t.intro}</p></div>
    <div class="dr-guide-layout">
      <div class="dr-instrument" id="dr-preview" role="group" aria-label="${t.label}">
        <div class="dr-instrument-header"><span>DRPULSE <span>/ ${t.target}</span></span><span class="dr-signal" aria-hidden="true"></span></div>
        <div class="dr-readout">
          <div class="dr-icon"><img src="/icons/spell_holy_sealofmight.jpg" width="56" height="56" alt="" loading="lazy"><span class="dr-icon-line" aria-hidden="true"></span><span class="dr-icon-pips">${pips(1)}</span></div>
          <div class="dr-clock"><span class="dr-clock-number" aria-hidden="true">5.7<span>s</span></span><span class="dr-clock-label">${t.remaining}</span></div>
        </div>
        <div class="dr-reset-track" aria-hidden="true"><span></span></div>
        <div class="dr-duration">
          <div class="dr-duration-label"><span>${t.next}</span><strong class="dr-percentage">50%</strong></div>
          <div class="dr-duration-row"><span>${t.normal}</span><span class="dr-duration-track dr-duration-normal" aria-hidden="true"><i></i></span><b>8 s</b></div>
          <div class="dr-duration-row dr-duration-current"><span class="dr-current-label">${t.next}</span><span class="dr-duration-track" aria-hidden="true"><i></i></span><b class="dr-seconds">4 s</b></div>
          <p class="dr-example">${t.example}</p>
        </div>
        <p class="dr-preview-status" role="status">${t.descriptions[0]}</p>
        <div class="dr-animation-controls"><button type="button" class="dr-play"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z"/></svg><span>${t.play}</span></button><span class="dr-animation-note">${t.hint}</span></div>
      </div>
      <div class="dr-legend" role="group" aria-label="${t.label}">
        ${levels.map((level, i) => `<button type="button" class="dr-step" data-dr-level="${i}" data-tone="${level}" aria-pressed="${i === 0}" aria-controls="dr-preview"><span class="dr-step-heading">${pips(i + 1)}<span class="dr-step-percentage">${percentages[i]}</span><span class="dr-step-arrow" aria-hidden="true">↗</span></span><strong>${t.states[i]}</strong><span class="dr-step-body">${t.descriptions[i]}</span></button>`).join('')}
        <p class="dr-category-note">${t.category}</p>
      </div>
    </div>
    <div class="dr-timer-explainer"><span class="dr-timer-symbol" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="22" r="13"/><path d="M16 3h8M20 3v6M20 15v8l5 3M30 11l3-3"/></svg></span><div><h3>${t.timerTitle}</h3><p>${t.timerBody}</p></div></div>
  </section>`;
}

export function initDrGuide(locale: Locale): void {
  const root = document.querySelector<HTMLElement>('.dr-guide');
  if (!root) return;
  const t = guideCopy[locale];
  const select = <T extends HTMLElement>(selector: string): T => root.querySelector<T>(selector)!;
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-dr-level]'));
  const clock = select('.dr-clock-number');
  const clockLabel = select('.dr-clock-label');
  const status = select('.dr-preview-status');
  const play = select<HTMLButtonElement>('.dr-play');
  const playLabel = select('.dr-play span');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let remaining = 5.7;
  let running = false;
  let frame = 0;
  let previous = 0;

  function paintTime(): void {
    clock.innerHTML = `${remaining.toFixed(1)}<span>s</span>`;
    root!.style.setProperty('--dr-time', String(remaining / 5.7));
  }

  function stop(): void {
    running = false;
    cancelAnimationFrame(frame);
    root!.classList.remove('is-playing');
  }

  function showLevel(index: number): void {
    stop();
    selected = index;
    remaining = 5.7;
    root!.dataset.level = levels[index];
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    select('.dr-icon-pips').innerHTML = pips(index + 1);
    select('.dr-percentage').textContent = percentages[index];
    select('.dr-seconds').textContent = `${durations[index]} s`;
    root!.style.setProperty('--dr-duration', String(durations[index] / 8));
    clockLabel.textContent = t.remaining;
    status.textContent = t.descriptions[index];
    playLabel.textContent = t.play;
    paintTime();
  }

  function finish(): void {
    stop();
    remaining = 0;
    paintTime();
    root!.dataset.level = 'ready';
    select('.dr-icon-pips').innerHTML = pips(0);
    select('.dr-percentage').textContent = '100%';
    select('.dr-seconds').textContent = '8 s';
    root!.style.setProperty('--dr-duration', '1');
    clockLabel.textContent = t.ready;
    status.textContent = t.reset;
    buttons.forEach(button => button.setAttribute('aria-pressed', 'false'));
    playLabel.textContent = t.replay;
  }

  function tick(now: number): void {
    if (!running) return;
    remaining = Math.max(0, remaining - (now - previous) / 1000);
    previous = now;
    paintTime();
    if (remaining === 0) finish();
    else frame = requestAnimationFrame(tick);
  }

  function pause(): void {
    if (!running) return;
    stop();
    playLabel.textContent = t.resume;
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => showLevel(index)));
  play.addEventListener('click', () => {
    if (running) { pause(); return; }
    if (remaining === 0) showLevel(selected);
    if (motion.matches) { finish(); return; }
    running = true;
    previous = performance.now();
    root.classList.add('is-playing');
    playLabel.textContent = t.pause;
    frame = requestAnimationFrame(tick);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  motion.addEventListener('change', () => { if (motion.matches) pause(); });
  window.addEventListener('pagehide', stop);
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) root.classList.add('is-visible');
    else pause();
  }, { threshold: 0.12 });
  observer.observe(root);
  root.dataset.enhanced = 'true';
}
