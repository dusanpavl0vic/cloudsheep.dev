/**
 * Atributi kojima serverske komponente traže efekat, a `PageEffects` ga primenjuje — jedan
 * listener za ceo sajt umesto po jedan po komponenti (docs/22-visual-language.md §4).
 */
export const EFFECT_ATTRS = {
  /** Element se pojavljuje (blur + podizanje) kad uđe u ekran. */
  reveal: 'data-reveal',
  /** Kartica sa sjajem koji prati kursor (`--gx`, `--gy`). */
  glow: 'data-glow',
  /** Hero: sjaj kursora (`--mx`, `--my`) i parallax dece sa `data-depth`. */
  hero: 'data-hero',
  heroGlow: 'data-cursor-glow',
  depth: 'data-depth',
  /** Sadržaj hero-a bledi i spušta se pri skrolovanju. */
  heroContent: 'data-hero-content',
  /** Ogromna reč u podnožju izranja dok se skroluje. */
  footword: 'data-footword',
  /** Proces: sekcija se zakači, karte se smenjuju skrolom (`pinCard`/`pinStep` nose indeks). */
  pin: 'data-pin',
  pinCard: 'data-pin-card',
  pinStep: 'data-pin-step',
  pinFill: 'data-pin-fill',
} as const

export const REVEAL = {
  /** Elementi već na ekranu pri učitavanju se ne animiraju (bez treptaja iznad fold-a). */
  skipAboveFold: 0.9,
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
  stagger: 0.08,
  durationS: 1,
} as const

/** Zakačeni proces (dizajn): karte iznad aktivne izlaze nadole, ispod nje se slažu u špil. */
export const PIN = {
  /** Poslednja karta stiže malo pre kraja skrola — da ostane trenutak na ekranu. */
  overshoot: 1.12,
  exitShiftPct: 115,
  exitTiltDeg: 4,
  stackShiftPx: 26,
  stackScale: 0.06,
  stackFade: 0.28,
  maxStack: 3,
  activeStepShiftPx: 10,
} as const
