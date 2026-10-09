'use client'

import { useTranslations } from 'next-intl'

import type { ParsedApiError } from '@/helpers/apiError'

/**
 * Prevod ključa koji stiže kao string (greška polja iz zod šeme ili sa servera — tipovi poruka
 * ga ne poznaju). Proverava se sa `t.has`; nepoznat ključ pada na `errors.unexpected` umesto da
 * ispiše sam ključ. Komponenta mora biti ispod `I18nProvider`-a sa namespace-om tog ključa.
 */
export const useKeyTranslator = () => {
  const t = useTranslations()

  return (key: string | undefined, values?: Record<string, string>) => {
    if (!key) return null
    return t.has(key as never) ? t(key as never, values as never) : t('errors.unexpected')
  }
}

/** Prevod greške sa servera (`ParsedApiError`), sa predlogom ispravke ako ga ima. */
export const useApiErrorMessage = () => {
  const translate = useKeyTranslator()

  return (error: ParsedApiError | null) =>
    error ? translate(error.messageKey, error.suggestion ? { suggestion: error.suggestion } : undefined) : null
}
