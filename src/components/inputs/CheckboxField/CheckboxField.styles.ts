import { styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const Root = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: ${colors.ink};
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    accent-color: ${colors.primary};
  }
`
