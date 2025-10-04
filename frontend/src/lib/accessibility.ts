
export function isKeyboardEventActivation(event: KeyboardEvent): boolean {
  const key = (event as KeyboardEvent).key;
  return key === "Enter" || key === " ";
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]:not([tabindex="-1"])',
    'area[href]:not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'iframe',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selectors));
}

export function setAriaBusy(el: HTMLElement, busy: boolean): void {
  el.setAttribute('aria-busy', busy ? 'true' : 'false');
}

export function announceLiveMessage(message: string, politeness: 'polite' | 'assertive' = 'polite') {
  const existing = document.getElementById('a11y-live-region');
  const region = existing ?? createLiveRegion();
  region.setAttribute('aria-live', politeness);
  region.textContent = '';
  // Ensure SR re-announces the same text
  setTimeout(() => {
    region.textContent = message;
  }, 50);
}

function createLiveRegion(): HTMLElement {
  const region = document.createElement('div');
  region.id = 'a11y-live-region';
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  document.body.appendChild(region);
  return region;
}

export function ensureLogicalTabOrder(_container: HTMLElement): void {
  // reference parameter to satisfy no-unused-vars in placeholder implementation
  void _container;
  // Placeholder: in complex layouts you could compute and set tabindex.
  // Left intentionally minimal per requirements.
}


