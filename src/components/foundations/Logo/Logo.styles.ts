'use client'

import styled, { css } from 'styled-components'

import { INVERSE } from '@/constants/theme'
import { bob } from '@/styles/keyframes'
import { gradientText } from '@/styles/mixins'

import type { LogoTone } from './Logo.types'

export const Root = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 9px;
`

export const Mark = styled.img<{ $animated: boolean }>`
  display: block;
  ${({ $animated }) =>
    $animated &&
    css`
      animation: ${bob} 4s ease-in-out infinite;
    `}
`

export const Word = styled.span<{ $tone: LogoTone }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.03em;
  color: ${({ theme, $tone }) => ($tone === 'inverse' ? INVERSE.heading : theme.colors.wordmark)};
`

export const Tld = styled.span<{ $tone: LogoTone }>`
  ${({ $tone }) =>
    $tone === 'inverse'
      ? css`
          color: ${INVERSE.accent};
        `
      : gradientText}
`
