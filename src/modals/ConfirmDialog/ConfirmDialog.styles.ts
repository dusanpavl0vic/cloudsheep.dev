import { styled } from 'next-yak'

import { glassStrong } from '@/styles/mixins'
import { colors } from '@/styles/tokens.yak'

export const Body = styled.div`
  ${glassStrong};
  /* Dijalog je pun — tekst se ne meša sa sadržajem iza zamućene pozadine. */
  background: ${colors.card};
  border-radius: 20px;
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
