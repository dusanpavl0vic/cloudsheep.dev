import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Status = styled.p`
  padding: 40px 0;
  text-align: center;
  color: ${colors.faint};
`
