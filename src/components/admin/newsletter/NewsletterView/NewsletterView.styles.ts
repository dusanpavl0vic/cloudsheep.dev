import { styled } from 'next-yak'

import { colors, fonts } from '@/styles/tokens.yak'

export const Email = styled.span`
  overflow-wrap: anywhere;
`

export const Lang = styled.span`
  font-family: ${fonts.mono};
  font-size: 12.5px;
  text-transform: uppercase;
`

export const Status = styled.p`
  padding: 40px 0;
  text-align: center;
  color: ${colors.faint};
`

export const Hint = styled.p`
  margin-top: 12px;
  font-size: 13.5px;
  color: ${colors.faint};
`
