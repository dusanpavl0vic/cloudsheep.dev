/**
 * Self-hostovani fontovi (`public/fonts`). Nikad Google Fonts — render-blocking zahtev ka
 * trećoj strani i CSP `font-src 'self'`.
 *
 * Podskup latin + latin-ext: bez `latin-ext` srpska slova č/ć/š/ž/đ padaju na sistemski font.
 * Varijabilni fajl nosi sve težine (`400 700`). `preload` samo za prvi ekran — latin podskup.
 */
const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212'
const LATIN_EXT = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F'

export interface FontFace {
  family: string
  file: string
  unicodeRange: string
  preload: boolean
}

export const FONT_FACES: readonly FontFace[] = [
  { family: 'DM Sans', file: '/fonts/dm-sans-latin.woff2', unicodeRange: LATIN, preload: true },
  {
    family: 'DM Sans',
    file: '/fonts/dm-sans-latin-ext.woff2',
    unicodeRange: LATIN_EXT,
    preload: false,
  },
  {
    family: 'Space Grotesk',
    file: '/fonts/space-grotesk-latin.woff2',
    unicodeRange: LATIN,
    preload: true,
  },
  {
    family: 'Space Grotesk',
    file: '/fonts/space-grotesk-latin-ext.woff2',
    unicodeRange: LATIN_EXT,
    preload: false,
  },
  {
    family: 'JetBrains Mono',
    file: '/fonts/jetbrains-mono-latin.woff2',
    unicodeRange: LATIN,
    preload: false,
  },
  {
    family: 'JetBrains Mono',
    file: '/fonts/jetbrains-mono-latin-ext.woff2',
    unicodeRange: LATIN_EXT,
    preload: false,
  },
]
