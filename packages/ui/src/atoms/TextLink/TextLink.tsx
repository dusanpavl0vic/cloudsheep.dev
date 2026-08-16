import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import type { AnchorHTMLAttributes } from 'react'

import { textLinkVariants } from './TextLink.variants'
import { cn } from '../../lib/cn'


type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof textLinkVariants> & {
    /** Renderuje stil na prosleđeno dete (npr. React Router <Link>) umesto <a>. */
    asChild?: boolean
  }

export const TextLink = ({ className, tone, asChild = false, ...props }: TextLinkProps) => {
  const Comp = asChild ? Slot : 'a'
  return <Comp className={cn(textLinkVariants({ tone }), className)} {...props} />
}
