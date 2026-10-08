'use client'

import styled, { css } from 'styled-components'

import { EASE_OUT } from '@/constants/layout'
import { BRAND_COLORS, BRAND_SHADOWS, THOUGHT } from '@/constants/theme'
import { drift, fill, popIn } from '@/styles/keyframes'

/** Oblaci se prikazuju tek od 1200 px — na užem ekranu bi prekrili naslov. */
export const Layer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  display: none;
  pointer-events: none;

  ${({ theme }) => theme.media.wide} {
    display: block;
  }
`

/** Spoljni sloj nosi položaj i parallax (`data-depth` → transform iz `PageEffects`). */
export const Anchor = styled.div`
  position: absolute;
  transition: transform 0.9s ${EASE_OUT};
`

export const Float = styled.div<{ $rotate: string; $driftS: number; $offsetS: number }>`
  rotate: ${({ $rotate }) => $rotate};
  animation: ${drift} ${({ $driftS }) => $driftS}s ease-in-out ${({ $offsetS }) => $offsetS}s infinite alternate;
`

export const Card = styled.div<{ $note: boolean; $delay: number }>`
  position: relative;
  padding: 18px 20px;
  border-radius: ${({ theme }) => theme.radii.lg}px;
  background: ${({ $note }) => ($note ? THOUGHT.note : THOUGHT.card)};
  border: 1px solid ${THOUGHT.edge};
  box-shadow: ${BRAND_SHADOWS.thought};
  color: ${THOUGHT.ink};
  text-align: left;
  animation: ${popIn} 0.6s cubic-bezier(0.2, 0.8, 0.3, 1) ${({ $delay }) => $delay}s backwards;
`

export const Note = styled.p`
  max-width: 232px;
  font-size: 13.5px;
  line-height: 1.4;
`

export const Label = styled.p<{ $center?: boolean }>`
  margin-bottom: 10px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${THOUGHT.text};
  ${({ $center }) =>
    $center &&
    css`
      text-align: center;
    `}
`

export const Task = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
`

export const TaskName = styled.span`
  flex: 1;
  font-size: 12.5px;
  color: ${THOUGHT.text};
`

export const Track = styled.span`
  width: 64px;
  height: 6px;
  border-radius: 3px;
  background: ${THOUGHT.track};
  overflow: hidden;
`

export const Fill = styled.span<{ $width: string; $tone: 'deep' | 'blue' }>`
  display: block;
  height: 100%;
  width: ${({ $width }) => $width};
  border-radius: 3px;
  background: ${({ $tone }) => ($tone === 'deep' ? BRAND_COLORS.deep : BRAND_COLORS.blue)};
  animation: ${fill} 1.6s ${EASE_OUT} 1.6s backwards;
`

export const Status = styled.span`
  font-size: 13px;
  font-weight: 600;
`

export const Meta = styled.p`
  margin-top: 4px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  color: ${THOUGHT.text};
`

export const Score = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`

export const Tiles = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  min-width: 188px;
`
