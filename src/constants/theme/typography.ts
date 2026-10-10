/** Porodice fontova — imena iz `@font-face` u `styles/global.ts` (`constants/theme/fonts.ts`). */
export const FONT_FAMILY = {
  sans: "'DM Sans', system-ui, sans-serif",
  heading: "'Space Grotesk', 'DM Sans', sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const

/** Tipografske varijante iz dizajna. `size` je CSS vrednost (fluidna gde dizajn to traži). */
export const TYPOGRAPHY = {
  hero: {
    family: 'heading',
    size: 'clamp(2.9rem, 8.5vw, 7rem)',
    weight: 700,
    lineHeight: 0.95,
    tracking: '-0.045em',
  },
  display: {
    family: 'heading',
    size: 'clamp(2.2rem, 5vw, 4rem)',
    weight: 700,
    lineHeight: 1,
    tracking: '-0.04em',
  },
  h1: {
    family: 'heading',
    size: 'clamp(2.6rem, 6vw, 4.8rem)',
    weight: 700,
    lineHeight: 1,
    tracking: '-0.04em',
  },
  h2: {
    family: 'heading',
    size: 'clamp(1.8rem, 3vw, 2.6rem)',
    weight: 700,
    lineHeight: 1.1,
    tracking: '-0.03em',
  },
  h3: { family: 'heading', size: '22px', weight: 700, lineHeight: 1.2, tracking: '-0.02em' },
  h4: { family: 'heading', size: '18px', weight: 600, lineHeight: 1.3, tracking: '-0.01em' },
  lead: { family: 'sans', size: '18px', weight: 400, lineHeight: 1.6, tracking: '0' },
  body: { family: 'sans', size: '16px', weight: 400, lineHeight: 1.6, tracking: '0' },
  small: { family: 'sans', size: '14px', weight: 400, lineHeight: 1.5, tracking: '0' },
  caption: { family: 'sans', size: '13px', weight: 400, lineHeight: 1.45, tracking: '0' },
  eyebrow: { family: 'mono', size: '12px', weight: 600, lineHeight: 1.4, tracking: '0.08em' },
  mono: { family: 'mono', size: '13px', weight: 500, lineHeight: 1.5, tracking: '0' },
} as const

export type TypographyVariant = keyof typeof TYPOGRAPHY
