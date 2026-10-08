'use client'

import { useTranslations } from 'next-intl'

import type { ParsedApiError } from '@/helpers/apiError'

/**
 * Prevod greške sa servera. Ključ stiže kao string (server ne zna za tipove poruka), pa se
 * proverava sa `t.has`; nepoznat ključ pada na `errors.unexpected` umesto da ispiše sam ključ.
 * Komponenta mora biti ispod `I18nProvider`-a sa namespace-om tog ključa.
 */
export const useApiErrorMessage = () => {
  const t = useTranslations()

  return (error: ParsedApiError | null) => {
    if (!error) return null
    const values = error.suggestion ? { suggestion: error.suggestion } : undefined
    return t.has(error.messageKey as never) ? t(error.messageKey as never, values as never) : t('errors.unexpected')
  }
}
