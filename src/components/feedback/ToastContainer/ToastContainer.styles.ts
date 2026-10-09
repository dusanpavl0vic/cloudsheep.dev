import { css, styled } from 'next-yak'

import { focusRing, glassStrong, resetButton } from '@/styles/mixins'
import { anim, colors, spacing, zIndex } from '@/styles/tokens.yak'

export const Root = styled.div`
  position: fixed;
  right: ${spacing[4]}px;
  bottom: ${spacing[4]}px;
  left: ${spacing[4]}px;
  z-index: ${zIndex.toast};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${spacing[2]}px;
  pointer-events: none;
`

export const Item = styled.div<{ $variant: 'info' | 'success' | 'danger' }>`
  ${glassStrong};
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 420px;
  padding: 12px 12px 12px 16px;
  border-radius: 14px;
  border-left: 3px solid ${colors.accent};
  color: ${colors.ink};
  font-size: 14.5px;
  pointer-events: auto;
  animation: ${anim.slideUp} 0.3s both;

  ${({ $variant }) =>
    $variant === 'success' &&
    css`
      border-left-color: ${colors.success};
    `}
  ${({ $variant }) =>
    $variant === 'danger' &&
    css`
      border-left-color: ${colors.danger};
    `}
`

export const Close = styled.button`
  ${resetButton};
  ${focusRing};
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: ${colors.faint};

  &:hover {
    background: ${colors.muted};
    color: ${colors.ink};
  }
`
