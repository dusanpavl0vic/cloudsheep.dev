'use client'

import styled from 'styled-components'

import { BRAND_SHADOWS, INVERSE } from '@/constants/theme'
import { marquee } from '@/styles/keyframes'

/** Kosa tamna traka koja nastavlja kosinu hero-a (dizajn: `rotate(-2deg)`, `margin: -58px -2%`). */
export const Root = styled.section`
  position: relative;
  z-index: 3;
  margin: -58px -2% 0;
  padding: 16px 0;
  transform: rotate(-2deg);
  background: ${INVERSE.surface};
  box-shadow: ${BRAND_SHADOWS.ribbon};
  overflow: hidden;
`

export const Track = styled.div`
  display: flex;
  width: max-content;
  animation: ${marquee} 42s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`

export const List = styled.ul`
  display: flex;
`

export const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 26px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 600;
  font-size: 17px;
  color: ${INVERSE.soft};
  white-space: nowrap;
`
