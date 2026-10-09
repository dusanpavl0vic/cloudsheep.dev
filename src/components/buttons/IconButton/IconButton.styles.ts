import { css, styled } from 'next-yak'

import type { ControlSize } from '@/constants/theme'
import { focusRing, resetButton } from '@/styles/mixins'
import { buttonHeights, colors, radii } from '@/styles/tokens.yak'

export const Root = styled.button<{ $size: ControlSize; $variant: 'ghost' | 'muted' }>`
  ${resetButton};
  ${focusRing};
  display: grid;
  place-items: center;
  flex-shrink: 0;
  /* Za 6 px manje od dugmeta iste veličine (dizajn). */
  width: calc(${buttonHeights.m}px - 6px);
  height: calc(${buttonHeights.m}px - 6px);
  ${({ $size }) =>
    $size === 's' &&
    css`
      width: calc(${buttonHeights.s}px - 6px);
      height: calc(${buttonHeights.s}px - 6px);
    `}
  ${({ $size }) =>
    $size === 'l' &&
    css`
      width: calc(${buttonHeights.l}px - 6px);
      height: calc(${buttonHeights.l}px - 6px);
    `}
  border-radius: ${radii.md}px;
  border: 1px solid ${colors.line};
  background: transparent;
  ${({ $variant }) =>
    $variant === 'muted' &&
    css`
      background: ${colors.muted};
    `}
  color: ${colors.ink};
  transition:
    background 0.25s,
    color 0.25s;

  &:hover:not(:disabled) {
    background: ${colors.muted};
    color: ${colors.accent};
  }
`
