/** Razmaci u px, skala od 4. `theme.spacing[4]` = 16. */
export const SPACING = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const

export type SpacingToken = keyof typeof SPACING

/** Radijusi u px — iz dizajna (dugmad 10, kartice 18–22, header 18). */
export const RADII = {
  xs: 6,
  sm: 8,
  base: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  pill: 999,
} as const

/**
 * Senke iz dizajna. Spekular (`inset 0 1px 0 0`) je svetlo na gornjoj ivici stakla —
 * bez njega staklo izgleda kao isprana kartica.
 */
export const SHADOWS = {
  glass: 'inset 0 1px 0 0 var(--c-spec), 0 12px 32px -14px rgba(13,71,161,.28)',
  card: 'inset 0 1px 0 0 var(--c-spec), 0 2px 6px rgba(13,71,161,.06), 0 24px 48px -20px rgba(13,71,161,.35)',
  float: '0 2px 6px rgba(13,71,161,.06), 0 24px 48px -20px rgba(13,71,161,.35)',
  button: '0 8px 20px -10px rgba(13,71,161,.55)',
  focus: '0 0 0 3px rgba(33,150,243,.45)',
} as const

/** Zamućenje stakla. `strong` je za header i modale, `soft` za kartice nad aurorom. */
export const BLUR = {
  soft: 'blur(14px) saturate(1.7)',
  strong: 'blur(22px) saturate(1.7)',
  aurora: 'blur(90px)',
} as const
