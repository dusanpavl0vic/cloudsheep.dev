import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode
  /** Izabran: puna boja (dizajn: `chip(on)` → primary / card). */
  selected?: boolean
  /** Sporedni red teksta ispod (tip projekta u upitu: „SaaS, dashboard, portal"). */
  hint?: ReactNode
  /** `checkbox` za višestruki izbor, `radio` za jedan. */
  role?: 'checkbox' | 'radio'
  className?: string
}
