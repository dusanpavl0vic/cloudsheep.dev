import { styled } from 'next-yak'

import { BRAND_COLORS } from '@/styles/tokens.yak'

export const Bar = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, ${BRAND_COLORS.deep}, ${BRAND_COLORS.blue}, ${BRAND_COLORS.sky});
  pointer-events: none;
`
