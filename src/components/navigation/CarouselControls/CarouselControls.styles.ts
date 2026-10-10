import { css, styled } from 'next-yak'

import { focusRing, resetButton } from '@/styles/mixins'
import { colors } from '@/styles/tokens.yak'

export const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

export const Arrow = styled.button`
  ${resetButton};
  ${focusRing};
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid ${colors.line2};
  background: ${colors.card};
  color: ${colors.ink};
  transition: all 0.25s;

  &:hover {
    background: ${colors.primary};
    border-color: ${colors.primary};
    color: ${colors.onPrimary};
  }
`

export const Dots = styled.div`
  display: flex;
  gap: 6px;
`

/** Tačka je vizuelno 8 px, ali meta za dodir je 24 px (docs/15 §3). */
export const Dot = styled.button<{ $active: boolean }>`
  ${resetButton};
  ${focusRing};
  position: relative;
  width: ${({ $active }) => `${String(($active ? 26 : 8))}px`};
  height: 8px;
  border-radius: 4px;
  background: ${colors.line2};
  ${({ $active }) =>
    $active &&
    css`
      background: ${colors.accent};
    `}
  transition: width 0.35s;

  &::after {
    content: '';
    position: absolute;
    inset: -8px -4px;
  }
`
