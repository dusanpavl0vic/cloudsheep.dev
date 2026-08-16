import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

import { logoMarkVariants, logoVariants, logoWordmarkVariants } from './Logo.variants'
import { SpiralMark } from './SpiralMark'

type LogoProps = VariantProps<typeof logoMarkVariants> & {
  /** Kada je false, prikazuje se samo znak bez naziva */
  showWordmark?: boolean
  label: string
  className?: string
}

export const Logo = ({ tone, size, showWordmark = true, label, className }: LogoProps) => (
  <span className={cn(logoVariants(), className)}>
    <SpiralMark className={logoMarkVariants({ tone, size })} />
    {showWordmark && <span className={logoWordmarkVariants({ tone, size })}>{label}</span>}
  </span>
)

export { SpiralMark }
