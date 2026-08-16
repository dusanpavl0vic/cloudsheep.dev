import type { VariantProps } from 'class-variance-authority'

import { cn } from '@app/ui'

import { logoMarkVariants, logoVariants, logoWordmarkVariants } from './Logo.variants'
import { SheepMark } from './SheepMark'

type LogoProps = VariantProps<typeof logoMarkVariants> & {
  /** Kada je false, prikazuje se samo znak bez naziva */
  showWordmark?: boolean
  /** Kada je false, prikazuje se samo naziv bez znaka — vrh mobilnog panela, gde znak
   *  već stoji u zaglavlju iznad njega. */
  showMark?: boolean
  label: string
  className?: string
}

export const Logo = ({
  tone,
  size,
  showWordmark = true,
  showMark = true,
  label,
  className,
}: LogoProps) => (
  <span className={cn(logoVariants(), className)}>
    {showMark && <SheepMark className={logoMarkVariants({ tone, size })} />}
    {showWordmark && <span className={logoWordmarkVariants({ tone, size })}>{label}</span>}
  </span>
)

export { SheepMark }
