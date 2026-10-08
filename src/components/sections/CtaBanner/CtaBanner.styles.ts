'use client'

import styled from 'styled-components'

import { BRAND_SHADOWS, INVERSE } from '@/constants/theme'

export const Wrap = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px ${({ theme }) => theme.spacing[5]}px 0;
`

export const Panel = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: clamp(40px, 7vw, 96px) clamp(24px, 5vw, 72px);
  border-radius: 34px;
  background: ${INVERSE.surface};
  color: ${INVERSE.soft};
  text-align: center;
  box-shadow: ${BRAND_SHADOWS.ctaBanner};
`

export const Glow = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse 60% 70% at 20% 0%, ${INVERSE.glowA}, transparent 65%),
    radial-gradient(ellipse 50% 60% at 90% 100%, ${INVERSE.glowB}, transparent 65%);
`

export const Dots = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(${INVERSE.dots} 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, black 100%);
`

export const Title = styled.h2`
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
  color: ${INVERSE.heading};
  text-wrap: balance;
`

export const Accent = styled.span`
  display: block;
  margin-top: 0.4em;
  color: ${INVERSE.accent};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
`
