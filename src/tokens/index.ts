/** Relative path to the tokens CSS file — import this in your app entry or bundler config. */
export const cssPath = './tokens.css' as const;

// ─── Token name union ────────────────────────────────────────────────────────

type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type SpaceStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type RadiusKey = 'sm' | 'md' | 'lg' | 'full';
type FontSizeKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ShadowKey = 'sm' | 'md' | 'lg';

export type TokenName =
  | `color-neutral-${ColorScale}`
  | `color-accent-${ColorScale}`
  | `color-danger-${ColorScale}`
  | `space-${SpaceStep}`
  | `radius-${RadiusKey}`
  | `font-size-${FontSizeKey}`
  | `shadow-${ShadowKey}`;

// ─── tokenVar helper ─────────────────────────────────────────────────────────

/** Returns the CSS custom property reference for a design token: `var(--rap-${name})`. */
export function tokenVar<T extends TokenName>(name: T): `var(--rap-${T})` {
  return `var(--rap-${name})` as `var(--rap-${T})`;
}
