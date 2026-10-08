/** Jedan oblik greške za ceo UI (šablon §8): status, i18n ključ, polje forme, predlog. */
export interface ParsedApiError {
  status: number | null
  messageKey: string
  field: string | null
  suggestion: string | null
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

/**
 * Greška iz RTK Query-ja → `ParsedApiError`. Server šalje `{ messageKey, details? }`; mreža bez
 * odgovora (`FETCH_ERROR`) je `errors.network`; sve ostalo `errors.unexpected`.
 */
export const parseApiError = (error: unknown): ParsedApiError => {
  if (!isObject(error)) return { status: null, messageKey: 'errors.unexpected', field: null, suggestion: null }

  const status = typeof error.status === 'number' ? error.status : null
  if (error.status === 'FETCH_ERROR') return { status: null, messageKey: 'errors.network', field: null, suggestion: null }

  const data = isObject(error.data) ? error.data : {}
  const details = isObject(data.details) ? data.details : {}
  return {
    status,
    messageKey: typeof data.messageKey === 'string' ? data.messageKey : 'errors.unexpected',
    field: typeof details.field === 'string' ? details.field : null,
    suggestion: typeof details.suggestion === 'string' ? details.suggestion : null,
  }
}
