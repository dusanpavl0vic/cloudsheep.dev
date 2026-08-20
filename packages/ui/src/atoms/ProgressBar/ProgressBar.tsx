import { progressBarVariants, progressTrackVariants } from './ProgressBar.variants'
import { cn } from '../../lib/cn'

interface ProgressBarProps {
  /**
   * Da li se nešto trenutno učitava.
   *
   * `false` ne renderuje trag: traka koja stalno stoji prestaje da znači bilo šta.
   */
  active: boolean
  /**
   * Šta se učitava — pročita screen reader. Prevod stiže iz app-e, kao kod `Spinner`-a.
   */
  label: string
  className?: string
}

/**
 * Neodređena traka napretka na vrhu prozora.
 *
 * **Živa oblast je uvek montirana**, menja se samo tekst u njoj. Da se `role="status"`
 * montira zajedno sa trakom, čitač ekrana najavu ne bi izgovorio — sadržaj koji nastane u
 * istom kadru u kom nastaje i sama živa oblast se po pravilu preskače.
 *
 * Vizuelni deo je `aria-hidden`: sve što traka znači stoji u tekstu ispod nje.
 */
export const ProgressBar = ({ active, label, className }: ProgressBarProps) => (
  <>
    {active && (
      <div aria-hidden className={cn(progressTrackVariants(), className)}>
        <span className={progressBarVariants()} />
      </div>
    )}

    <div role="status" aria-live="polite" className="sr-only">
      {active ? label : ''}
    </div>
  </>
)
