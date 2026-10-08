'use client'

import styled from 'styled-components'

import { BRAND_COLORS, BRAND_SHADOWS } from '@/constants/theme'

export const Root = styled.span<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
  border-radius: 22%;
  background: ${BRAND_COLORS.white};
  display: grid;
  place-items: center;
  box-shadow: ${BRAND_SHADOWS.tile};
`

export const Mark = styled.img<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  object-fit: contain;
`

export const Initials = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 700;
  color: ${BRAND_COLORS.deep};
`
