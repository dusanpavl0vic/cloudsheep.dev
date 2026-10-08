import type { ButtonHTMLAttributes, ElementType, ReactNode } from 'react'

import type { IconName } from '@/constants/icons'
import type { ControlSize } from '@/constants/theme'

/**
 * `primary` — glavna akcija · `accent` — svetlo plava na tamnoj površini (CTA traka, istaknut
 * paket) · `secondary` — obrub · `ghost` — bez okvira · `inverse` — obrub na tamnoj površini ·
 * `danger` — brisanje.
 */
export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'inverse' | 'danger'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children?: ReactNode
  variant?: ButtonVariant
  /** S 36 · M 44 · L 52 */
  size?: ControlSize
  iconLeft?: IconName
  iconRight?: IconName
  fullWidth?: boolean
  /** Isključuje dugme i označava ga kao zauzeto dok traje zahtev. */
  loading?: boolean
  /** Link koji izgleda kao dugme: interna ruta ili spoljni URL (`https:`, `mailto:`). */
  href?: string
  /**
   * Komponenta za interni link. Podrazumevano `Link` iz `@/i18n/navigation` (dodaje `/sr`);
   * admin prosleđuje `next/link`, jer admin nema jezik u URL-u.
   */
  linkComponent?: ElementType
  className?: string
}
