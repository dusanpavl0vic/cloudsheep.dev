'use client'

import ErrorView from '@/components/errors/ErrorView'

interface LocaleErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/** Granica greške javnog sajta. Detalji idu u log servera (digest), ne na ekran. */
const LocaleError = ({ reset }: LocaleErrorProps) => <ErrorView onRetry={reset} />

export default LocaleError
