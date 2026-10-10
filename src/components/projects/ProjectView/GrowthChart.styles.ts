import { css, styled } from 'next-yak'

import { BRAND_COLORS, colors, fonts } from '@/styles/tokens.yak'

export const Svg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
`

export const FillTop = styled.stop`
  stop-color: ${BRAND_COLORS.blue};
  stop-opacity: 0.35;
`

export const FillBottom = styled.stop`
  stop-color: ${BRAND_COLORS.blue};
  stop-opacity: 0;
`

export const GridLine = styled.line`
  stroke: ${colors.line};
  stroke-dasharray: 3 5;
`

/** Površina ispod linije se pojavi posle crtanja. */
export const Area = styled.path<{ $drawn: boolean }>`
  opacity: 0;
  transition: opacity 1s ease 1.2s;
  ${({ $drawn }) =>
    $drawn &&
    css`
      opacity: 1;
    `}

  @media (scripting: none) {
    opacity: 1;
  }
`

/** Linija se „crta" (`stroke-dashoffset` → 0) kad grafikon uđe u ekran; bez JS-a odmah cela. */
export const Line = styled.path<{ $drawn: boolean }>`
  fill: none;
  stroke: ${BRAND_COLORS.blue};
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke-dashoffset 1.8s cubic-bezier(0.4, 0.1, 0.2, 1);
  ${({ $drawn }) =>
    $drawn &&
    css`
      stroke-dashoffset: 0 !important;
    `}

  @media (scripting: none) {
    stroke-dashoffset: 0 !important;
  }
`

export const Dot = styled.circle<{ $drawn: boolean }>`
  fill: ${BRAND_COLORS.deep};
  opacity: 0;
  transition: opacity 0.4s ease 1.7s;
  ${({ $drawn }) =>
    $drawn &&
    css`
      opacity: 1;
    `}

  @media (scripting: none) {
    opacity: 1;
  }
`

export const Axis = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.faint};
`
