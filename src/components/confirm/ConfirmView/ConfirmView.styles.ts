import { styled } from 'next-yak'

import { glassStrong } from '@/styles/mixins'
import { BRAND_COLORS, colors, fonts } from '@/styles/tokens.yak'

export const Root = styled.section`
  max-width: 640px;
  margin: 0 auto;
  padding: clamp(60px, 10vw, 120px) 20px;
`

export const Card = styled.div`
  ${glassStrong};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  padding: clamp(28px, 4vw, 44px);
  border-radius: 28px;
`

export const Mark = styled.span`
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${BRAND_COLORS.blue};
  color: ${BRAND_COLORS.white};
`

export const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: ${colors.display};
`

export const Body = styled.p`
  font-size: 17px;
  line-height: 1.6;
  color: ${colors.ink2};
`

export const Detail = styled.p`
  font-family: ${fonts.mono};
  font-size: 14px;
  color: ${colors.faint};
`

export const Form = styled.form`
  margin-top: 6px;
`
