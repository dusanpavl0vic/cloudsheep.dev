import { styled } from 'next-yak'

import { resetButton } from '@/styles/mixins'
import { BRAND_COLORS, BRAND_SHADOWS, colors, fonts } from '@/styles/tokens.yak'

export const Stage = styled.div`
  position: relative;
  width: 100%;
  max-width: 1100px;
  margin-top: 30px;
  padding: 8px 16px 56px;
  display: grid;
  align-items: start;
  justify-items: center;
  overflow: hidden;
  perspective: 1400px;
`

export const Card = styled.div<{ $distance: number }>`
  position: relative;
  grid-area: 1 / 1;
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  transform-origin: top center;
  z-index: ${({ $distance }) => 20 - $distance};
  filter: ${({ $distance }) => ($distance === 0 ? 'none' : 'blur(1px)')};
  transition:
    transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.7s,
    filter 0.7s;
`

/** Bočna karta je prečica mišem; tastatura koristi strelice i tačke ispod. */
export const Pick = styled.button`
  ${resetButton};
  position: absolute;
  inset: 0;
  z-index: 1;
  cursor: pointer;
`

export const Person = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`

export const Avatar = styled.span`
  width: 84px;
  height: 84px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  overflow: hidden;
  background: ${BRAND_COLORS.ice};
  color: ${BRAND_COLORS.deep};
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 26px;
  box-shadow:
    0 0 0 3px ${colors.card},
    0 0 0 5px ${BRAND_COLORS.sky},
    ${BRAND_SHADOWS.avatar};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const Name = styled.span`
  font-family: ${fonts.heading};
  font-weight: 600;
  font-size: 20px;
  letter-spacing: -0.02em;
  color: ${colors.display};
`

export const Role = styled.span`
  font-family: ${fonts.mono};
  font-size: 13px;
  color: ${colors.ink2};
`
