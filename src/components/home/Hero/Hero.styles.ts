import { css, styled } from 'next-yak'

import Button from '@/components/buttons/Button'
import { focusRing, glassStrong } from '@/styles/mixins'
import { EASE_OUT, HEADER_HEIGHT, anim, blur, colors, fonts, radii, spacing } from '@/styles/tokens.yak'
import { BRAND_COLORS, GLOW } from '@/styles/tokens.yak'

export const Root = styled.section`
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  margin-top: -${HEADER_HEIGHT}px;
  padding: 170px ${spacing[5]}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
`

/** Staklena površina koja se završava kosinom — nastavlja je traka tehnologija. */
export const Slant = styled.span`
  position: absolute;
  inset: 0;
  z-index: -3;
  background: ${colors.glass};
  backdrop-filter: ${blur.soft};
  -webkit-backdrop-filter: ${blur.soft};
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 52px), 0 100%);
`

export const Dots = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background-image: radial-gradient(${colors.line2} 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.6;
  mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, transparent 35%, black 100%);
`

/** `--mx`/`--my` postavlja `PageEffects` (hero kursor). */
export const CursorGlow = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: radial-gradient(circle 360px at var(--mx, -600px) var(--my, -600px), ${GLOW.hero} 0%, transparent 70%);
`

export const Spine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  z-index: -1;
  width: 1px;
  height: 40%;
  background: linear-gradient(to bottom, transparent, ${colors.accent}, transparent);
  opacity: 0.5;
`

export const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  will-change: transform;
`

export const Badge = styled.p`
  ${glassStrong};
  animation: ${anim.fadeUp} 0.9s ${EASE_OUT} 0.05s backwards;
  margin-bottom: 16px;
  padding: 7px 16px;
  border-radius: ${radii.pill}px;
  font-family: ${fonts.mono};
  font-size: clamp(13px, 1.4vw, 15px);
  font-weight: 600;
  color: ${colors.wordmark};
`

export const BadgeTld = styled.span`
  color: ${BRAND_COLORS.blue};
`

export const Title = styled.h1`
  font-size: clamp(2.9rem, 8.5vw, 7rem);
  line-height: 0.98;
  font-weight: 700;
  letter-spacing: -0.05em;
  color: ${colors.display};
`

export const Line = styled.span<{ $muted?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 0.24em;
  ${({ $muted }) =>
    $muted &&
    css`
      color: ${colors.faint};
    `}
`

export const WordMask = styled.span`
  display: inline-block;
  overflow: hidden;
  padding: 0 0.04em 0.14em;
  margin-bottom: -0.14em;
`

export const Word = styled.span<{ $delay: number }>`
  display: inline-block;
  animation: ${anim.rise} 1.1s ${EASE_OUT} ${({ $delay }) => `${String($delay)}s`} backwards;
`

export const Highlight = styled.span`
  background: linear-gradient(90deg, ${BRAND_COLORS.deep}, ${BRAND_COLORS.blue}, ${BRAND_COLORS.sky}, ${BRAND_COLORS.blue}, ${BRAND_COLORS.deep});
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${anim.gradientShift} 7s linear infinite;
`

export const Underline = styled.svg`
  width: min(340px, 60vw);
  height: 18px;
  margin-top: 10px;
  overflow: visible;

  path {
    stroke-dasharray: 420;
    animation: ${anim.draw} 1.4s cubic-bezier(0.65, 0, 0.35, 1) 1.1s backwards;
  }
`

export const Description = styled.p`
  /* LCP element: animacija bez opacity — inače se LCP broji tek kad animacija otkrije tekst. */
  animation: ${anim.slideUp} 0.9s ${EASE_OUT} 0.7s backwards;
  max-width: 620px;
  margin-top: 22px;
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  line-height: 1.6;
  color: ${colors.ink2};
  text-wrap: pretty;
`

export const Actions = styled.div`
  animation: ${anim.fadeUp} 0.9s ${EASE_OUT} 1s backwards;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: 28px;
`

/** Glavni CTA sa odsjajem koji prelazi preko dugmeta (dizajn: `csShine`). */
export const ShinyButton = styled(Button)`
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -60%;
    width: 40%;
    height: 100%;
    background: linear-gradient(120deg, transparent, ${GLOW.shine}, transparent);
    transform: skewX(-20deg);
    animation: ${anim.shine} 4.5s ease-in-out 2s infinite;
  }
`

export const GlassButton = styled(Button)`
  ${glassStrong};
`

export const ScrollHint = styled.a`
  ${focusRing};
  position: absolute;
  bottom: 72px;
  left: 50%;
  z-index: 2;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-family: ${fonts.mono};
  font-size: 11px;
  letter-spacing: 0.16em;
  color: ${colors.faint};

  &:hover {
    color: ${colors.accent};
  }

  svg {
    animation: ${anim.hint} 1.8s ease-in-out infinite;
  }
`
