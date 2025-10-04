// Jest + jest-axe helpers.
type AxeFn = (container: HTMLElement) => Promise<unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToHaveNoViolations = any;
let axe: AxeFn | undefined;
let toHaveNoViolations: ToHaveNoViolations | undefined;

async function ensureJestAxeLoaded() {
  if (axe && toHaveNoViolations) return;
  try {
    const mod: { axe: AxeFn; toHaveNoViolations: ToHaveNoViolations } = await import('jest-axe');
    axe = mod.axe;
    toHaveNoViolations = mod.toHaveNoViolations;
    const hasExpect = typeof (globalThis as unknown as { expect?: unknown }).expect !== 'undefined';
    if (hasExpect) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).expect.extend(toHaveNoViolations);
    }
  } catch {
    // jest-axe not available in non-test environments
  }
}

export async function expectA11yNoViolations(container: HTMLElement) {
  await ensureJestAxeLoaded();
  if (!axe) return; // noop outside tests
  const results = await axe(container);
  const hasExpect = typeof (globalThis as unknown as { expect?: unknown }).expect !== 'undefined';
  if (hasExpect) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).expect(results).toHaveNoViolations();
  }
}

export { axe };


