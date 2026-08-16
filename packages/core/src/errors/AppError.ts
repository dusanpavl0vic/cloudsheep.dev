/**
 * Normalizovana greška kroz ceo sistem.
 *
 * `messageKey` je i18n ključ, ne tekst. UI prikazuje `t(error.messageKey)` — nikad sirovu
 * poruku sa servera, koja nije prevedena i ume da procuri interne detalje (docs/20-security.md).
 */
export interface AppError {
  /** Mašinski kod za grananje u kodu — npr. `UNAUTHORIZED` */
  code: string
  /** i18n ključ poruke za korisnika */
  messageKey: string
  /** HTTP status, ili 0 za mrežne greške */
  status: number
  /** Dodatni podaci — npr. `{ field: 'email' }` za validacione greške */
  details?: unknown
}

export const ERROR_KEYS = {
  NETWORK: 'errors.network',
  TIMEOUT: 'errors.timeout',
  UNAUTHORIZED: 'errors.unauthorized',
  FORBIDDEN: 'errors.forbidden',
  NOT_FOUND: 'errors.notFound',
  VALIDATION: 'errors.validation',
  CONFLICT: 'errors.conflict',
  RATE_LIMITED: 'errors.rateLimited',
  SERVER: 'errors.server',
  UNKNOWN: 'errors.unknown',
} as const

const BY_STATUS: Readonly<Record<number, { code: string; messageKey: string }>> = {
  400: { code: 'BAD_REQUEST', messageKey: ERROR_KEYS.VALIDATION },
  401: { code: 'UNAUTHORIZED', messageKey: ERROR_KEYS.UNAUTHORIZED },
  403: { code: 'FORBIDDEN', messageKey: ERROR_KEYS.FORBIDDEN },
  404: { code: 'NOT_FOUND', messageKey: ERROR_KEYS.NOT_FOUND },
  409: { code: 'CONFLICT', messageKey: ERROR_KEYS.CONFLICT },
  422: { code: 'VALIDATION', messageKey: ERROR_KEYS.VALIDATION },
  429: { code: 'RATE_LIMITED', messageKey: ERROR_KEYS.RATE_LIMITED },
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

/**
 * Svodi bilo šta što je RTK Query vratio na `AppError`.
 *
 * Ulaz je namerno `unknown`: `FetchBaseQueryError`, `SerializedError`, bačen `Error`
 * i sirov objekat sa servera stižu ovim putem i svi moraju imati isti izlaz.
 */
export function normalizeError(error: unknown): AppError {
  if (!isRecord(error)) {
    return { code: 'UNKNOWN', messageKey: ERROR_KEYS.UNKNOWN, status: 0 }
  }

  const { status } = error

  // Mrežni sloj RTK Query-ja: status je string za ne-HTTP greške
  if (status === 'FETCH_ERROR') {
    return { code: 'NETWORK', messageKey: ERROR_KEYS.NETWORK, status: 0 }
  }
  if (status === 'TIMEOUT_ERROR') {
    return { code: 'TIMEOUT', messageKey: ERROR_KEYS.TIMEOUT, status: 0 }
  }
  if (status === 'PARSING_ERROR' || status === 'CUSTOM_ERROR') {
    return { code: 'UNKNOWN', messageKey: ERROR_KEYS.UNKNOWN, status: 0 }
  }

  if (typeof status === 'number') {
    const mapped = BY_STATUS[status] ?? {
      code: status >= 500 ? 'SERVER' : 'UNKNOWN',
      messageKey: status >= 500 ? ERROR_KEYS.SERVER : ERROR_KEYS.UNKNOWN,
    }

    const details = isRecord(error.data) ? error.data : undefined
    return {
      ...mapped,
      status,
      ...(details === undefined ? {} : { details }),
    }
  }

  return { code: 'UNKNOWN', messageKey: ERROR_KEYS.UNKNOWN, status: 0 }
}

/** Da li vrednost već jeste `AppError` — koristi se da se ne normalizuje dvaput. */
export function isAppError(value: unknown): value is AppError {
  return (
    isRecord(value) &&
    typeof value.code === 'string' &&
    typeof value.messageKey === 'string' &&
    typeof value.status === 'number'
  )
}
