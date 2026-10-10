import { css, styled } from 'next-yak'

import { BRAND_COLORS, INVERSE, anim, colors, fonts } from '@/styles/tokens.yak'

import type { LogoTone } from './Logo.types'

export const Root = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 9px;
`

export const Mark = styled.img<{ $animated: boolean }>`
  display: block;
  ${({ $animated }) =>
    $animated &&
    css`
      animation: ${anim.bob} 4s ease-in-out infinite;
    `}
`

export const Word = styled.span<{ $tone: LogoTone }>`
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.03em;
  color: ${colors.wordmark};
  ${({ $tone }) =>
    $tone === 'inverse' &&
    css`
      color: ${INVERSE.heading};
    `}
`

export const Tld = styled.span<{ $tone: LogoTone }>`
  ${({ $tone }) =>
    $tone === 'inverse'
      ? css`
          color: ${INVERSE.accent};
        `
      : css`
          background: linear-gradient(90deg, ${BRAND_COLORS.blue}, ${BRAND_COLORS.sky});
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        `}
`
