'use client'

import styled, { css } from 'styled-components'

import { EASE_OUT, HEADER_HEIGHT } from '@/constants/layout'
import { BRAND_COLORS, BRAND_SHADOWS } from '@/constants/theme'

import { PIN_HEIGHT_VH } from './Process.constants'

/** Bez JS-a i uz smanjeno kretanje: obična lista karata, bez kačenja. */
const staticLayout = (rules: ReturnType<typeof css>) => css`
  @media (scripting: none), (prefers-reduced-motion: reduce) {
    ${rules}
  }
`

export const Root = styled.section`
  position: relative;
  height: ${PIN_HEIGHT_VH}vh;
  ${staticLayout(css`
    height: auto;
  `)}
`

export const Sticky = styled.div`
  position: sticky;
  top: ${HEADER_HEIGHT}px;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  min-height: 560px;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(24px, 4vh, 48px) ${({ theme }) => theme.spacing[5]}px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 28px 64px;
  align-items: center;
  ${staticLayout(css`
    position: static;
    height: auto;
    padding-block: clamp(60px, 8vw, 110px);
  `)}
`

export const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`

export const Steps = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
`

export const Step = styled.li`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  opacity: 0.4;
  transition:
    opacity 0.4s,
    transform 0.4s ${EASE_OUT};
  ${staticLayout(css`
    opacity: 1;
  `)}
`

export const StepIndex = styled.span<{ $tone: string }>`
  width: 34px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  font-weight: 600;
  color: ${({ $tone }) => $tone};
`

export const StepTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 600;
  font-size: clamp(18px, 2vw, 22px);
  color: ${({ theme }) => theme.colors.display};
`

export const Progress = styled.div`
  position: relative;
  max-width: 360px;
  height: 3px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.line};
  ${staticLayout(css`
    display: none;
  `)}
`

export const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, ${BRAND_COLORS.deep}, ${BRAND_COLORS.blue}, ${BRAND_COLORS.sky});
  box-shadow: ${BRAND_SHADOWS.progress};
`

export const Deck = styled.ol`
  position: relative;
  height: min(440px, 52vh);
  min-height: 340px;
  ${staticLayout(css`
    height: auto;
    display: grid;
    gap: 18px;
  `)}
`

export const Card = styled.li<{ $tone: string; $layer: number }>`
  position: absolute;
  inset: 0;
  z-index: ${({ $layer }) => $layer};
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: clamp(26px, 3.5vw, 44px);
  border-radius: 28px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.glassStrong};
  backdrop-filter: ${({ theme }) => theme.blur.strong};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.strong};
  border: 1px solid ${({ theme }) => theme.colors.edge};
  box-shadow:
    inset 0 1px 0 0 ${({ theme }) => theme.colors.spec},
    ${BRAND_SHADOWS.deck};
  transform-origin: top center;
  will-change: transform, opacity;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 5px;
    background: linear-gradient(90deg, ${({ $tone }) => $tone}, ${BRAND_COLORS.sky});
  }

  ${staticLayout(css`
    position: relative;
    inset: auto;
    min-height: 300px;
  `)}
`

export const BigNumber = styled.span<{ $tone: string }>`
  position: absolute;
  right: 24px;
  bottom: -30px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 700;
  font-size: 200px;
  line-height: 1;
  letter-spacing: -0.06em;
  color: ${({ $tone }) => $tone};
  opacity: 0.08;
`

export const CardIndex = styled.span<{ $tone: string }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  font-weight: 600;
  color: ${({ $tone }) => $tone};
`

export const CardTitle = styled.h3`
  font-size: clamp(2rem, 4vw, 3.2rem);
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.display};
`

export const CardText = styled.p`
  flex: 1;
  max-width: 40ch;
  font-size: clamp(16px, 1.5vw, 19px);
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.ink2};
`

export const Meta = styled.span`
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: 9px;
  background: ${({ theme }) => theme.colors.muted};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.ink};
`
