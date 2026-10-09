'use client'

import styled, { css } from 'styled-components'

import { EASE_OUT } from '@/constants/layout'
import { BRAND_COLORS, BRAND_SHADOWS, INVERSE } from '@/constants/theme'

export const Plans = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 18px;
  align-items: center;
  margin-top: 44px;
`

/** Istaknut paket je tamna površina podignuta za 12 px (dizajn). */
export const Plan = styled.li<{ $featured: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 32px 28px;
  border-radius: 24px;
  box-shadow: ${BRAND_SHADOWS.panel};
  transition: transform 0.4s ${EASE_OUT};

  ${({ $featured, theme }) =>
    $featured
      ? css`
          translate: 0 -12px;
          background: ${INVERSE.surface};
          color: ${INVERSE.soft};
          border: 1px solid ${BRAND_COLORS.deep};
        `
      : css`
          background: ${theme.colors.glassStrong};
          color: ${theme.colors.ink};
          border: 1px solid ${theme.colors.edge};
          backdrop-filter: ${theme.blur.soft};
          -webkit-backdrop-filter: ${theme.blur.soft};
        `}

  ${({ theme }) => theme.media.hover} {
    &:hover {
      transform: translateY(-6px);
    }
  }
`

export const Badge = styled.span`
  position: absolute;
  top: -13px;
  left: 28px;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.pill}px;
  background: linear-gradient(90deg, ${BRAND_COLORS.blue}, ${BRAND_COLORS.sky});
  color: ${BRAND_COLORS.night};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
`

export const Name = styled.h3`
  font-size: 24px;
  letter-spacing: -0.02em;
  color: inherit;
`

export const Price = styled.span<{ $featured: boolean }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  color: ${({ $featured, theme }) => ($featured ? INVERSE.accent : theme.colors.faint)};
`

export const Description = styled.p`
  font-size: 15.5px;
  line-height: 1.55;
  opacity: 0.9;
`

export const Rule = styled.span`
  height: 1px;
  background: currentColor;
  opacity: 0.12;
`

export const Features = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 11px;
`

export const Feature = styled.li`
  display: flex;
  gap: 10px;
  font-size: 15px;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: ${BRAND_COLORS.blue};
  }
`
