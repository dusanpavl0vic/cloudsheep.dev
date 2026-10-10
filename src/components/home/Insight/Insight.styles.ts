import { styled } from 'next-yak'

import { BRAND_SHADOWS, blur, colors, fonts, media, radii } from '@/styles/tokens.yak'

/** Četiri brojke: telefon 2×2, od tableta u jednom redu — `auto-fit` je na tabletu davao 3 + 1. */
export const Stats = styled.div`
  width: 100%;
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: ${colors.line};
  border: 1px solid ${colors.edge};
  border-radius: ${radii.xl}px;
  box-shadow: ${BRAND_SHADOWS.section};
  overflow: hidden;

  ${media.tablet} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 26px 10px;
  text-align: center;
  background: ${colors.glassStrong};
  backdrop-filter: ${blur.soft};
  -webkit-backdrop-filter: ${blur.soft};

  ${media.desktop} {
    padding: 32px 24px;
  }
`

export const Value = styled.span`
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: clamp(2rem, 4.5vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${colors.display};
`

export const Label = styled.span`
  font-family: ${fonts.mono};
  font-size: 11.5px;
  line-height: 1.4;
  letter-spacing: 0.04em;
  color: ${colors.faint};
`
