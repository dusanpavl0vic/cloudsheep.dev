import { keyframes, styled } from 'next-yak'

import { EASE_OUT, fonts } from '@/styles/tokens.yak'
import { THOUGHT } from '@/styles/tokens.yak'

import { RING } from './ScoreRing.yak'


const close = keyframes`
  from { stroke-dashoffset: ${RING.circumference}; }
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
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 17px;
  color: ${THOUGHT.ink};
`
