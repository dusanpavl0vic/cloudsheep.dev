'use client'

import Spinner from '@/components/feedback/Spinner'
import Icon from '@/components/foundations/Icon'
import { Link } from '@/i18n/navigation'

import { EXTERNAL_HREF, NEW_TAB_HREF } from './Button.constants'
import { Root, RootLink } from './Button.styles'
import type { ButtonProps } from './Button.types'

/** Dugme sa varijantama i veličinama; uz `href` postaje link (šablon §3.5). */
const Button = ({
  children,
  variant = 'primary',
  size = 'm',
  iconLeft,
  iconRight,
  fullWidth = false,
  loading = false,
  href,
  linkComponent = Link,
  type = 'button',
  disabled,
  className,
  ...rest
}: ButtonProps) => {
  const content = (
    <>
      {loading ? <Spinner size={14} /> : iconLeft && <Icon name={iconLeft} size="s" />}
      {children}
      {iconRight && !loading && <Icon name={iconRight} size="s" />}
    </>
  )
  const style = { $variant: variant, $size: size, $fullWidth: fullWidth, className }

  if (href && EXTERNAL_HREF.test(href)) {
    const newTab = NEW_TAB_HREF.test(href)
    return (
      <RootLink component="a" href={href} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...style}>
        {content}
      </RootLink>
    )
  }

  if (href) {
    return (
      <RootLink component={linkComponent} href={href} {...style}>
        {content}
      </RootLink>
    )
  }

  return (
    <Root type={type} disabled={disabled ?? loading} aria-busy={loading || undefined} {...style} {...rest}>
      {content}
    </Root>
  )
}

export default Button
