import { css } from 'next-yak'

import { BRAND_COLORS, GLOW, blur, colors, shadows, typography } from './tokens.yak'

/** Vidljiv fokus samo sa tastature (docs/15-accessibility.md §2). */
export const focusRing = css`
  &:focus-visible {
    outline: 2px solid ${colors.accent};
    outline-offset: 2px;
  }
`

/** Sakriveno od oka, vidljivo čitaču ekrana. */
export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`

export const resetButton = css`
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`

/** Tekst odsečen posle tri reda (sažetak na kartici). */
export const lineClamp3 = css`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

/** Tipografske varijante iz teme (porodica, veličina, težina, prored, razmak slova). */
export const typographyDisplay = css`
  ${typography.display}
`
export const typographyH2 = css`
  ${typography.h2}
`
export const typographyH4 = css`
  ${typography.h4}
`
export const typographyLead = css`
  ${typography.lead}
`
export const typographyBody = css`
  ${typography.body}
`
export const typographyEyebrow = css`
  ${typography.eyebrow}
`

/**
 * Staklena površina: providna podloga, zamućenje, ivica i spekular.
 * `Strong` za header i modale (manje providno), `Soft` za kartice nad aurorom.
 */
export const glassSoft = css`
  background: ${colors.glass};
  backdrop-filter: ${blur.soft};
  -webkit-backdrop-filter: ${blur.soft};
  border: 1px solid ${colors.edge};
  box-shadow: ${shadows.glass};
`

export const glassStrong = css`
  background: ${colors.glassStrong};
  backdrop-filter: ${blur.strong};
  -webkit-backdrop-filter: ${blur.strong};
  border: 1px solid ${colors.edge};
  box-shadow: ${shadows.glass};
`

/** Sjaj koji prati kursor — `PageEffects` postavlja `--gx` / `--gy`. */
export const cursorGlow = css`
  background-image: radial-gradient(circle 220px at var(--gx, -400px) var(--gy, -400px), ${GLOW.cursor}, transparent 70%);
`

/** Tekst sa gradijentom marke (`.dev` u logotipu, istaknute reči u naslovima). */
export const gradientText = css`
  background: linear-gradient(90deg, ${BRAND_COLORS.blue}, ${BRAND_COLORS.sky});
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`
