'use client'

import styled, { css } from 'styled-components'

import { typography } from '@/styles/mixins'

export const Root = styled.header<{ $align: 'left' | 'center' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => ($align === 'center' ? 'center' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing[4]}px;
  text-align: ${({ $align }) => $align};
`

export const Eyebrow = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${({ theme }) => theme.colors.accent};
`

export const Title = styled.h2`
  ${typography('display')};
  text-wrap: balance;
`

export const Muted = styled.span`
  color: ${({ theme }) => theme.colors.faint};
`

/** `statement` — krupna izjava (Studio) · `body` — običan uvod (Insight, Stack). */
export const Lead = styled.p<{ $tone: 'statement' | 'body' }>`
  ${({ $tone, theme }) =>
    $tone === 'statement'
      ? css`
          max-width: 680px;
          font-family: ${theme.fonts.heading};
          font-size: clamp(1.2rem, 2vw, 1.5rem);
          line-height: 1.4;
          color: ${theme.colors.ink};
        `
      : css`
          max-width: 560px;
          font-size: 18px;
          line-height: 1.6;
          color: ${theme.colors.ink2};
        `}
`
