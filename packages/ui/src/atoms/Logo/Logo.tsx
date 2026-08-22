import type { VariantProps } from 'class-variance-authority'

import { logoMarkVariants, logoVariants, logoWordmarkVariants } from './Logo.variants'
import { SheepMark } from './SheepMark'
import { cn } from '../../lib/cn'

type LogoProps = VariantProps<typeof logoMarkVariants> & {
  /** Kada je false, prikazuje se samo znak bez naziva */
  showWordmark?: boolean
  /** Kada je false, prikazuje se samo naziv bez znaka — vrh mobilnog panela, gde znak
   *  već stoji u zaglavlju iznad njega. */
  showMark?: boolean
  label: string
  className?: string
}

/**
 * Znak + naziv.
 *
 * Prekidača za izbor marke nema: postoji tačno jedan znak (`SheepMark`) i koristi se svuda.
 * Ranija verzija je imala prop `mark` sa dve varijante — obe su obrisane kad je stigao
 * jedinstven crtež.
 */
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
