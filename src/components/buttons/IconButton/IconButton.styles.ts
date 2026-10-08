'use client'

import styled from 'styled-components'

import type { ControlSize } from '@/constants/theme'
import { focusRing, resetButton } from '@/styles/mixins'

export const Root = styled.button<{ $size: ControlSize; $variant: 'ghost' | 'muted' }>`
  ${resetButton};
  ${focusRing};
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: ${({ theme, $size }) => theme.buttonHeights[$size] - 6}px;
  height: ${({ theme, $size }) => theme.buttonHeights[$size] - 6}px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme, $variant }) => ($variant === 'muted' ? theme.colors.muted : 'transparent')};
  color: ${({ theme }) => theme.colors.ink};
  transition:
    background 0.25s,
    color 0.25s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.muted};
    color: ${({ theme }) => theme.colors.accent};
  }
`
