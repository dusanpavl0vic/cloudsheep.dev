import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const Author = styled.span`
  display: flex;
  flex-direction: column;
  font-weight: 600;

  small {
    font-weight: 400;
    font-size: 12.5px;
    color: ${colors.faint};
  }
`

export const Quote = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-width: 520px;
  color: ${colors.ink2};
`
