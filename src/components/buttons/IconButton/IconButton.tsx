'use client'

import Icon from '@/components/foundations/Icon'

import { Root } from './IconButton.styles'
import type { IconButtonProps } from './IconButton.types'

/** Kvadratno dugme sa ikonicom (meni, zatvaranje, strelice karusela). */
const IconButton = ({ icon, label, size = 'm', variant = 'ghost', type = 'button', className, ...rest }: IconButtonProps) => (
  <Root type={type} aria-label={label} title={label} $size={size} $variant={variant} className={className} {...rest}>
    <Icon name={icon} size={size === 'l' ? 'l' : 'm'} />
  </Root>
)

export default IconButton
