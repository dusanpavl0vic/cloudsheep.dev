import { styled } from 'next-yak'

import { EASE_OUT, colors, media } from '@/styles/tokens.yak'
import { BRAND_SHADOWS } from '@/styles/tokens.yak'

export const Board = styled.div`
  position: relative;
  width: 100%;
  margin-top: 30px;
  padding: 48px 0;
`

export const Grid = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(to right, ${colors.line2} 0 1px, transparent 1px 128px),
    repeating-linear-gradient(to bottom, ${colors.line2} 0 1px, transparent 1px 128px);
  background-position: center;
  opacity: 0.7;
  mask-image: radial-gradient(ellipse 80% 75% at 50% 50%, black 35%, transparent 100%);
`

export const Rows = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
`

export const Row = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 24px;
`

export const Item = styled.li<{ $lift: number }>`
  translate: 0 ${({ $lift }) => `${String($lift)}px`};

  > * {
    outline: 1px solid ${colors.line2};
    transition:
      transform 0.4s ${EASE_OUT},
      box-shadow 0.4s;
  }

  ${media.hover} {
    > *:hover {
      transform: translateY(-8px) scale(1.08) rotate(-4deg);
      box-shadow: ${BRAND_SHADOWS.tileHover};
    }
  }
`
