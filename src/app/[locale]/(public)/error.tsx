'use client'

import ErrorView from '@/components/errors/ErrorView'

interface LocaleErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Granica greške javnih stranica. Detalji idu u log servera (digest), ne na ekran.
 * U `(public)` je, ne u `[locale]`: greška stranice se prikazuje unutar zaglavlja i podnožja,
 * a chunk granice deli next-yak runtime sa public layout-om umesto da nosi svoju kopiju
 * (docs/07 §6a). Grešku samog layout-a hvata `app/global-error.tsx`.
 */
const LocaleError = ({ reset }: LocaleErrorProps) => <ErrorView onRetry={reset} />

export default LocaleError
