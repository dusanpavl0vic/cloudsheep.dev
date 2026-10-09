import { styled } from 'next-yak'

import { BRAND_COLORS } from '@/styles/tokens.yak'

/** Bez slike ostaje gradijent marke — kartica ne izgleda „pokvareno". */
export const Frame = styled.div<{ $ratio: string; $radius: number }>`
  position: relative;
  aspect-ratio: ${({ $ratio }) => $ratio};
  border-radius: ${({ $radius }) => `${String($radius)}px`};
  overflow: hidden;
  background: linear-gradient(135deg, ${BRAND_COLORS.ice}, ${BRAND_COLORS.sky});
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
