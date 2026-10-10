import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const Root = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 28px;
`

export const Title = styled.h1`
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  letter-spacing: -0.03em;
  color: ${colors.display};
`

export const Lead = styled.p`
  margin-top: 6px;
  font-size: 15px;
  color: ${colors.faint};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`
