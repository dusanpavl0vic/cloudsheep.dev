'use client'

import { createGlobalStyle } from 'styled-components'

import {
  BRAND_COLORS,
  FONT_FACES,
  GLOW,
  PALETTE,
  colorVar,
  type ColorToken,
} from '@/constants/theme'

const paletteVars = (mode: keyof typeof PALETTE) =>
  (Object.entries(PALETTE[mode]) as [ColorToken, string][])
    .map(([token, value]) => `${colorVar(token)}: ${value};`)
    .join('\n')

const fontFaces = FONT_FACES.map(
  (face) => `@font-face {
    font-family: '${face.family}';
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url('${face.file}') format('woff2');
    unicode-range: ${face.unicodeRange};
  }`,
).join('\n')

/**
 * Reset, fontovi i vrednosti CSS promenljivih za obe teme.
 *
 * Tema bez kolačića prati sistem (`prefers-color-scheme`); izabrana tema je `data-theme` na
 * `<html>`, koji server postavlja iz kolačića `cs-theme` — bez treptaja i bez inline skripte
 * (docs/08-styling-ui.md §3, ADR 0008).
 */
export const GlobalStyles = createGlobalStyle`
  ${fontFaces}

  :root {
    color-scheme: light;
    ${paletteVars('light')}
  }

  :root[data-theme='dark'] {
    color-scheme: dark;
    ${paletteVars('dark')}
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) {
      color-scheme: dark;
      ${paletteVars('dark')}
    }
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
    scroll-padding-top: 96px;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: 16px;
    line-height: 1.6;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.ink};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    transition: background .4s, color .4s;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.display};
  }

  p, figure, blockquote, dl, dd {
    margin: 0;
  }

  /* Liste u interfejsu su raspored (oznake, kartice, koraci) — bez markera. Telo beleške
     (markdown) vraća markere u svom stilu. */
  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img, svg, video, canvas {
    display: block;
    max-width: 100%;
  }

  img {
    height: auto;
  }

  button, input, textarea, select {
    font: inherit;
    color: inherit;
  }

  ::selection {
    background: ${GLOW.selection};
    color: ${BRAND_COLORS.white};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
      scroll-behavior: auto !important;
    }
  }
`
