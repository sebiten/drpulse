import type { Locale } from './locales';
interface GuideCopy {
  title: [string, string]; intro: string; label: string;
  states: [string, string, string]; descriptions: [string, string, string];
  category: string; timerTitle: string; timerBody: string; ready: string;
}
export const guideCopy: Record<Locale, GuideCopy> = {
  es: {
    title: ['El color anticipa.', 'El tiempo decide.'],
    intro: 'Los segmentos de cada icono indican la duración de tu próximo control. El número te dice cuándo vuelve a estar disponible al completo.',
    label: 'Así se lee DRPulse',
    states: ['1 segmento amarillo', '2 segmentos naranjas', '3 segmentos rojos: inmunidad'],
    descriptions: ['Tu próximo control de esta categoría dura la mitad de lo normal.', 'Tu próximo control de esta categoría dura una cuarta parte de lo normal.', 'El objetivo es inmune a los controles de esta categoría hasta que se reinicie el DR.'],
    category: 'El DR se sigue por categoría: la inmunidad a una no implica inmunidad a todas.',
    timerTitle: 'La cuenta atrás es del DR.', timerBody: 'El número muestra los segundos restantes hasta que se reinicie esa categoría. No es la duración del próximo control. Al llegar a cero, recupera su duración normal.',
    ready: 'Duración completa',
  },
  en: {
    title: ['Read the color.', 'Time your control.'],
    intro: 'The segments on each icon show how long your next control will last. The number tells you when its full duration returns.',
    label: 'Reading DRPulse',
    states: ['1 yellow segment', '2 orange segments', '3 red segments: immunity'],
    descriptions: ['Your next control in this category lasts half its normal duration.', 'Your next control in this category lasts a quarter of its normal duration.', 'The target is immune to controls in this category until DR resets.'],
    category: 'DR is tracked per category: immunity to one does not mean immunity to all.',
    timerTitle: 'The countdown is for DR.', timerBody: 'The number shows the seconds remaining until that category resets. It is not the duration of your next control. At zero, its normal duration returns.',
    ready: 'Full duration',
  },
  de: {
    title: ['Die Farbe zeigt es.', 'Das Timing entscheidet.'],
    intro: 'Die Segmente am Symbol zeigen die Dauer deines nächsten Kontrolleffekts. Die Zahl zeigt, wann die volle Dauer zurückkehrt.',
    label: 'DRPulse richtig lesen',
    states: ['1 gelbes Segment', '2 orange Segmente', '3 rote Segmente: Immunität'],
    descriptions: ['Dein nächster Kontrolleffekt dieser Kategorie hält halb so lange wie normal.', 'Dein nächster Kontrolleffekt dieser Kategorie hält ein Viertel der normalen Dauer.', 'Das Ziel ist gegen Kontrolleffekte dieser Kategorie immun, bis DR zurückgesetzt wird.'],
    category: 'DR gilt pro Kategorie: Immunität gegen eine bedeutet nicht Immunität gegen alle.',
    timerTitle: 'Der Countdown gilt für DR.', timerBody: 'Die Zahl zeigt die Sekunden bis zum Zurücksetzen dieser Kategorie, nicht die Dauer des nächsten Kontrolleffekts. Bei null gilt wieder die normale Dauer.',
    ready: 'Volle Dauer',
  },
  fr: {
    title: ['La couleur renseigne.', 'Le timing décide.'],
    intro: 'Les segments de chaque icône indiquent la durée de ton prochain contrôle. Le nombre indique quand sa durée complète revient.',
    label: 'Lire DRPulse',
    states: ['1 segment jaune', '2 segments orange', '3 segments rouges : immunité'],
    descriptions: ['Ton prochain contrôle de cette catégorie dure la moitié de sa durée normale.', 'Ton prochain contrôle de cette catégorie dure un quart de sa durée normale.', 'La cible est immunisée aux contrôles de cette catégorie jusqu’à la réinitialisation des DR.'],
    category: 'Les DR sont suivis par catégorie : une immunité ne concerne pas toutes les catégories.',
    timerTitle: 'Le compte à rebours concerne les DR.', timerBody: 'Le nombre indique les secondes avant la réinitialisation de cette catégorie, pas la durée du prochain contrôle. À zéro, sa durée normale revient.',
    ready: 'Durée complète',
  },
  pt: {
    title: ['A cor indica.', 'O tempo decide.'],
    intro: 'Os segmentos de cada ícone indicam a duração do seu próximo controle. O número mostra quando a duração completa volta.',
    label: 'Como ler o DRPulse',
    states: ['1 segmento amarelo', '2 segmentos laranja', '3 segmentos vermelhos: imunidade'],
    descriptions: ['Seu próximo controle desta categoria dura metade do normal.', 'Seu próximo controle desta categoria dura um quarto do normal.', 'O alvo fica imune a controles desta categoria até o DR reiniciar.'],
    category: 'O DR é acompanhado por categoria: imunidade a uma não significa imunidade a todas.',
    timerTitle: 'A contagem regressiva é do DR.', timerBody: 'O número mostra os segundos até esta categoria reiniciar, não a duração do próximo controle. Ao chegar a zero, a duração normal volta.',
    ready: 'Duração completa',
  },
};
