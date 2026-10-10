import { styled } from 'next-yak'

import { EASE_OUT, anim, colors, fonts } from '@/styles/tokens.yak'

export const Root = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(60px, 8vw, 100px) 20px;
`

export const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Eyebrow = styled.span`
  font-family: ${fonts.mono};
  font-size: 12px;
  letter-spacing: 0.16em;
  color: ${colors.accent};
`

export const Title = styled.h1`
  font-size: clamp(2.6rem, 6vw, 4.8rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
  color: ${colors.display};
  animation: ${anim.slideUp} 0.9s ${EASE_OUT} backwards;
`

export const Muted = styled.span`
  color: ${colors.faint};
`

export const Lead = styled.p`
  max-width: 460px;
  font-size: 18px;
  line-height: 1.55;
  color: ${colors.ink2};
`

export const Reach = styled.p`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 16px;

  a {
    color: ${colors.accent};
    font-weight: 600;
  }

  span {
    color: ${colors.faint};
  }
`
