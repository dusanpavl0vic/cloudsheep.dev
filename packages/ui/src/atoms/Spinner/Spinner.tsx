import type { VariantProps } from 'class-variance-authority'

import { spinnerVariants } from './Spinner.variants'
import { cn } from '../../lib/cn'

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  /**
   * Šta se učitava — pročita screen reader. Prevod stiže iz app-e.
   *
   * Obavezan: vrteška bez teksta je za pomoćnu tehnologiju prazan element, pa korisnik
   * ne zna ni da se nešto dešava.
   */
  label: string
  className?: string
}

/**
 * `motion-reduce:animate-none` je namerno: rotacija je jedina animacija koju korisnik sa
 * `prefers-reduced-motion` ne sme da dobije, a `role="status"` mu i dalje javi šta se
 * dešava (docs/15-accessibility.md).
 */
export const Spinner = ({ label, size, className }: SpinnerProps) => (
  <span role="status" aria-live="polite">
    <span className={cn(spinnerVariants({ size }), className)} />
    <span className="sr-only">{label}</span>
  </span>
)
