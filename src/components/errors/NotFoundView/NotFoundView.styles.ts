import { styled } from 'next-yak'

import { typographyDisplay, typographyEyebrow, typographyLead } from '@/styles/mixins'
import { colors, spacing } from '@/styles/tokens.yak'

export const Root = styled.section`
  min-height: 70vh;
  display: grid;
  place-content: center;
  gap: ${spacing[4]}px;
  padding: ${spacing[20]}px ${spacing[5]}px;
  text-align: center;
`

export const Eyebrow = styled.p`
  ${typographyEyebrow};
  color: ${colors.accent};
`

export const Title = styled.h1`
  ${typographyDisplay};
`

export const Body = styled.p`
  ${typographyLead};
  color: ${colors.ink2};
`
