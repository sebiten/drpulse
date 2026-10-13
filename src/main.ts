import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import './style.css';

const get = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Elemento no encontrado: ${selector}`);
  return element;
};

const menu = get<HTMLButtonElement>('.menu-toggle');
const navigation = get<HTMLElement>('#navigation');
function closeMenu(): void {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menu.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(isOpen));
  navigation.classList.toggle('open', isOpen);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});

const categories = ['Aturdimiento', 'Incapacitación', 'Desorientación / Miedo', 'Raíz', 'Silencio', 'Desarme', 'Provocación', 'Retroceso'];
let category = 0;
let stage = 0;
const values = ['100', '50', '25', 'INMUNE'];
const states = ['Control completo', 'Duración reducida a la mitad', 'Un cuarto de duración', 'Inmunidad al control'];
const tabs = get<HTMLDivElement>('.category-tabs');
categories.forEach((name, index) => {
  const button = document.createElement('button');
  button.textContent = name;
  button.setAttribute('aria-pressed', String(index === category));
  button.addEventListener('click', () => {
    category = index;
    stage = 0;
    tabs.querySelectorAll('button').forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === category)));
    renderDemo();
  });
  tabs.append(button);
});
function renderDemo(): void {
  const value = get<HTMLElement>('#dr-value');
  value.replaceChildren(document.createTextNode(values[stage]));
  if (stage < 3) {
    const percent = document.createElement('span');
    percent.textContent = '%';
    value.append(percent);
  }
  value.classList.toggle('immune', stage === 3);
  get<HTMLElement>('#category-label').textContent = categories[category];
  get<HTMLElement>('#dr-status').textContent = states[stage];
  get<HTMLElement>('.dr-ring').style.setProperty('--arc', `${[100, 50, 25, 0][stage]}%`);
  document.querySelectorAll('.dr-stages span').forEach((element, index) => element.classList.toggle('active', index === stage));
  const apply = get<HTMLButtonElement>('#apply-cc');
  apply.disabled = stage === 3;
  apply.textContent = stage === 3 ? 'Objetivo inmune' : 'Aplicar control ↗';
}
get<HTMLButtonElement>('#apply-cc').addEventListener('click', () => { stage = Math.min(stage + 1, 3); renderDemo(); });
get<HTMLButtonElement>('#reset-cc').addEventListener('click', () => { stage = 0; renderDemo(); });

const commands = [
  { command: '/drift', description: 'Abrir los ajustes del addon' },
  { command: '/drift unlock', description: 'Desbloquear y mover las barras' },
  { command: '/drift lock', description: 'Fijar la posición de las barras' },
  { command: '/drift preview', description: 'Activar o desactivar la vista previa' },
  { command: '/drift history', description: 'Consultar el historial de la sesión' },
  { command: '/drift add <spellID> <category>', description: 'Añadir o actualizar un hechizo personalizado' },
  { command: '/drift remove <spellID>', description: 'Eliminar un hechizo personalizado' },
  { command: '/drift reset', description: 'Restablecer los ajustes predeterminados' },
];
const list = get<HTMLElement>('.command-list');
commands.forEach(({ command, description }) => {
  const row = document.createElement('article');
  row.className = 'command-row';
  const content = document.createElement('div');
  const code = document.createElement('code');
  code.textContent = command;
  const text = document.createElement('p');
  text.textContent = description;
  const copy = document.createElement('button');
  copy.textContent = 'Copiar ↗';
  copy.dataset.copy = command;
  copy.setAttribute('aria-label', `Copiar ${command}`);
  content.append(code, text);
  row.append(content, copy);
  list.append(row);
});
const normalize = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
get<HTMLInputElement>('#command-search').addEventListener('input', event => {
  const query = normalize((event.target as HTMLInputElement).value.trim());
  let count = 0;
  list.querySelectorAll<HTMLElement>('.command-row').forEach((row, index) => {
    const match = normalize(`${commands[index].command} ${commands[index].description}`).includes(query);
    row.hidden = !match;
    if (match) count++;
  });
  get<HTMLElement>('#command-count').textContent = `${count} ${count === 1 ? 'comando' : 'comandos'}`;
  get<HTMLElement>('#command-empty').hidden = count !== 0;
});
let toastTimer: ReturnType<typeof setTimeout>;
document.addEventListener('click', async event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-copy]');
  if (!button?.dataset.copy) return;
  const toast = get<HTMLElement>('.toast');
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    toast.textContent = 'Copiado al portapapeles';
  } catch {
    toast.textContent = 'No se pudo copiar. Selecciona el texto y cópialo manualmente.';
  }
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.section, .trust-section, .support').forEach(section => {
  section.classList.add('reveal');
  observer.observe(section);
});
