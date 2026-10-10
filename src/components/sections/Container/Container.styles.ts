import { styled } from 'next-yak'

import { spacing } from '@/styles/tokens.yak'
export const Root = styled.div<{ $width: number }>`
  width: 100%;
  max-width: ${({ $width }) => `${String($width)}px`};
  margin: 0 auto;
  padding: 0 ${spacing[5]}px;
`
