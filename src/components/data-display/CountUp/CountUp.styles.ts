import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'
export const Root = styled.span`
  font-variant-numeric: tabular-nums;
`

export const Suffix = styled.span`
  color: ${colors.accent};
`
