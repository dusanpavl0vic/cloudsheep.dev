'use client'

import { keyframes } from 'styled-components'

/** Animacije iz dizajna. `prefers-reduced-motion` ih gasi globalno (GlobalStyles). */
export const bob = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-3px) rotate(-4deg); }
`

export const drift = keyframes`
  from { translate: 0 -6px; }
  to { translate: 0 6px; }
`

export const popIn = keyframes`
  from { opacity: 0; scale: .92; translate: 0 14px; }
  to { opacity: 1; scale: 1; translate: 0 0; }
`

export const pop = keyframes`
  from { opacity: 0; scale: 0; }
  to { opacity: 1; scale: 1; }
`

export const rise = keyframes`
  from { transform: translateY(110%) rotate(4deg); }
  to { transform: none; }
`

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
`

export const blink = keyframes`
  0%, 55% { opacity: 1; }
  56%, 100% { opacity: 0; }
`

export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
`

export const draw = keyframes`
  from { stroke-dashoffset: 420; }
  to { stroke-dashoffset: 0; }
`

export const marquee = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`

export const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(33, 150, 243, .6); }
  70% { box-shadow: 0 0 0 9px rgba(33, 150, 243, 0); }
  100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
`

export const hint = keyframes`
  0%, 100% { transform: translateY(0); opacity: .5; }
  50% { transform: translateY(5px); opacity: 1; }
`

export const fill = keyframes`
  from { width: 0; }
`

export const shine = keyframes`
  0%, 72% { left: -60%; }
  100% { left: 130%; }
`

export const spin = keyframes`
  to { transform: rotate(360deg); }
`
