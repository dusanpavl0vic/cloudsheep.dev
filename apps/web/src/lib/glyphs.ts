/**
 * Dekorativni znakovi koji se renderuju kao ikonice.
 *
 * Nisu prevodiv tekst — uvek stoje u `aria-hidden` elementu i screen reader ih ne čita.
 * Izdvojeni su iz JSX-a iz dva razloga: `i18next/no-literal-string` ih s pravom prijavljuje
 * kao literal u UI-ju, a `docs/03` ionako zabranjuje magične vrednosti u kodu.
 */
export const GLYPHS = {
  /** Potvrda — lista osobina, poruka o uspehu */
  CHECK: '✓',
  /** Akcenat uz naslov u insight sekciji */
  SPARKLE: '✦',
  /** Oznaka ispred badge teksta */
  BLOCKS: '▚',
} as const

/**
 * Tekst koji se NE prevodi: naziv brenda i dekorativni terminal ispis.
 * Stoji ovde da bi `i18next/no-literal-string` ostao uključen u UI sloju.
 */
export const BRAND = {
  DOMAIN: 'cloudsheep.dev',
  /** Dekorativna komanda u 404 terminalu — ista je na svakom jeziku */
  NOT_FOUND_COMMAND: 'cd /this-page',
} as const
