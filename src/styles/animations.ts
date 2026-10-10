import { globalStyle } from 'next-yak'

import { anim } from './tokens.yak'

/**
 * Animacije iz dizajna, definisane jednom — šabloni ih zovu po imenu: `animation: ${anim.fadeUp} …`.
 * `prefers-reduced-motion` ih gasi globalno (`styles/global.ts`).
 */
globalStyle`
  @keyframes ${anim.bob} {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-3px) rotate(-4deg); }
  }

  @keyframes ${anim.drift} {
    from { translate: 0 -6px; }
    to { translate: 0 6px; }
  }

  @keyframes ${anim.popIn} {
    from { opacity: 0; scale: .92; translate: 0 14px; }
    to { opacity: 1; scale: 1; translate: 0 0; }
  }

  @keyframes ${anim.pop} {
    from { opacity: 0; scale: 0; }
    to { opacity: 1; scale: 1; }
  }

  @keyframes ${anim.rise} {
    from { transform: translateY(110%) rotate(4deg); }
    to { transform: none; }
  }

  @keyframes ${anim.fadeUp} {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: none; }
  }

  /* Kao fadeUp, ali bez providnosti — za LCP kandidate: tekst je vidljiv od prvog iscrtavanja. */
  @keyframes ${anim.slideUp} {
    from { transform: translateY(18px); }
    to { transform: none; }
  }

  @keyframes ${anim.blink} {
    0%, 55% { opacity: 1; }
    56%, 100% { opacity: 0; }
  }

  @keyframes ${anim.gradientShift} {
    0% { background-position: 0% 50%; }
    100% { background-position: 300% 50%; }
  }

  @keyframes ${anim.draw} {
    from { stroke-dashoffset: 420; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes ${anim.marquee} {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @keyframes ${anim.pulse} {
    0% { box-shadow: 0 0 0 0 rgba(33, 150, 243, .6); }
    70% { box-shadow: 0 0 0 9px rgba(33, 150, 243, 0); }
    100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
  }

  @keyframes ${anim.hint} {
    0%, 100% { transform: translateY(0); opacity: .5; }
    50% { transform: translateY(5px); opacity: 1; }
  }

  @keyframes ${anim.fill} {
    from { width: 0; }
  }

  @keyframes ${anim.shine} {
    0%, 72% { left: -60%; }
    100% { left: 130%; }
  }

  @keyframes ${anim.spin} {
    to { transform: rotate(360deg); }
  }

  /* Aurora: putanja svake mrlje je u njenim CSS promenljivama (AuroraBackground). */
  @keyframes ${anim.auroraDrift} {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(var(--aurora-dx), var(--aurora-dy)) scale(var(--aurora-scale)); }
  }
`
