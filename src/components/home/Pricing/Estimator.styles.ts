'use client'

import styled from 'styled-components'

import { EASE_OUT } from '@/constants/layout'
import { BRAND_SHADOWS, INVERSE } from '@/constants/theme'
import { glass } from '@/styles/mixins'

export const Panel = styled.div`
  ${glass('strong')};
  margin-top: 20px;
  padding: clamp(24px, 4vw, 48px);
  border-radius: 28px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 40px;
  box-shadow:
    inset 0 1px 0 0 ${({ theme }) => theme.colors.spec},
    ${BRAND_SHADOWS.estimator};
`

export const Questions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Eyebrow = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${({ theme }) => theme.colors.accent};
`

export const Title = styled.h3`
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  letter-spacing: -0.035em;
  color: ${({ theme }) => theme.colors.display};
`

export const Muted = styled.span`
  color: ${({ theme }) => theme.colors.faint};
`

export const Group = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 0;
  padding: 0;
  margin: 0;
`

export const Legend = styled.legend`
  margin-bottom: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.faint};
`

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const Result = styled.div`
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  border-radius: 22px;
  background: ${INVERSE.surface};
  color: ${INVERSE.soft};
  box-shadow: ${BRAND_SHADOWS.estimateResult};
`

export const ResultLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${INVERSE.accent};
`

export const Range = styled.output`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 700;
  font-size: clamp(3rem, 6vw, 4.6rem);
  line-height: 1;
  letter-spacing: -0.045em;
  color: ${INVERSE.heading};
`

export const Unit = styled.span`
  font-size: 0.36em;
  letter-spacing: 0;
  color: ${INVERSE.accent};
`

export const Bar = styled.div`
  display: flex;
  gap: 2px;
  height: 14px;
  border-radius: 7px;
  overflow: hidden;
  background: ${INVERSE.wash};
`

export const Segment = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color};
  transition: width 0.6s ${EASE_OUT};
`

export const PhaseLegend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  font-size: 13px;
  color: ${INVERSE.text};
`

export const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const Swatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
  outline: 1px solid ${INVERSE.lineStrong};
`

export const Facts = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  padding-top: 16px;
  border-top: 1px solid ${INVERSE.line};
`

export const Fact = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  dt {
    font-size: 13px;
    color: ${INVERSE.accent};
  }

  dd {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 700;
    font-size: 20px;
  }
`

export const Note = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: ${INVERSE.faint};
`
