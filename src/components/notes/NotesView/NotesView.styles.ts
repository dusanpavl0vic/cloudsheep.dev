import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 22px;
`

export const Empty = styled.p`
  padding: 48px 0;
  text-align: center;
  color: ${colors.faint};
`
