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
  shine: 'rgba(255,255,255,.45)',
} as const

/**
 * Površine koje su UVEK tamne, bez obzira na temu: podnožje, završna CTA traka, istaknut
 * cenovni paket. Iz dizajna; ne prate `data-theme` namerno.
 */
export const INVERSE = {
  bg: '#061634',
  surface: '#071D45',
  heading: '#FFFFFF',
  text: '#B9D8F6',
  soft: '#E3F2FD',
  faint: '#90B4DD',
  accent: '#90CAF9',
  button: '#2196F3',
  onButton: '#04122C',
  line: 'rgba(144,202,249,.16)',
  lineStrong: 'rgba(144,202,249,.35)',
  wash: 'rgba(144,202,249,.07)',
  glowA: 'rgba(33,150,243,.45)',
  glowB: 'rgba(144,202,249,.3)',
  dots: 'rgba(144,202,249,.25)',
} as const

/** Senke u boji marke koje dizajn koristi na istaknutim elementima. */
export const BRAND_SHADOWS = {
  ctaBanner: '0 50px 100px -50px rgba(13,71,161,.8)',
  ctaButton: '0 18px 40px -16px rgba(33,150,243,.8)',
  thought: 'inset 0 1px 0 0 rgba(255,255,255,.9), 0 2px 6px rgba(13,71,161,.06), 0 24px 48px -20px rgba(13,71,161,.35)',
  tile: '0 1px 2px rgba(0,0,0,.05), 0 8px 20px -8px rgba(13,71,161,.3)',
  langActive: '0 1px 3px rgba(13,71,161,.2)',
  terminal: '0 18px 40px -20px rgba(13,71,161,.7)',
  ribbon: '0 30px 60px -30px rgba(13,71,161,.6)',
  primaryCta: '0 16px 34px -14px rgba(13,71,161,.75)',
  section: '0 24px 60px -30px rgba(13,71,161,.35)',
  panel: '0 30px 60px -34px rgba(13,71,161,.55)',
  avatar: '0 18px 36px -16px rgba(13,71,161,.5)',
  deck: '0 40px 80px -40px rgba(13,71,161,.55)',
  progress: '0 0 16px rgba(33,150,243,.6)',
  featured: '0 30px 60px -32px rgba(13,71,161,.45)',
  listCard: '0 20px 50px -34px rgba(13,71,161,.5)',
  listCardHover: '0 34px 70px -34px rgba(33,150,243,.6)',
  testimonial: '0 40px 80px -40px rgba(13,71,161,.45)',
  tileHover: '0 2px 4px rgba(0,0,0,.06), 0 22px 36px -12px rgba(33,150,243,.55)',
  estimator: '0 40px 80px -44px rgba(13,71,161,.5)',
  estimateResult: '0 30px 60px -30px rgba(13,71,161,.7)',
} as const

/** Akcentne linije i sjaj kartica (dizajn: gornja ivica, hover okvir). */
export const ACCENTS = {
  topLine: 'rgba(33,150,243,.6)',
  hoverEdge: 'rgba(33,150,243,.45)',
  cardGlow: 'rgba(33,150,243,.18)',
  cardShadow: '0 1px 2px rgba(0,0,0,.04), 0 12px 32px -12px rgba(13,71,161,.2)',
  cardShadowHover: '0 30px 60px -28px rgba(13,71,161,.45)',
} as const

/** „Oblaci misli" u hero-u su UVEK svetli (beli papirići nad aurorom), i u tamnoj temi. */
export const THOUGHT = {
  ink: PALETTE.light.ink,
  text: PALETTE.light.ink2,
  track: PALETTE.light.muted,
  edge: 'rgba(144,202,249,.55)',
  card: 'rgba(255,255,255,.92)',
  note: `linear-gradient(160deg, ${PALETTE.light.muted}, ${PALETTE.light.card})`,
} as const

/** Diploma u Studio sekciji je papir — uvek svetla (dizajn). */
export const DIPLOMA = {
  paper: '#FDFDFB',
  ink: '#0D47A1',
  soft: '#2F5A99',
  frame: 'rgba(80,112,159,.45)',
  grain: 'rgba(13,71,161,.1)',
  shadow: '0 1px 2px rgba(0,0,0,.06), 0 18px 40px -14px rgba(0,0,0,.28)',
} as const

/** Ton svake faze procesa (dizajn) — broj, gornja traka i krupna cifra karte. */
export const PROCESS_TONES = ['#0D47A1', '#1E6FD9', '#2196F3', '#42A5F5'] as const

/** Boje faza na traci procene, od svetle ka tamnoj (dizajn). */
export const ESTIMATE_PHASE_COLORS = ['#90CAF9', '#2196F3', '#0D47A1', '#071D45'] as const

/** Okviri uređaja u studiji slučaja — telefon je uvek taman, pregledač uvek beo (dizajn). */
export const DEVICE_FRAME = {
  phone: '#04122C',
  screen: '#E3F2FD',
  browser: '#FFFFFF',
  browserLine: '#D6E6F7',
  url: '#2F5A99',
  shadow: '0 40px 80px -30px rgba(13,71,161,.6)',
} as const
