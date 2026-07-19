import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

import { LogoMark } from './LogoMark'
import { logoMarkVariants, logoVariants, logoWordmarkVariants } from './Logo.variants'

type LogoProps = VariantProps<typeof logoVariants> &
  VariantProps<typeof logoMarkVariants> & {
    /** Kada je false, prikazuje se samo znak bez naziva */
    showWordmark?: boolean
    label: string
    className?: string
  }

export const Logo = ({ tone, size, showWordmark = true, label, className }: LogoProps) => (
  <span className={cn(logoVariants({ tone }), className)}>
    <LogoMark className={logoMarkVariants({ size })} />
    {showWordmark && <span className={logoWordmarkVariants()}>{label}</span>}
  </span>
)

export { LogoMark }
