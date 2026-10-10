import type { IconName } from '@/constants/icons'
import type { ControlSize } from '@/constants/theme'

export interface IconProps {
  name: IconName
  /** S 14 · M 18 · L 22, ili tačan broj piksela. */
  size?: ControlSize | number
  className?: string
  /** Bez `label` ikonica je dekorativna (`aria-hidden`); sa njim je čitač ekrana izgovara. */
  label?: string
}
