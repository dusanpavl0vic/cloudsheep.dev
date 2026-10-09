import { styled } from 'next-yak'

import { EASE_OUT, anim, fonts } from '@/styles/tokens.yak'
import { BRAND_COLORS, BRAND_SHADOWS, INVERSE } from '@/styles/tokens.yak'

export const Root = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: min(340px, 86vw);
  margin-top: 22px;
  padding: 10px 16px;
  border-radius: 12px;
  background: ${INVERSE.surface};
  color: ${INVERSE.soft};
  font-family: ${fonts.mono};
  font-size: clamp(12px, 1.4vw, 14px);
  box-shadow: ${BRAND_SHADOWS.terminal};
  animation: ${anim.fadeUp} 0.9s ${EASE_OUT} 0.85s backwards;
`

export const Prompt = styled.span`
  color: ${BRAND_COLORS.sky};
`

/** Visina reda se drži i kad je tekst prazan (između fraza) — dugmad ispod ne skaču. */
export const Text = styled.span`
  min-height: 1.5em;
  white-space: pre;
`

export const Caret = styled.span`
  display: inline-block;
  width: 8px;
  height: 1.1em;
  margin-left: -4px;
  background: ${BRAND_COLORS.sky};
  animation: ${anim.blink} 1s steps(1) infinite;
`
