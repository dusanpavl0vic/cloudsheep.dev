import { css, styled } from 'next-yak'

import { EASE_OUT, colors, fonts } from '@/styles/tokens.yak'
import { BRAND_COLORS } from '@/styles/tokens.yak'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Legend = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.faint};
`

export const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 44px;
`

/** Pre ulaska u ekran 8 %; bez JS-a (`scripting: none`) odmah puna visina. */
export const Bar = styled.span<{ $height: number; $grown: boolean; $degraded: boolean; $index: number }>`
  flex: 1;
  border-radius: 2px;
  height: ${({ $height, $grown }) => `${String(($grown ? $height : 8))}%`};
  background: linear-gradient(to top, ${BRAND_COLORS.deep}, ${BRAND_COLORS.blue});
  ${({ $degraded }) =>
    $degraded &&
    css`
      background: ${BRAND_COLORS.sky};
    `}
  transition: height 0.8s ${EASE_OUT} ${({ $index }) => `${String($index * 9)}ms`};

  @media (scripting: none) {
    height: ${({ $height }) => `${String($height)}%`};
  }
`
