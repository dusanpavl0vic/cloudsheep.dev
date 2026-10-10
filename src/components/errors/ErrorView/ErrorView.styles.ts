import { styled } from 'next-yak'

import { focusRing, resetButton, typographyBody, typographyH2 } from '@/styles/mixins'
import { buttonHeights, colors, radii, spacing } from '@/styles/tokens.yak'

export const Root = styled.section`
  min-height: 60vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: ${spacing[4]}px;
  padding: ${spacing[20]}px ${spacing[5]}px;
  text-align: center;
`

export const Title = styled.h1`
  ${typographyH2};
`

export const Body = styled.p`
  ${typographyBody};
  color: ${colors.ink2};
`

export const Retry = styled.button`
  ${resetButton};
  ${focusRing};
  height: ${buttonHeights.m}px;
  padding: 0 ${spacing[5]}px;
  border-radius: ${radii.base}px;
  background: ${colors.primary};
  color: ${colors.onPrimary};
  font-weight: 600;
`
