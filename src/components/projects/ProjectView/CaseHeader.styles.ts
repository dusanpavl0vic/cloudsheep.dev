'use client'

import styled from 'styled-components'

import { EASE_OUT } from '@/constants/layout'
import { fadeUp } from '@/styles/keyframes'

export const Meta = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
`

export const Title = styled.h1`
  font-size: clamp(3rem, 8vw, 6.4rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
  color: ${({ theme }) => theme.colors.display};
  animation: ${fadeUp} 0.9s ${EASE_OUT} backwards;
`

export const Summary = styled.p`
  max-width: 760px;
  font-size: clamp(1.1rem, 1.8vw, 1.4rem);
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.ink2};
`

export const Metrics = styled.dl`
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 1px;
  background: ${({ theme }) => theme.colors.line};
  border: 1px solid ${({ theme }) => theme.colors.edge};
  border-radius: 22px;
  overflow: hidden;
`

export const Metric = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 6px;
  padding: 26px;
  background: ${({ theme }) => theme.colors.glassStrong};
  backdrop-filter: ${({ theme }) => theme.blur.soft};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.soft};

  dt {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.ink2};
  }

  dd {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 700;
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    letter-spacing: -0.04em;
    color: ${({ theme }) => theme.colors.accent};
  }
`
