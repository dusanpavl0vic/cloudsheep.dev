'use client'

import styled, { keyframes } from 'styled-components'

import { EASE_OUT } from '@/constants/layout'
import { THOUGHT } from '@/constants/theme'

import { RING } from './Hero.constants'


const close = keyframes`
  from { stroke-dashoffset: ${String(RING.circumference)}; }
  to { stroke-dashoffset: 0; }
`

export const Root = styled.div`
  position: relative;
  width: 54px;
  height: 54px;
`

export const Ring = styled.svg`
  transform: rotate(-90deg);
`

export const Arc = styled.circle`
  stroke-dasharray: ${RING.circumference};
  animation: ${close} 1.6s ${EASE_OUT} 1.3s backwards;
`

export const Value = styled.span`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 700;
  font-size: 17px;
  color: ${THOUGHT.ink};
`
