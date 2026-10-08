'use client'

import styled, { css } from 'styled-components'

import type { ControlSize } from '@/constants/theme'
import { BRAND_SHADOWS, INVERSE } from '@/constants/theme'
import { focusRing, resetButton } from '@/styles/mixins'

import { BUTTON_FONT_SIZE, BUTTON_PADDING_X, BUTTON_RADIUS } from './Button.constants'
import type { ButtonVariant } from './Button.types'

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
      transform: translateY(-1px);
    }
  `,
  accent: css`
    background: ${INVERSE.button};
    color: ${INVERSE.onButton};
    box-shadow: ${BRAND_SHADOWS.ctaButton};
    &:hover:not(:disabled) {
      transform: translateY(-3px);
    }
  `,
  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.ink};
    border-color: ${({ theme }) => theme.colors.line2};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.muted};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.ink};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.muted};
      color: ${({ theme }) => theme.colors.accent};
    }
  `,
  inverse: css`
    background: transparent;
    color: ${INVERSE.soft};
    border-color: ${INVERSE.lineStrong};
    &:hover:not(:disabled) {
      background: ${INVERSE.wash};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.onPrimary};
    &:hover:not(:disabled) {
      filter: brightness(1.08);
    }
  `,
} satisfies Record<ButtonVariant, ReturnType<typeof css>>

export const Root = styled.button<{ $variant: ButtonVariant; $size: ControlSize; $fullWidth: boolean }>`
  ${resetButton};
  ${focusRing};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]}px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  min-height: ${({ theme, $size }) => theme.buttonHeights[$size]}px;
  padding: 0 ${({ $size }) => BUTTON_PADDING_X[$size]}px;
  border: 1px solid transparent;
  border-radius: ${({ theme, $size }) => theme.radii[BUTTON_RADIUS[$size]]}px;
  font-size: ${({ $size }) => BUTTON_FONT_SIZE[$size]};
  font-weight: ${({ $size }) => ($size === 'l' ? 700 : 600)};
  line-height: 1.2;
  white-space: nowrap;
  text-decoration: none;
  transition:
    background 0.25s,
    color 0.25s,
    transform 0.25s,
    filter 0.25s;
  ${({ $variant }) => variants[$variant]};

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.55;
    cursor: not-allowed;
  }
`
