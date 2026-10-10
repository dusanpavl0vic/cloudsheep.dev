import { styled } from 'next-yak'

import { BRAND_COLORS, BRAND_SHADOWS, fonts } from '@/styles/tokens.yak'

export const Root = styled.span<{ $size: number }>`
  width: ${({ $size }) => `${String($size)}px`};
  height: ${({ $size }) => `${String($size)}px`};
  flex-shrink: 0;
  border-radius: 22%;
  background: ${BRAND_COLORS.white};
  display: grid;
  place-items: center;
  box-shadow: ${BRAND_SHADOWS.tile};
`

export const Mark = styled.img<{ $size: number }>`
  width: ${({ $size }) => `${String($size)}px`};
  height: ${({ $size }) => `${String($size)}px`};
  object-fit: contain;
`

export const Initials = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  font-weight: 700;
  color: ${BRAND_COLORS.deep};
`
