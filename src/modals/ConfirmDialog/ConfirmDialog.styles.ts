import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 420px;
  padding: 28px;
`

export const Message = styled.p`
  font-size: 17px;
  line-height: 1.5;
  color: ${colors.ink};
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`
