import Icon from '@/components/foundations/Icon'

import { Root } from './TextLink.styles'
import type { TextLinkProps } from './TextLink.types'

/** Tekstualni link sa strelicom (interna ruta, sa jezičkim prefiksom). */
const TextLink = ({ href, children, underline = false, icon = 'arrowRight', iconLeft, tone = 'accent', className }: TextLinkProps) => (
  <Root href={href} $underline={underline} $tone={tone} className={className}>
    {iconLeft && <Icon name={iconLeft} size={16} />}
    {children}
    {icon && <Icon name={icon} size={16} />}
  </Root>
)

export default TextLink
