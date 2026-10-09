import { keyframes, styled } from 'next-yak'

import { glassStrong } from '@/styles/mixins'
import { EASE_OUT, colors, fonts } from '@/styles/tokens.yak'
import { BRAND_COLORS, BRAND_SHADOWS } from '@/styles/tokens.yak'


const quoteIn = keyframes`
  from { opacity: 0; transform: translateY(14px); filter: blur(6px); }
  to { opacity: 1; transform: none; filter: blur(0); }
`

export const Panel = styled.figure`
  ${glassStrong};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: clamp(28px, 5vw, 64px);
  border-radius: 30px;
  box-shadow:
    inset 0 1px 0 0 ${colors.spec},
    ${BRAND_SHADOWS.testimonial};
`

export const Mark = styled.span`
  position: absolute;
  top: -30px;
  right: 24px;
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 260px;
  line-height: 1;
  color: ${BRAND_COLORS.blue};
  opacity: 0.1;
  pointer-events: none;
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`

export const Eyebrow = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${colors.accent};
`

/** `key` na citatu ga remontira pri promeni — animacija ulaska se ponavlja bez JS-a za animaciju. */
export const Quote = styled.blockquote`
  min-height: 3.7em;
  font-family: ${fonts.heading};
  font-weight: 500;
  font-size: clamp(24px, 3.2vw, 40px);
  line-height: 1.22;
  letter-spacing: -0.02em;
  color: ${colors.display};
  text-wrap: pretty;
  animation: ${quoteIn} 0.7s ${EASE_OUT};
`

export const Author = styled.figcaption`
  display: flex;
  align-items: center;
  gap: 14px;
`

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`

export const Who = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const Name = styled.span`
  font-weight: 700;
  font-size: 17px;
  color: ${colors.display};
`

export const Role = styled.span`
  font-size: 15px;
  color: ${colors.faint};
`
