/** Prelomne tačke u px (mobilni je podrazumevani — stilovi se pišu mobile-first). */
export const BREAKPOINTS = {
  tablet: 640,
  desktop: 1024,
  wide: 1200,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

/** `${({ theme }) => theme.media.desktop} { … }` */
export const MEDIA = {
  tablet: `@media (min-width: ${String(BREAKPOINTS.tablet)}px)`,
  desktop: `@media (min-width: ${String(BREAKPOINTS.desktop)}px)`,
  wide: `@media (min-width: ${String(BREAKPOINTS.wide)}px)`,
  belowDesktop: `@media (max-width: ${String(BREAKPOINTS.desktop - 1)}px)`,
  hover: '@media (hover: hover) and (pointer: fine)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  /** Bez JS-a ili uz smanjeno kretanje — efekti vezani za skrol ustupaju mesto običnom rasporedu. */
  staticFallback: '@media (scripting: none), (prefers-reduced-motion: reduce)',
} as const
