'use client'

import styled, { css } from 'styled-components'

import { BRAND_SHADOWS } from '@/constants/theme'
import { focusRing, resetButton } from '@/styles/mixins'

export const Root = styled.div`
  display: inline-flex;
  padding: 3px;
  border-radius: ${({ theme }) => theme.radii.base}px;
  background: ${({ theme }) => theme.colors.muted};
`

export const Segment = styled.button<{ $active: boolean; $mono: boolean }>`
  ${resetButton};
  ${focusRing};
  padding: 5px 9px;
  border-radius: ${({ theme }) => theme.radii.sm}px;
  font-size: ${({ $mono }) => ($mono ? '11.5px' : '13.5px')};
  font-weight: 600;
  ${({ theme, $mono }) =>
    $mono &&
    css`
      font-family: ${theme.fonts.mono};
    `}
  transition: all 0.25s;

  ${({ theme, $active }) =>
    $active
      ? css`
          background: ${theme.colors.card};
          color: ${theme.colors.ink};
          box-shadow: ${BRAND_SHADOWS.langActive};
        `
      : css`
          background: transparent;
          color: ${theme.colors.faint};
        `}
`
