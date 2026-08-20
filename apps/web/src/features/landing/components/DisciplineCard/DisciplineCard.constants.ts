/**
 * Svetlo pod kursorom. Pozicija dolazi iz `--gx`/`--gy` koje `usePointerGlow` upisuje na
 * stil panela — bez rerendera.
 *
 * Podrazumevana vrednost je van panela, pa je gradijent nevidljiv dok se kursor ne pojavi;
 * to je i ponašanje pri `prefers-reduced-motion`, gde se slušalac ni ne kači.
 *
 * `color-mix` u oklch, kao u hero-u: interpolacija ka prozirnom ne prolazi kroz mutno sivo.
 */
export const PANEL_GLOW =
  'radial-gradient(circle 240px at var(--gx, -300px) var(--gy, -300px), color-mix(in oklch, var(--color-primary) 15%, transparent) 0%, transparent 72%)'
