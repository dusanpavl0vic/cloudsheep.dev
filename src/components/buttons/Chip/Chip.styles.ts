import { css, styled } from 'next-yak'

import { focusRing, resetButton } from '@/styles/mixins'
import { buttonHeights, colors, radii } from '@/styles/tokens.yak'

export const Root = styled.button<{ $selected: boolean; $hasHint: boolean }>`
  ${resetButton};
  ${focusRing};
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-height: ${buttonHeights.s}px;
  padding: ${({ $hasHint }) => ($hasHint ? '12px 16px' : '8px 14px')};
  border-radius: ${radii.base}px;
  border: 1px solid ${colors.line};
  font-size: 14.5px;
  font-weight: 500;
  text-align: left;
  transition:
    background 0.25s,
    color 0.25s,
    border-color 0.25s,
    transform 0.25s;

  ${({ $selected }) =>
    $selected
      ? css`
          background: ${colors.primary};
          color: ${colors.onPrimary};
          border-color: ${colors.primary};
        `
      : css`
          background: ${colors.card};
          color: ${colors.ink};
          &:hover {
            border-color: ${colors.accent};
            transform: translateY(-1px);
          }
        `}
`

export const Hint = styled.span`
  font-size: 13px;
  font-weight: 400;
  opacity: 0.75;
`
