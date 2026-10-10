import { styled } from 'next-yak'

import { BRAND_SHADOWS, INVERSE, anim, fonts, media } from '@/styles/tokens.yak'

/** Kosa tamna traka koja nastavlja kosinu hero-a (dizajn: `rotate(-2deg)`, `margin: -58px -2%`). */
export const Root = styled.section`
  position: relative;
  z-index: 3;
  margin: -58px -2% 0;
  padding: 16px 0;
  transform: rotate(-2deg);
  background: ${INVERSE.surface};
  box-shadow: ${BRAND_SHADOWS.ribbon};
  overflow: hidden;
`

export const Track = styled.div`
  display: flex;
  width: max-content;
  animation: ${anim.marquee} 42s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`

export const List = styled.ul`
  display: flex;
`

export const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  font-family: ${fonts.heading};
  font-weight: 600;
  font-size: 15px;
  color: ${INVERSE.soft};
  white-space: nowrap;

  ${media.tablet} {
    gap: 12px;
    padding: 0 26px;
    font-size: 17px;
  }
`
