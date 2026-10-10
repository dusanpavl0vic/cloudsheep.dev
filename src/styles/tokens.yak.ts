/**
 * Tokeni za next-yak šablone (ADR 0015). next-yak ne izvršava JS da bi izračunao interpolaciju —
 * osim koda u `.yak.ts` fajlu. Ovaj fajl zato prenosi `constants/theme` i `constants/layout` u
 * build: `${colors.primary}` u `.styles.ts` postaje `var(--c-primary)` u CSS-u, bez JS-a.
 *
 * Imena konstanti su ista kao u `constants/` — `.styles.ts` menja samo putanju uvoza.
 *
 * Uvozi su RELATIVNI i SA EKSTENZIJOM, fajl po fajl (ne kroz `index.ts`): pod Turbopack-om
 * next-yak izvršava `.yak.ts` kroz Node — bez `@/` alias-a i bez dopunjavanja ekstenzije.
 */
import { CONTAINER_MAX_WIDTH as CONTAINER, EASE_OUT as EASE, EASE_SPRING as SPRING, HEADER_HEIGHT as HEADER, Z_INDEX } from '../constants/layout.ts'
import * as BREAKPOINTS from '../constants/theme/breakpoints.ts'
import * as COLORS from '../constants/theme/colors.ts'
import * as FONTS from '../constants/theme/fonts.ts'
import * as SIZES from '../constants/theme/sizes.ts'
import * as SPACING from '../constants/theme/spacing.ts'
import * as TYPOGRAPHY from '../constants/theme/typography.ts'

const THEME = { ...BREAKPOINTS, ...COLORS, ...FONTS, ...SIZES, ...SPACING, ...TYPOGRAPHY }

export const colors = THEME.COLORS
export const fonts = THEME.FONT_FAMILY
export const spacing = THEME.SPACING
export const radii = THEME.RADII
export const shadows = THEME.SHADOWS
export const blur = THEME.BLUR
export const media = THEME.MEDIA
export const zIndex = Z_INDEX
export const buttonHeights = THEME.BUTTON_HEIGHTS
export const avatarSizes = THEME.AVATAR_SIZES
export const iconSizes = THEME.ICON_SIZES

export const BRAND_COLORS = THEME.BRAND_COLORS
export const BRAND_SHADOWS = THEME.BRAND_SHADOWS
export const INVERSE = THEME.INVERSE
export const GLOW = THEME.GLOW
export const ACCENTS = THEME.ACCENTS
export const THOUGHT = THEME.THOUGHT
export const DIPLOMA = THEME.DIPLOMA
export const DEVICE_FRAME = THEME.DEVICE_FRAME
export const PROCESS_TONES = THEME.PROCESS_TONES
export const ESTIMATE_PHASE_COLORS = THEME.ESTIMATE_PHASE_COLORS
export const EASE_OUT = EASE
export const EASE_SPRING = SPRING
export const HEADER_HEIGHT = HEADER
export const CONTAINER_MAX_WIDTH = CONTAINER

/** Tipografske varijante kao gotove deklaracije (`${typography.display}`). */
export const typography = Object.fromEntries(
  Object.entries(THEME.TYPOGRAPHY).map(([name, v]) => [
    name,
    `font-family: ${THEME.FONT_FAMILY[v.family]}; font-size: ${v.size}; font-weight: ${String(v.weight)}; line-height: ${String(v.lineHeight)}; letter-spacing: ${v.tracking};`,
  ]),
) as Record<TYPOGRAPHY.TypographyVariant, string>

/** Imena globalnih animacija (`@keyframes` u `styles/animations.ts`). */
export const anim = {
  bob: 'cs-bob',
  drift: 'cs-drift',
  popIn: 'cs-pop-in',
  pop: 'cs-pop',
  rise: 'cs-rise',
  fadeUp: 'cs-fade-up',
  slideUp: 'cs-slide-up',
  blink: 'cs-blink',
  gradientShift: 'cs-gradient-shift',
  draw: 'cs-draw',
  marquee: 'cs-marquee',
  pulse: 'cs-pulse',
  hint: 'cs-hint',
  fill: 'cs-fill',
  shine: 'cs-shine',
  spin: 'cs-spin',
  auroraDrift: 'cs-aurora-drift',
} as const

/** CSS promenljive palete za jednu temu (`--c-ink: #0D47A1; …`). */
const paletteVars = (mode: keyof typeof THEME.PALETTE) =>
  (Object.entries(THEME.PALETTE[mode]) as [COLORS.ColorToken, string][])
    .map(([token, value]) => `${THEME.colorVar(token)}: ${value};`)
    .join(' ')

/**
 * Cela pravila teme (ne samo deklaracije): next-yak deklaracije interpolirane UNUTAR pravila
 * u `globalStyle` iznese van bloka — kompletno pravilo na najvišem nivou ostaje netaknuto.
 *
 * Tema bez kolačića prati sistem (`prefers-color-scheme`); izabrana tema je `data-theme` na
 * `<html>` (kolačić `cs-theme`, docs/08-styling-ui.md §3).
 */
export const themeRules = [
  `:root { color-scheme: light; ${paletteVars('light')} }`,
  `:root[data-theme='dark'] { color-scheme: dark; ${paletteVars('dark')} }`,
  `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { color-scheme: dark; ${paletteVars('dark')} } }`,
].join(' ')

export const fontFaces = THEME.FONT_FACES.map(
  (face) =>
    `@font-face { font-family: '${face.family}'; font-style: normal; font-weight: 400 700; font-display: swap; src: url('${face.file}') format('woff2'); unicode-range: ${face.unicodeRange}; }`,
).join(' ')
