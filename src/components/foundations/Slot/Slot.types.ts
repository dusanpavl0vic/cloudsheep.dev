import type { ElementType, HTMLAttributes, ReactNode } from 'react'

/**
 * Element koji se renderuje bira se prop-om `component` (`'h1'`, `'li'`, `Link`). next-yak nema
 * `as` prop (ADR 0015) — styled komponenta obavija `Slot`: `styled(Slot)\`…\``.
 */
export type SlotProps = HTMLAttributes<HTMLElement> & {
  component: ElementType
  children?: ReactNode
  href?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}
