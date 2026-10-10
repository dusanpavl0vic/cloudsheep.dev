import { styled } from 'next-yak'

import { BRAND_COLORS, BRAND_SHADOWS, colors, fonts, media } from '@/styles/tokens.yak'

/** Telefon: jedna kolona · od tableta 2×2 (`minmax(440px)` je tablet ostavljao u jednoj koloni). */
export const Grid = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 8px;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
    margin-top: 40px;
  }
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`

export const IconTile = styled.span`
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 22%;
  background: ${BRAND_COLORS.white};
  box-shadow: ${BRAND_SHADOWS.tile};

  img {
    width: 24px;
    height: 24px;
  }
`

export const Slug = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${colors.faint};
`

export const Title = styled.h3`
  margin-top: 18px;
  font-weight: 600;
  font-size: 22px;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: ${colors.display};
`

export const Description = styled.p`
  max-width: 46ch;
  margin-top: 10px;
  font-size: 15.5px;
  line-height: 1.6;
  color: ${colors.ink2};
`

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 18px;
`
