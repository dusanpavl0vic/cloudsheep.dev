'use client'

import styled from 'styled-components'

import { BRAND_SHADOWS } from '@/constants/theme'

export const Stats = styled.div`
  width: 100%;
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 1px;
  background: ${({ theme }) => theme.colors.line};
  border: 1px solid ${({ theme }) => theme.colors.edge};
  border-radius: ${({ theme }) => theme.radii.xl}px;
  box-shadow: ${BRAND_SHADOWS.section};
  overflow: hidden;
`

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 24px;
  background: ${({ theme }) => theme.colors.glassStrong};
  backdrop-filter: ${({ theme }) => theme.blur.soft};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.soft};
`

export const Value = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 700;
  font-size: clamp(2.6rem, 4.5vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.display};
`

export const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.faint};
`

export const Uptime = styled.div`
  width: 100%;
  margin-top: 14px;
  padding: 22px 24px;
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: ${({ theme }) => theme.colors.glass};
  border: 1px solid ${({ theme }) => theme.colors.edge};
  backdrop-filter: ${({ theme }) => theme.blur.soft};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.soft};
  text-align: left;
`
