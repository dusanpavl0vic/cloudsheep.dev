'use client'

import styled, { css } from 'styled-components'

import { EASE_OUT } from '@/constants/layout'
import { ACCENTS } from '@/constants/theme'

export const Root = styled.article<{ $interactive: boolean }>`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 30px;
  border-radius: ${({ theme }) => theme.radii.xl}px;
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: ${({ theme }) => theme.blur.soft};
  -webkit-backdrop-filter: ${({ theme }) => theme.blur.soft};
  border: 1px solid ${({ theme }) => theme.colors.edge};
  box-shadow:
    inset 0 1px 0 0 ${({ theme }) => theme.colors.spec},
    ${ACCENTS.cardShadow};
  transition:
    border-color 0.5s,
    box-shadow 0.5s,
    translate 0.5s ${EASE_OUT};

  ${({ $interactive, theme }) =>
    $interactive &&
    css`
      ${theme.media.hover} {
        &:hover {
          border-color: ${ACCENTS.hoverEdge};
          translate: 0 -4px;
          box-shadow:
            inset 0 1px 0 0 ${theme.colors.spec},
            ${ACCENTS.cardShadowHover};
        }
      }
    `}
`

/** Sjaj koji prati kursor — `PageEffects` postavlja `--gx`/`--gy` na `data-glow` element. */
export const Glow = styled.span`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: radial-gradient(circle 260px at var(--gx, -400px) var(--gy, -400px), ${ACCENTS.cardGlow} 0%, transparent 72%);
`

export const TopLine = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${ACCENTS.topLine}, transparent);
`

export const Number = styled.span`
  position: absolute;
  top: 14px;
  right: 22px;
  z-index: -1;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 700;
  font-size: 78px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.ink};
  opacity: 0.06;
`

export const Corner = styled.span<{ $side: 'left' | 'right' }>`
  position: absolute;
  bottom: 16px;
  ${({ $side }) => $side}: 16px;
  width: 12px;
  height: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line2};
  border-${({ $side }) => $side}: 1px solid ${({ theme }) => theme.colors.line2};
`

