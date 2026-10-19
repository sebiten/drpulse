import { languages, translations, type Locale } from './locales';
import { seo, localePath } from './seo';
import { renderDrGuide } from './dr-guide';
import { renderGallery } from './gallery';
const CF = 'https://curseforge.com/wow/addons/drpulse';
const SHARDOT = 'https://www.curseforge.com/wow/addons/shardot-soul-shards-combo-points';
const browsingCopy: Record<Locale, { guide: string; screenshots: string; enlarge: string; support: string }> = {
  en: { guide: 'DR guide', screenshots: 'See it in game', enlarge: 'Select a screenshot to take a closer look.', support: 'Support DRPulse' },
  es: { guide: 'Guía de DR', screenshots: 'Ver en el juego', enlarge: 'Selecciona una captura para verla en detalle.', support: 'Apoyar DRPulse' },
  de: { guide: 'DR-Guide', screenshots: 'Im Spiel ansehen', enlarge: 'Wähle einen Screenshot, um ihn genauer anzusehen.', support: 'DRPulse unterstützen' },
  fr: { guide: 'Guide DR', screenshots: 'Voir en jeu', enlarge: 'Sélectionnez une capture pour la voir en détail.', support: 'Soutenir DRPulse' },
  pt: { guide: 'Guia de DR', screenshots: 'Ver no jogo', enlarge: 'Selecione uma captura para ver os detalhes.', support: 'Apoiar DRPulse' },
};
const shardotCopy: Record<Locale, { eyebrow: string; title: [string, string]; body: string; action: string; resources: [string, string, string]; alts: [string, string] }> = {
  en: { eyebrow: 'ANOTHER ADDON BY THE SAME AUTHOR', title: ['Meet Shardot.', 'Resources at a glance.'], body: 'A compact display for combo points and soul shards. Keep the resource that drives your next move visible without covering the fight.', action: 'View Shardot on CurseForge', resources: ['Combo points', 'Soul shards', 'Minimal HUD'], alts: ['Shardot showing combo points beneath the character', 'Shardot showing a soul shard counter near the character'] },
  es: { eyebrow: 'OTRO ADDON DEL MISMO AUTOR', title: ['Conocé Shardot.', 'Recursos de un vistazo.'], body: 'Una visualización compacta para puntos de combo y fragmentos de alma. Mantené visible el recurso que define tu próximo movimiento sin tapar el combate.', action: 'Ver Shardot en CurseForge', resources: ['Puntos de combo', 'Fragmentos de alma', 'Interfaz mínima'], alts: ['Shardot mostrando puntos de combo debajo del personaje', 'Shardot mostrando un contador de fragmentos de alma junto al personaje'] },
  de: { eyebrow: 'EIN WEITERES ADDON VOM SELBEN AUTOR', title: ['Entdecke Shardot.', 'Ressourcen auf einen Blick.'], body: 'Eine kompakte Anzeige für Combopunkte und Seelensplitter. Behalte die Ressource für deinen nächsten Zug im Blick, ohne den Kampf zu verdecken.', action: 'Shardot auf CurseForge ansehen', resources: ['Combopunkte', 'Seelensplitter', 'Minimales HUD'], alts: ['Shardot zeigt Combopunkte unter dem Charakter', 'Shardot zeigt einen Seelensplitterzähler neben dem Charakter'] },
  fr: { eyebrow: 'UN AUTRE ADDON DU MÊME AUTEUR', title: ['Découvrez Shardot.', 'Vos ressources en un regard.'], body: 'Un affichage compact pour les points de combo et les fragments d’âme. Gardez la ressource de votre prochaine action visible sans masquer le combat.', action: 'Voir Shardot sur CurseForge', resources: ['Points de combo', 'Fragments d’âme', 'Interface minimale'], alts: ['Shardot affiche les points de combo sous le personnage', 'Shardot affiche un compteur de fragments d’âme près du personnage'] },
  pt: { eyebrow: 'OUTRO ADDON DO MESMO AUTOR', title: ['Conheça o Shardot.', 'Recursos de relance.'], body: 'Uma exibição compacta para pontos de combo e fragmentos de alma. Mantenha visível o recurso da sua próxima ação sem cobrir o combate.', action: 'Ver Shardot no CurseForge', resources: ['Pontos de combo', 'Fragmentos de alma', 'Interface mínima'], alts: ['Shardot mostrando pontos de combo abaixo do personagem', 'Shardot mostrando um contador de fragmentos de alma próximo ao personagem'] },
};
export const commandValues = ['/drpulse', '/drpulse unlock', '/drpulse lock', '/drpulse preview', '/drpulse history', '/drpulse add <spellID> <category>', '/drpulse remove <spellID>', '/drpulse reset'];
const escape = (text: string): string => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const splitTitle = (parts: [string, string]): string => `${escape(parts[0])}<br><span>${escape(parts[1])}</span>`;
const cfLink = (label: string, className = 'button'): string => `<a class="${className}" href="${CF}" target="_blank" rel="noopener noreferrer">${escape(label)} <span aria-hidden="true">↗</span></a>`;
const spellIcons = ['spell_holy_sealofmight', 'spell_nature_polymorph', 'spell_shadow_possession', 'spell_frost_frostnova', 'spell_shadow_impphaseshift', 'ability_warrior_disarm', 'ability_warrior_challange', 'spell_shaman_thunderstorm'];
const screenshots = [
  { src: '/screenshots/drpulse-v2-appearance.png', width: 757, height: 618 },
  { src: '/screenshots/drpulse-v2-general.png', width: 763, height: 621 },
  { src: '/screenshots/drpulse-v2-target-preview.png', width: 324, height: 178 },
  { src: '/screenshots/drpulse-nameplate-reset.png', width: 369, height: 193 },
] as const;
export const icon = (index: number, className = 'spell-icon'): string => `<img class="${className}" src="/icons/${spellIcons[index]}.jpg" alt="" width="56" height="56" loading="lazy">`;

