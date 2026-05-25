/**
 * Design-token CSS custom-property names.
 *
 * Consumers can override any token by re-declaring the variable on `:root`
 * or on a scoped selector. No JavaScript runtime cost is incurred.
 */
export const RAP_TOKENS = {
  // Color — primary variant
  colorPrimary:        '--rap-color-primary',
  colorPrimaryFg:      '--rap-color-primary-fg',
  colorPrimaryHover:   '--rap-color-primary-hover',
  colorPrimaryActive:  '--rap-color-primary-active',
  // Color — neutral variant
  colorNeutral:        '--rap-color-neutral',
  colorNeutralFg:      '--rap-color-neutral-fg',
  colorNeutralHover:   '--rap-color-neutral-hover',
  colorNeutralActive:  '--rap-color-neutral-active',
  // Color — danger variant
  colorDanger:         '--rap-color-danger',
  colorDangerFg:       '--rap-color-danger-fg',
  colorDangerHover:    '--rap-color-danger-hover',
  colorDangerActive:   '--rap-color-danger-active',
  // Spacing — button sizes
  spacingSm:           '--rap-spacing-sm',
  spacingMd:           '--rap-spacing-md',
  spacingLg:           '--rap-spacing-lg',
  // Border radius
  radiusSm:            '--rap-radius-sm',
  radiusMd:            '--rap-radius-md',
  radiusLg:            '--rap-radius-lg',
  // Typography
  fontSizeSm:          '--rap-font-size-sm',
  fontSizeMd:          '--rap-font-size-md',
  fontSizeLg:          '--rap-font-size-lg',
} as const;

export type RapToken = keyof typeof RAP_TOKENS;
export type RapTokenValue = (typeof RAP_TOKENS)[RapToken];

/** All token CSS-variable names, typed as a plain string array. */
export const RAP_TOKEN_NAMES: string[] = Object.keys(RAP_TOKENS);
