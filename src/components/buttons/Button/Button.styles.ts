import { css, styled } from 'next-yak'

import Slot from '@/components/foundations/Slot'
import type { ControlSize } from '@/constants/theme'
import { focusRing, resetButton } from '@/styles/mixins'
import { BRAND_SHADOWS, INVERSE, colors, spacing } from '@/styles/tokens.yak'

import type { ButtonVariant } from './Button.types'
import { BUTTON_SIZES } from './Button.yak'

interface ButtonStyleProps {
  $variant: ButtonVariant
  $size: ControlSize
  $fullWidth: boolean
}

/**
 * Zajednički stil dugmeta i linka koji izgleda kao dugme. Varijanta i veličina biraju statičan
 * `css` blok — funkcija nikad ne čita token u runtime-u, pa tokeni ne idu u klijentski JS.
 */
const base = css<ButtonStyleProps>`
  ${resetButton};
  ${focusRing};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]}px;
  border: 1px solid transparent;
  line-height: 1.2;
  white-space: nowrap;
  text-decoration: none;
  transition:
    background 0.25s,
    color 0.25s,
    transform 0.25s,
    filter 0.25s;

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  ${({ $size }) =>
    $size === 's' &&
    css`
      min-height: ${BUTTON_SIZES.s.height}px;
      padding: 0 ${BUTTON_SIZES.s.paddingX}px;
      border-radius: ${BUTTON_SIZES.s.radius}px;
      font-size: ${BUTTON_SIZES.s.fontSize};
      font-weight: ${BUTTON_SIZES.s.weight};
    `}

  ${({ $size }) =>
    $size === 'm' &&
    css`
      min-height: ${BUTTON_SIZES.m.height}px;
      padding: 0 ${BUTTON_SIZES.m.paddingX}px;
      border-radius: ${BUTTON_SIZES.m.radius}px;
      font-size: ${BUTTON_SIZES.m.fontSize};
      font-weight: ${BUTTON_SIZES.m.weight};
    `}

  ${({ $size }) =>
    $size === 'l' &&
    css`
      min-height: ${BUTTON_SIZES.l.height}px;
      padding: 0 ${BUTTON_SIZES.l.paddingX}px;
      border-radius: ${BUTTON_SIZES.l.radius}px;
      font-size: ${BUTTON_SIZES.l.fontSize};
      font-weight: ${BUTTON_SIZES.l.weight};
    `}

  ${({ $variant }) =>
    $variant === 'primary' &&
    css`
      background: ${colors.primary};
      color: ${colors.onPrimary};
      &:hover:not(:disabled) {
        background: ${colors.primaryHover};
        transform: translateY(-1px);
      }
    `}

  ${({ $variant }) =>
    $variant === 'accent' &&
    css`
      background: ${INVERSE.button};
      color: ${INVERSE.onButton};
      box-shadow: ${BRAND_SHADOWS.ctaButton};
      &:hover:not(:disabled) {
        transform: translateY(-3px);
      }
    `}

  ${({ $variant }) =>
    $variant === 'secondary' &&
    css`
      background: transparent;
      color: ${colors.ink};
      border-color: ${colors.line2};
      &:hover:not(:disabled) {
        background: ${colors.muted};
      }
    `}

  ${({ $variant }) =>
    $variant === 'ghost' &&
    css`
      background: transparent;
      color: ${colors.ink};
      &:hover:not(:disabled) {
        background: ${colors.muted};
        color: ${colors.accent};
      }
    `}

  ${({ $variant }) =>
    $variant === 'inverse' &&
    css`
      background: transparent;
      color: ${INVERSE.soft};
      border-color: ${INVERSE.lineStrong};
      &:hover:not(:disabled) {
        background: ${INVERSE.wash};
      }
    `}

  ${({ $variant }) =>
    $variant === 'danger' &&
    css`
      background: ${colors.danger};
      color: ${colors.onPrimary};
      &:hover:not(:disabled) {
        filter: brightness(1.08);
      }
    `}

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const Root = styled.button<ButtonStyleProps>`
  ${base}
`

/** Link (`<a>`, `Link`, admin `next/link`) sa izgledom dugmeta — element bira `component`. */
export const RootLink = styled(Slot)<ButtonStyleProps>`
  ${base}
`