export function renderPage(locale: Locale, query = ''): string {
  const t = translations[locale];
  const browsing = browsingCopy[locale];
  const shardot = shardotCopy[locale];
  return `
    <a class="skip-link" href="#contenido">${escape(t.skip)}</a>
    <div class="launcher-shell">
    <header class="site-header">
      <a class="brand" href="#" aria-label="DRPulse"><img src="/drpulse-emblem-96.webp" alt="" width="44" height="44" decoding="async"><span>DR<span class="brand-light">PULSE</span></span></a>
      <nav id="navigation" aria-label="${escape(t.menu)}">${[['funciones', t.nav[0]], ['leer-dr', browsing.guide], ['capturas', t.nav[1]], ['comandos', t.nav[2]], ['preguntas', t.help], ['apoyar', browsing.support]].map(([id, label]) => `<a href="#${id}">${escape(label)}</a>`).join('')}</nav>
      <div class="header-controls"><label class="language-control"><span>${escape(t.language)}</span><select id="language" aria-label="${escape(t.language)}">${Object.entries(languages).map(([key, name]) => `<option value="${key}" lang="${key}" ${key === locale ? 'selected' : ''}>${name}</option>`).join('')}</select></label><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">${escape(t.menu)} <span aria-hidden="true">☰</span></button></div>
    </header>
    <main id="contenido">
      <section class="hero" aria-labelledby="hero-title"><div class="hero-art" aria-hidden="true"></div>
        <div class="hero-content"><p class="eyebrow">${escape(t.kicker)}</p><h1 id="hero-title">${splitTitle(t.hero)}</h1><p class="hero-description">${escape(t.intro)}</p><div class="hero-actions">${cfLink(t.visit)}<a class="text-link" href="#capturas">${escape(browsing.screenshots)} <span aria-hidden="true">↓</span></a></div></div>
        <div class="hero-emblem"><img src="/drpulse-emblem-320.webp" srcset="/drpulse-emblem-320.webp 320w, /drpulse-emblem-512.webp 512w" sizes="(max-width: 700px) 200px, (max-width: 1100px) 28vw, 320px" alt="DRPulse" width="320" height="320" decoding="async"></div>

        <div class="hero-bottom"><span>WORLD OF WARCRAFT: FOREVER</span><span>${escape(t.arena)}</span></div>
      </section>
      <div class="facts">${t.facts.map((label, i) => `<div><strong>${['8', '3', '0'][i]}</strong><span>${escape(label)}</span></div>`).join('')}<div class="fact-statement">${escape(t.motto)}</div></div>
      <section id="diminish-alternative" class="section alternative"><h2>${escape(seo[locale].heading)}</h2><div class="alternative-copy"><p>${escape(seo[locale].body)}</p><p>${escape(seo[locale].detail)}</p><p class="muted">${escape(seo[locale].note)}</p></div></section>
      <section id="funciones" class="section features"><div class="section-heading"><h2>${splitTitle(t.features)}</h2><p>${escape(t.featuresIntro)}</p></div><div class="feature-layout"><article class="feature-primary"><span class="feature-symbol" aria-hidden="true">⌖</span><h3>${escape(t.featureTitles[0])}</h3><p>${escape(t.featureBodies[0])}</p><div class="tracking-points">${t.tracking.map(label => `<span>${escape(label)}</span>`).join('')}</div><div class="feature-watermark" aria-hidden="true">DR</div></article><div class="feature-secondary">${[1, 2].map(i => `<article class="enamel-plate"><h3>${escape(t.featureTitles[i])}</h3><p>${escape(t.featureBodies[i])}</p></article>`).join('')}</div></div></section>
      ${renderDrGuide(locale)}
      <section id="capturas" class="section showcase"><div class="showcase-heading"><h2>${splitTitle(t.showcaseTitle)}</h2><p>${escape(t.showcaseIntro)}</p></div><div class="screenshot-grid">${screenshots.map((screenshot, i) => `<figure class="screenshot screenshot-${i + 1}"><a class="screenshot-frame" href="${screenshot.src}" aria-label="${escape(t.screenshotLabels[i])}" target="_blank" rel="noopener noreferrer" aria-describedby="gallery-hint"><img src="${screenshot.src}" alt="${escape(t.screenshotLabels[i])}" width="${screenshot.width}" height="${screenshot.height}" loading="lazy" decoding="async"></a><figcaption>${escape(t.screenshotLabels[i])}<span aria-hidden="true">↗</span></figcaption></figure>`).join('')}</div><p id="gallery-hint" class="gallery-hint">${escape(browsing.enlarge)}</p></section>
      <section id="comandos" class="section commands"><div class="section-heading"><h2>${splitTitle(t.commandsTitle)}</h2><p>${escape(t.commandsIntro)}</p></div><div class="console-panel enamel-plate"><div class="panel-rail"><span>${escape(t.nav[2])}</span><span id="command-count" aria-live="polite"></span></div><div class="command-toolbar"><label for="command-search">${escape(t.search)}</label><input id="command-search" type="search" value="${escape(query)}" placeholder="${escape(t.placeholder)}" autocomplete="off"></div><div class="command-list">${commandValues.map((command, i) => `<article class="command-row"><div><code>${escape(command)}</code><p>${escape(t.commandDescriptions[i])}</p></div><button data-copy="${escape(command)}" aria-label="${escape(t.copy)} ${escape(command)}">${escape(t.copy)}</button></article>`).join('')}</div><p id="command-empty" hidden>${escape(t.empty)}</p></div><p class="command-hint">${escape(t.hint)}</p></section>
      <section id="preguntas" class="section faq"><h2>${escape(t.faqTitle)}</h2><div class="faq-items enamel-plate">${t.faq.map(([question, answer], i) => `<details><summary>${escape(question)}<span aria-hidden="true">+</span></summary><p>${escape(answer)}${i === 5 ? ` <a href="${CF}#comments" target="_blank" rel="noopener noreferrer">CurseForge ↗</a>` : ''}</p></details>`).join('')}</div></section>
      <section id="shardot" class="section shardot" aria-labelledby="shardot-title">
        <div class="shardot-copy"><p class="eyebrow">${escape(shardot.eyebrow)}</p><h2 id="shardot-title">${splitTitle(shardot.title)}</h2><p>${escape(shardot.body)}</p><div class="shardot-resources">${shardot.resources.map(resource => `<span>${escape(resource)}</span>`).join('')}</div><a class="button button-outline" href="${SHARDOT}" target="_blank" rel="noopener noreferrer">${escape(shardot.action)} <span aria-hidden="true">↗</span></a></div>
        <div class="shardot-visuals">
          <a class="shardot-shot shardot-shot-dots" href="${SHARDOT}" target="_blank" rel="noopener noreferrer" aria-label="${escape(shardot.action)}"><img src="/screenshots/shardot-combo-points.png" alt="${escape(shardot.alts[0])}" width="536" height="402" loading="lazy" decoding="async"></a>
          <a class="shardot-shot shardot-shot-shards" href="${SHARDOT}" target="_blank" rel="noopener noreferrer" aria-label="${escape(shardot.action)}"><img src="/screenshots/shardot-soul-shards.png" alt="${escape(shardot.alts[1])}" width="732" height="410" loading="lazy" decoding="async"></a>
        </div>
      </section>
      <section id="apoyar" class="support" aria-labelledby="support-title"><img src="/drpulse-emblem-96.webp" alt="" width="100" height="100" loading="lazy"><div><h2 id="support-title">${escape(t.supportTitle)}</h2><p>${escape(t.supportBody)}</p></div><a class="button button-outline" href="https://paypal.me/sebiten" target="_blank" rel="noopener noreferrer">${escape(t.support)} <span aria-hidden="true">↗</span></a></section>
    </main><footer><a class="brand" href="#"><span>DR<span class="brand-light">PULSE</span></span></a><p>${escape(t.motto)}</p><div><a href="${CF}" target="_blank" rel="noopener noreferrer">CurseForge ↗</a><a href="#preguntas">${escape(t.help)}</a></div><small>${escape(t.legal)}</small><div class="language-links" aria-label="${escape(t.language)}">${Object.entries(languages).map(([key, name]) => `<a href="${localePath(key as Locale)}" hreflang="${key}" lang="${key}"${key === locale ? ' aria-current="page"' : ''}>${name}</a>`).join('')}</div></footer></div><div class="toast" role="status" aria-live="polite"></div>${renderGallery(locale)}`;
}
