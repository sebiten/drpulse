import type { Locale } from './locales';

const copy: Record<Locale, { close: string; previous: string; next: string }> = {
  en: { close: 'Close', previous: 'Previous', next: 'Next' },
  es: { close: 'Cerrar', previous: 'Anterior', next: 'Siguiente' },
  de: { close: 'Schließen', previous: 'Zurück', next: 'Weiter' },
  fr: { close: 'Fermer', previous: 'Précédente', next: 'Suivante' },
  pt: { close: 'Fechar', previous: 'Anterior', next: 'Próxima' },
};

export function renderGallery(locale: Locale): string {
  const t = copy[locale];
  return `<dialog class="image-viewer" aria-labelledby="image-viewer-title">
    <div class="viewer-toolbar"><p id="image-viewer-title"></p><button type="button" data-gallery-close autofocus>${t.close} <span aria-hidden="true">×</span></button></div>
    <div class="viewer-canvas"><img class="viewer-image" alt=""></div>
    <div class="viewer-navigation"><button type="button" data-gallery-previous><span aria-hidden="true">←</span> ${t.previous}</button><span class="viewer-position" aria-live="polite" aria-atomic="true"></span><button type="button" data-gallery-next>${t.next} <span aria-hidden="true">→</span></button></div>
  </dialog>`;
}

export function initGallery(): void {
  const dialog = document.querySelector<HTMLDialogElement>('.image-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.screenshot-frame'));
  const image = dialog.querySelector<HTMLImageElement>('.viewer-image')!;
  const title = dialog.querySelector<HTMLElement>('#image-viewer-title')!;
  const position = dialog.querySelector<HTMLElement>('.viewer-position')!;
  let current = 0;
  let opener: HTMLAnchorElement | undefined;

  const showImage = (index: number): void => {
    current = (index + links.length) % links.length;
    const source = links[current].querySelector<HTMLImageElement>('img')!;
    image.src = links[current].href;
    image.alt = source.alt;
    title.textContent = source.alt;
    position.textContent = `${current + 1} / ${links.length}`;
  };

  links.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      // Preserve normal browser behavior for opening the original in another tab.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      opener = link;
      showImage(index);
      dialog.showModal();
      document.documentElement.classList.add('gallery-open');
    });
  });

  dialog.querySelector('[data-gallery-close]')!.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-gallery-previous]')!.addEventListener('click', () => showImage(current - 1));
  dialog.querySelector('[data-gallery-next]')!.addEventListener('click', () => showImage(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('gallery-open');
    opener?.focus({ preventScroll: true });
  });
}
