import { css, styled } from 'next-yak'

import Slot from '@/components/foundations/Slot'
import { typographyDisplay } from '@/styles/mixins'
import { colors, fonts, spacing } from '@/styles/tokens.yak'

export const Root = styled.header<{ $align: 'left' | 'center' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => ($align === 'center' ? 'center' : 'flex-start')};
  gap: ${spacing[4]}px;
  text-align: ${({ $align }) => $align};
`

export const Eyebrow = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${colors.accent};
`

export const Title = styled(Slot)`
  ${typographyDisplay};
  text-wrap: balance;
`

export const Muted = styled.span`
  color: ${colors.faint};
`

/** `statement` — krupna izjava (Studio) · `body` — običan uvod (Insight, Stack). */
export const Lead = styled.p<{ $tone: 'statement' | 'body' }>`
  ${({ $tone }) =>
    $tone === 'statement'
      ? css`
          max-width: 680px;
          font-family: ${fonts.heading};
          font-size: clamp(1.2rem, 2vw, 1.5rem);
          line-height: 1.4;
          color: ${colors.ink};
        `
      : css`
          max-width: 560px;
          font-size: 18px;
          line-height: 1.6;
          color: ${colors.ink2};
        `}
`
