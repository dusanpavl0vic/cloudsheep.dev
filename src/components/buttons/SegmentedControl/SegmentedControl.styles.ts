import { css, styled } from 'next-yak'

import { focusRing, resetButton } from '@/styles/mixins'
import { BRAND_SHADOWS, colors, fonts, radii } from '@/styles/tokens.yak'

export const Root = styled.div`
  display: inline-flex;
  padding: 3px;
  border-radius: ${radii.base}px;
  background: ${colors.muted};
`

export const Segment = styled.button<{ $active: boolean; $mono: boolean }>`
  ${resetButton};
  ${focusRing};
  padding: 5px 9px;
  border-radius: ${radii.sm}px;
  font-size: ${({ $mono }) => ($mono ? '11.5px' : '13.5px')};
  font-weight: 600;
  ${({ $mono }) =>
    $mono &&
    css`
      font-family: ${fonts.mono};
    `}
  transition: all 0.25s;

  ${({ $active }) =>
    $active
      ? css`
          background: ${colors.card};
          color: ${colors.ink};
          box-shadow: ${BRAND_SHADOWS.langActive};
        `
      : css`
          background: transparent;
          color: ${colors.faint};
        `}
`
