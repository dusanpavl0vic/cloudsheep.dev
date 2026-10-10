import { styled } from 'next-yak'

import { glassStrong } from '@/styles/mixins'
import { colors } from '@/styles/tokens.yak'

export const Root = styled.section`
  ${glassStrong};
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 22px 24px;
  border-radius: 18px;
`

export const Title = styled.h2`
  font-size: 18px;
  letter-spacing: -0.01em;
  color: ${colors.display};
`
