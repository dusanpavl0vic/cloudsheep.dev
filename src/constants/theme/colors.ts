/**
 * Vrednosti boja za obe teme, tačno iz dizajna (`LIGHT` / `DARK`).
 *
 * Ključ je ime tokena; CSS promenljiva je `--c-<ključ>` (vidi `styles/GlobalStyles.ts`).
 * Komponente nikad ne čitaju ove vrednosti — čitaju `theme.colors.x`, koji je referenca na
 * promenljivu, pa promena teme ne rerenderuje React (ADR 0010).
 */
export const PALETTE = {
  light: {
    bg: '#F6F9FE',
    card: '#FFFFFF',
    muted: '#E3F2FD',
    line: '#D6E6F7',
    line2: '#B5D2F0',
    display: '#0A1F44',
    ink: '#0D47A1',
    ink2: '#2F5A99',
    faint: '#50709F',
    wordmark: '#0D47A1',
    primary: '#0D47A1',
    primaryHover: '#0B3B86',
    onPrimary: '#FFFFFF',
    accent: '#2196F3',
    navy: '#071D45',
    glass: 'rgba(255,255,255,.55)',
    glassStrong: 'rgba(255,255,255,.82)',
    edge: 'rgba(255,255,255,.8)',
    spec: 'rgba(255,255,255,.7)',
    aurora1: 'rgba(33,150,243,.30)',
    aurora2: 'rgba(144,202,249,.50)',
    aurora3: 'rgba(13,71,161,.20)',
    aurora4: 'rgba(144,202,249,.40)',
    veil: 'rgba(246,249,254,.42)',
    danger: '#D93025',
    success: '#1E8E3E',
  },
  dark: {
    bg: '#061A3D',
    card: '#0B2754',
    muted: '#0F3068',
    line: '#17407F',
    line2: '#22508F',
    display: '#FFFFFF',
    ink: '#E3F2FD',
    ink2: '#B9D8F6',
    faint: '#90B4DD',
    wordmark: '#E3F2FD',
    primary: '#2196F3',
    primaryHover: '#42A5F5',
    onPrimary: '#04122C',
    accent: '#90CAF9',
    navy: '#04122C',
    glass: 'rgba(11,39,84,.5)',
    glassStrong: 'rgba(11,39,84,.82)',
    edge: 'rgba(227,242,253,.14)',
    spec: 'rgba(255,255,255,.14)',
    aurora1: 'rgba(33,150,243,.45)',
    aurora2: 'rgba(144,202,249,.22)',
    aurora3: 'rgba(13,71,161,.6)',
    aurora4: 'rgba(33,150,243,.22)',
    veil: 'rgba(6,26,61,.4)',
    danger: '#FF8A80',
    success: '#81C995',
  },
} as const

export type ColorToken = keyof typeof PALETTE.light

/** Boje marke koje se ne menjaju sa temom (gradijent `.dev`, oblaci misli u hero-u). */
export const BRAND_COLORS = {
  blue: '#2196F3',
  sky: '#90CAF9',
  ice: '#E3F2FD',
  deep: '#0D47A1',
  night: '#04122C',
  white: '#FFFFFF',
} as const

const toCssVar = (token: string) =>
  `--c-${token.replace(/[A-Z0-9]/g, (c) => `-${c.toLowerCase()}`)}`

/** Ime CSS promenljive za token: `primaryHover` → `--c-primary-hover`. */
export const colorVar = (token: ColorToken) => toCssVar(token)

const TOKENS = Object.keys(PALETTE.light) as ColorToken[]

/** `theme.colors.x` — reference na CSS promenljive, ne vrednosti. */
export const COLORS = Object.fromEntries(
  TOKENS.map((token) => [token, `var(${toCssVar(token)})`]),
) as Record<ColorToken, string>

/** Svetlosni efekti marke (sjaj kursora, aurora) — ne zavise od teme. */
export const GLOW = {
  cursor: 'rgba(33,150,243,.14)',
  hero: 'rgba(33,150,243,.22)',
  selection: '#2196F3',
} as const
