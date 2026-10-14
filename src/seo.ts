import { languages, type Locale } from './locales';

export const siteUrl = 'https://www.drpulse.dev';
export const localePath = (locale: Locale): string => locale === 'en' ? '/' : `/${locale}/`;
export const localeKeys = Object.keys(languages) as Locale[];
export const escapeHtml = (text: string): string => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

interface SeoCopy { title: string; description: string; heading: string; body: string; detail: string; note: string; }
export const seo: Record<Locale, SeoCopy> = {
  en: {
    title: 'DRPulse: Diminish alternative for WoW: Forever',
    description: 'Looking for a Diminish DR Tracker alternative for WoW: Forever? Discover DRPulse: diminishing returns on target, focus and enemy nameplates. Setup and commands.',
    heading: 'A Diminish DR Tracker alternative for WoW: Forever',
    body: 'Looking for an addon like Diminish for WoW: Forever? DRPulse tracks crowd control diminishing returns on your target, focus and enemy nameplates, with reset timers and indicators for 50%, 25% and immunity.',
    detail: 'DRPulse supports WoW: Forever 1.60.1 (interface 16001, Camelot). Customize tracker positions, icon sizes and categories without external addon dependencies. Follow the installation guide below to get started.',
    note: 'DRPulse is an independent addon, not an official version of Diminish. Check the supported game version on each project before installing.',
  },
  es: {
    title: 'DRPulse: alternativa a Diminish para WoW: Forever',
    description: '¿Buscas una alternativa a Diminish DR Tracker para WoW: Forever? DRPulse sigue los diminishing returns en objetivo, foco y placas enemigas. Guía y comandos.',
    heading: 'Una alternativa a Diminish DR Tracker para WoW: Forever',
    body: '¿Buscas un addon como Diminish para WoW: Forever? DRPulse sigue los diminishing returns del control de masas en tu objetivo, foco y placas enemigas, con temporizadores de reinicio e indicadores de 50%, 25% e inmunidad.',
    detail: 'DRPulse es compatible con WoW: Forever 1.60.1 (interfaz 16001, Camelot). Ajusta posiciones, tamaños de iconos y categorías sin depender de otros addons. Sigue la guía de instalación de abajo para empezar.',
    note: 'DRPulse es un addon independiente, no una versión oficial de Diminish. Comprueba la versión del juego compatible en cada proyecto antes de instalarlo.',
  },
  de: {
    title: 'DRPulse: Diminish-Alternative für WoW: Forever',
    description: 'Eine Alternative zu Diminish DR Tracker für WoW: Forever gesucht? DRPulse verfolgt Diminishing Returns auf Ziel, Fokus und Namensplaketten. Anleitung und Befehle.',
    heading: 'Eine Alternative zu Diminish DR Tracker für WoW: Forever',
    body: 'Du suchst ein Addon wie Diminish für WoW: Forever? DRPulse verfolgt Diminishing Returns von Kontrolleffekten auf Ziel, Fokus und gegnerischen Namensplaketten, mit Rücksetzzeiten und Anzeigen für 50 %, 25 % und Immunität.',
    detail: 'DRPulse unterstützt WoW: Forever 1.60.1 (Interface 16001, Camelot). Passe Positionen, Symbolgrößen und Kategorien ohne zusätzliche Addons an. Die Installationsanleitung unten hilft dir beim Einstieg.',
    note: 'DRPulse ist ein eigenständiges Addon und keine offizielle Version von Diminish. Prüfe vor der Installation die unterstützte Spielversion des jeweiligen Projekts.',
  },
  fr: {
    title: 'DRPulse : alternative à Diminish pour WoW: Forever',
    description: 'Une alternative à Diminish DR Tracker pour WoW: Forever ? DRPulse suit les rendements décroissants sur la cible, le focus et les plaques ennemies. Guide et commandes.',
    heading: 'Une alternative à Diminish DR Tracker pour WoW: Forever',
    body: 'Vous cherchez un addon comme Diminish pour WoW: Forever ? DRPulse suit les rendements décroissants des contrôles sur votre cible, votre focus et les plaques ennemies, avec des délais de réinitialisation et des indicateurs à 50 %, 25 % et immunité.',
    detail: 'DRPulse prend en charge WoW: Forever 1.60.1 (interface 16001, Camelot). Ajustez les positions, la taille des icônes et les catégories sans addon supplémentaire. Consultez le guide d’installation ci-dessous pour commencer.',
    note: 'DRPulse est un addon indépendant, pas une version officielle de Diminish. Vérifiez la version du jeu prise en charge par chaque projet avant de l’installer.',
  },
  pt: {
    title: 'DRPulse: alternativa ao Diminish para WoW: Forever',
    description: 'Procura uma alternativa ao Diminish DR Tracker para WoW: Forever? DRPulse acompanha diminishing returns no alvo, foco e placas inimigas. Instalação e comandos.',
    heading: 'Uma alternativa ao Diminish DR Tracker para WoW: Forever',
    body: 'Procura um addon como o Diminish para WoW: Forever? O DRPulse acompanha os diminishing returns do controle de grupo no alvo, foco e placas inimigas, com temporizadores de reinício e indicadores de 50%, 25% e imunidade.',
    detail: 'O DRPulse é compatível com WoW: Forever 1.60.1 (interface 16001, Camelot). Ajuste posições, tamanhos dos ícones e categorias sem depender de outros addons. Siga o guia de instalação abaixo para começar.',
    note: 'O DRPulse é um addon independente, não uma versão oficial do Diminish. Confira a versão do jogo compatível em cada projeto antes de instalar.',
  },
};

export function seoHead(locale: Locale): string {
  const t = seo[locale];
  const url = siteUrl + localePath(locale);
  const ogLocales = { en: 'en_US', es: 'es_ES', de: 'de_DE', fr: 'fr_FR', pt: 'pt_BR' };
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'DRPulse',
    url, description: t.description, inLanguage: locale, applicationCategory: 'GameApplication',
    operatingSystem: 'Windows, macOS', softwareRequirements: 'WoW: Forever 1.60.1 · Interface 16001 · Camelot',
    image: `${siteUrl}/drpulse-emblem-512.webp`, author: { '@type': 'Person', name: 'Sebiten' },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return `<title>${escapeHtml(t.title)}</title>
    <meta name="description" content="${escapeHtml(t.description)}">
    <link rel="canonical" href="${url}">
    ${localeKeys.map(key => `<link rel="alternate" hreflang="${key}" href="${siteUrl}${localePath(key)}">`).join('\n')}
    <link rel="alternate" hreflang="x-default" href="${siteUrl}/">
    <meta property="og:title" content="${escapeHtml(t.title)}">
    <meta property="og:description" content="${escapeHtml(t.description)}">
    <meta property="og:type" content="website"><meta property="og:site_name" content="DRPulse">
    <meta property="og:url" content="${url}"><meta property="og:locale" content="${ogLocales[locale]}">
    ${localeKeys.filter(key => key !== locale).map(key => `<meta property="og:locale:alternate" content="${ogLocales[key]}">`).join('\n')}
    <meta property="og:image" content="${siteUrl}/drpulse-emblem-512.webp">
    <meta property="og:image:width" content="512"><meta property="og:image:height" content="512">
    <meta property="og:image:alt" content="DRPulse">
    <meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHtml(t.title)}">
    <meta name="twitter:description" content="${escapeHtml(t.description)}">
    <meta name="twitter:image" content="${siteUrl}/drpulse-emblem-512.webp">
    <script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`;
}
