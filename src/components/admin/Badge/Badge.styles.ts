import { css, styled } from 'next-yak'

import { colors, fonts } from '@/styles/tokens.yak'

export type BadgeTone = 'neutral' | 'success' | 'danger' | 'accent'

export const Root = styled.span<{ $tone: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  font-family: ${fonts.mono};
  font-size: 11.5px;
  font-weight: 600;
  white-space: nowrap;
  background: ${colors.muted};
  color: ${colors.ink2};

  ${({ $tone }) =>
    $tone === 'success' &&
    css`
      color: ${colors.success};
    `}
  ${({ $tone }) =>
    $tone === 'danger' &&
    css`
      color: ${colors.danger};
    `}
  ${({ $tone }) =>
    $tone === 'accent' &&
    css`
      color: ${colors.accent};
    `}
`
