export const tokens = {
  // Color — palette
  colorPrimary: "--rap-color-primary",
  colorPrimaryHover: "--rap-color-primary-hover",
  colorOnPrimary: "--rap-color-on-primary",
  colorSecondary: "--rap-color-secondary",
  colorSecondaryHover: "--rap-color-secondary-hover",
  colorOnSecondary: "--rap-color-on-secondary",
  colorBackground: "--rap-color-background",
  colorOnBackground: "--rap-color-on-background",
  colorSurface: "--rap-color-surface",
  colorOnSurface: "--rap-color-on-surface",
  colorError: "--rap-color-error",
  colorOnError: "--rap-color-on-error",

  // Color — interaction
  colorFocusRing: "--rap-color-focus-ring",

  // Spacing
  spacingXs: "--rap-spacing-xs",
  spacingSm: "--rap-spacing-sm",
  spacingMd: "--rap-spacing-md",
  spacingLg: "--rap-spacing-lg",
  spacingXl: "--rap-spacing-xl",

  // Border radius
  radiusSm: "--rap-radius-sm",
  radiusMd: "--rap-radius-md",
  radiusLg: "--rap-radius-lg",
  radiusFull: "--rap-radius-full",
} as const;

export type TokenKey = keyof typeof tokens;
export type TokenValue = (typeof tokens)[TokenKey];
