import { styled } from 'next-yak'

import { EASE_OUT, anim, colors, fonts } from '@/styles/tokens.yak'
import { DIPLOMA } from '@/styles/tokens.yak'

/** Diploma je papir: uvek svetla, i u tamnoj temi (dizajn). */
export const Paper = styled.div`
  position: relative;
  isolation: isolate;
  width: 100%;
  max-width: 520px;
  padding: 30px 34px;
  border-radius: 3px;
  background: ${DIPLOMA.paper};
  color: ${DIPLOMA.ink};
  text-align: left;
  rotate: -0.6deg;
  box-shadow: ${DIPLOMA.shadow};
  animation: ${anim.fadeUp} 0.7s ${EASE_OUT} 0.1s backwards;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 3px;
    background-image: radial-gradient(${DIPLOMA.grain} 0.5px, transparent 0.5px);
    background-size: 6px 6px;
  }
`

export const Frame = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 26px 26px 24px;
  border: 1px solid ${DIPLOMA.frame};
`

export const University = styled.span`
  font-family: ${fonts.mono};
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${DIPLOMA.soft};
`

export const Degree = styled.h3`
  font-size: clamp(1rem, 2.4vw, 1.35rem);
  line-height: 1.2;
  text-wrap: balance;
  color: ${DIPLOMA.ink};
`

export const Programme = styled.p`
  font-size: 14px;
  line-height: 1.35;
`

export const Rule = styled.span`
  margin-top: 4px;
  height: 1px;
  width: 100%;
  background: ${DIPLOMA.frame};
`

export const Place = styled.p`
  padding-right: 5.25rem;
  font-family: ${fonts.mono};
  font-size: 11.5px;
  line-height: 1.6;
  color: ${DIPLOMA.soft};
`

export const Seal = styled.img`
  position: absolute;
  right: -10px;
  bottom: -14px;
  width: 104px;
  height: 104px;
  object-fit: contain;
  rotate: -11deg;
  opacity: 0.85;
  mix-blend-mode: multiply;
`

export const Empty = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 15rem;
  padding: 0 24px;
  border-radius: 14px;
  border: 1px dashed ${colors.line2};
  font-family: ${fonts.mono};
  font-size: 12.5px;
  color: ${colors.faint};
`
