import { styled } from 'next-yak'

import { blur, colors } from '@/styles/tokens.yak'
import { GLOW } from '@/styles/tokens.yak'

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
  background-image: radial-gradient(
    circle 360px at var(--mx, -600px) var(--my, -600px),
    ${GLOW.hero} 0%,
    transparent 70%
  );
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
