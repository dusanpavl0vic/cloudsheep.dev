import { styled } from 'next-yak'

import { BRAND_SHADOWS, blur, colors, fonts, radii } from '@/styles/tokens.yak'

export const Stats = styled.div`
  width: 100%;
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 1px;
  background: ${colors.line};
  border: 1px solid ${colors.edge};
  border-radius: ${radii.xl}px;
  box-shadow: ${BRAND_SHADOWS.section};
  overflow: hidden;
`

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 24px;
  background: ${colors.glassStrong};
  backdrop-filter: ${blur.soft};
  -webkit-backdrop-filter: ${blur.soft};
`

export const Value = styled.span`
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: clamp(2.6rem, 4.5vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${colors.display};
`

export const Label = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.06em;
  color: ${colors.faint};
`
