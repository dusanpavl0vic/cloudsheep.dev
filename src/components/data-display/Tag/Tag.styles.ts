'use client'

import styled, { css } from 'styled-components'

export type TagVariant = 'code' | 'soft' | 'outline'

/**
 * `code` — mono, prigušena podloga (usluge) · `soft` — tehnologija na kartici liste ·
 * `outline` — tehnologija na istaknutom projektu (podloga kartice + ivica).
 */
export const Root = styled.span<{ $variant: TagVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 7px;
  color: ${({ theme }) => theme.colors.ink};
  line-height: 1.2;
  white-space: nowrap;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'code':
        return css`
          padding: 6px 10px;
          background: ${theme.colors.muted};
          font-family: ${theme.fonts.mono};
          font-size: 12px;
        `
      case 'soft':
        return css`
          padding: 4px 9px 4px 6px;
          background: ${theme.colors.muted};
          font-size: 12px;
        `
      case 'outline':
        return css`
          gap: 7px;
          padding: 6px 11px 6px 7px;
          border-radius: 9px;
          background: ${theme.colors.card};
          border: 1px solid ${theme.colors.line};
          font-size: 13px;
        `
    }
  }}
`

export const Logo = styled.img`
  object-fit: contain;
`
