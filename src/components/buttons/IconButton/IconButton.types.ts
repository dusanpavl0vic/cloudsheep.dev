import type { ButtonHTMLAttributes } from 'react'

import type { IconName } from '@/constants/icons'
import type { ControlSize } from '@/constants/theme'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName
  /** Obavezan: dugme bez teksta mora imati ime za čitač ekrana. */
  label: string
  size?: ControlSize
  variant?: 'ghost' | 'muted'
  className?: string
}
