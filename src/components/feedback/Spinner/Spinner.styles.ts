import { styled } from 'next-yak'

import { anim } from '@/styles/tokens.yak'

export const Root = styled.span<{ $size: number }>`
  display: inline-block;
  width: ${({ $size }) => `${String($size)}px`};
  height: ${({ $size }) => `${String($size)}px`};
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: ${anim.spin} 0.7s linear infinite;
`
