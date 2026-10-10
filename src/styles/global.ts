import { globalStyle } from 'next-yak'

import { BRAND_COLORS, GLOW, colors, fontFaces, fonts, themeRules } from './tokens.yak'

/**
 * Reset, fontovi i vrednosti CSS promenljivih za obe teme (`themeRules`). Uvozi se jednom, u
 * `Document` — `globalStyle` je deo stylesheet-a, ne stabla komponenti (ADR 0015).
 */
globalStyle`
  ${fontFaces}

  ${themeRules}

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
    font-family: ${fonts.sans};
    font-size: 16px;
    line-height: 1.6;
    background: ${colors.bg};
    color: ${colors.ink};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    transition:
      background 0.4s,
      color 0.4s;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    font-family: ${fonts.heading};
    color: ${colors.display};
  }

  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  /* Liste u interfejsu su raspored (oznake, kartice, koraci) — bez markera. Telo beleške
     (markdown) vraća markere u svom stilu. */
  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img,
  svg,
  video,
  canvas {
    display: block;
    max-width: 100%;
  }

  img {
    height: auto;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  ::selection {
    background: ${GLOW.selection};
    color: ${BRAND_COLORS.white};
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`
