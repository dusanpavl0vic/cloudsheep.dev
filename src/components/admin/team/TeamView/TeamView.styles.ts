import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const Person = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;

  img,
  i {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    background: ${colors.muted};
  }

  small {
    display: block;
    font-weight: 400;
    font-size: 12.5px;
    color: ${colors.faint};
  }
`

export const Actions = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`
