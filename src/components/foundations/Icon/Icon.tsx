import { ICON_SIZES } from '@/constants/theme'

import { ICONS } from './Icon.constants'
import type { IconProps } from './Icon.types'

/** Ikonica iz zatvorenog spiska; nasleđuje boju teksta (`currentColor`). */
const Icon = ({ name, size = 'm', className, label }: IconProps) => {
  const Svg = ICONS[name]
  const px = typeof size === 'number' ? size : ICON_SIZES[size]

  return (
    <Svg
      width={px}
      height={px}
      strokeWidth={2}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable={false}
    />
  )
}

export default Icon
