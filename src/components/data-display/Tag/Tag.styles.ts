import { css, styled } from 'next-yak'

import { colors, fonts } from '@/styles/tokens.yak'

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
  color: ${colors.ink};
  line-height: 1.2;
  white-space: nowrap;

  ${({ $variant }) =>
    $variant === 'code' &&
    css`
      padding: 6px 10px;
      background: ${colors.muted};
      font-family: ${fonts.mono};
      font-size: 12px;
    `}

  ${({ $variant }) =>
    $variant === 'soft' &&
    css`
      padding: 4px 9px 4px 6px;
      background: ${colors.muted};
      font-size: 12px;
    `}

  ${({ $variant }) =>
    $variant === 'outline' &&
    css`
      gap: 7px;
      padding: 6px 11px 6px 7px;
      border-radius: 9px;
      background: ${colors.card};
      border: 1px solid ${colors.line};
      font-size: 13px;
    `}
`

export const Logo = styled.img`
  object-fit: contain;
`
