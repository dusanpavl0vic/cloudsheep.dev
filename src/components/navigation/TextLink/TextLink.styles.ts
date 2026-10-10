import { css, styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { focusRing } from '@/styles/mixins'
import { EASE_OUT, colors } from '@/styles/tokens.yak'

export const Root = styled(Link)<{ $underline: boolean; $tone: 'accent' | 'muted' }>`
  ${focusRing};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  font-weight: 600;
  font-size: 16px;
  color: ${colors.faint};
  ${({ $tone }) =>
    $tone === 'accent' &&
    css`
      color: ${colors.accent};
    `}
  transition: color 0.2s;

  ${({ $underline }) =>
    $underline &&
    css`
      padding: 6px 0;
      border-bottom: 2px solid ${colors.accent};
    `}

  svg {
    transition: transform 0.25s ${EASE_OUT};
  }

  &:hover {
    color: ${colors.accent};
  }

  &:hover svg:last-child {
    transform: translateX(4px);
  }

  &:hover svg:first-child:not(:last-child) {
    transform: translateX(-4px);
  }
`
