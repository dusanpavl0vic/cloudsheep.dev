'use client'

import styled from 'styled-components'

import { EASE_OUT } from '@/constants/layout'
import { BRAND_COLORS } from '@/constants/theme'

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
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.faint};
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
  height: ${({ $height, $grown }) => ($grown ? $height : 8)}%;
  background: ${({ $degraded }) =>
    $degraded ? BRAND_COLORS.sky : `linear-gradient(to top, ${BRAND_COLORS.deep}, ${BRAND_COLORS.blue})`};
  transition: height 0.8s ${EASE_OUT} ${({ $index }) => $index * 9}ms;

  @media (scripting: none) {
    height: ${({ $height }) => $height}%;
  }
`
