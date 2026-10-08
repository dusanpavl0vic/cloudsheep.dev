'use client'

import { css } from 'styled-components'

import { BRAND_COLORS, GLOW, type TypographyVariant } from '@/constants/theme'

/** Vidljiv fokus samo sa tastature (docs/15-accessibility.md §2). */
export const focusRing = css`
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
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

export const lineClamp = (lines: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`

/** Tipografska varijanta iz teme: porodica, veličina, težina, prored, razmak slova. */
export const typography = (variant: TypographyVariant) => css`
  ${({ theme }) => {
    const v = theme.typography[variant]
    return css`
      font-family: ${theme.fonts[v.family]};
      font-size: ${v.size};
      font-weight: ${v.weight};
      line-height: ${v.lineHeight};
      letter-spacing: ${v.tracking};
    `
  }}
`

/**
 * Staklena površina: providna podloga, zamućenje, ivica i spekular.
 * `strong` za header i modale (manje providno), `soft` za kartice nad aurorom.
 */
export const glass = (strength: 'soft' | 'strong' = 'soft') => css`
  background: ${({ theme }) => (strength === 'strong' ? theme.colors.glassStrong : theme.colors.glass)};
  backdrop-filter: ${({ theme }) => theme.blur[strength]};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur[strength]};
  border: 1px solid ${({ theme }) => theme.colors.edge};
  box-shadow: ${({ theme }) => theme.shadows.glass};
`

/** Sjaj koji prati kursor — komponenta postavlja `--gx` / `--gy` (hook `useCursorGlow`). */
export const cursorGlow = css`
  background-image: radial-gradient(
    circle 220px at var(--gx, -400px) var(--gy, -400px),
    ${GLOW.cursor},
    transparent 70%
  );
`

/** Tekst sa gradijentom marke (`.dev` u logotipu, istaknute reči u naslovima). */
export const gradientText = css`
  background: linear-gradient(90deg, ${BRAND_COLORS.blue}, ${BRAND_COLORS.sky});
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`
