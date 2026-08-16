import { describe, expect, it } from 'vitest'

import { ERROR_KEYS, isAppError, normalizeError } from './AppError'

describe('normalizeError', () => {
  it.each([
    [400, 'BAD_REQUEST', ERROR_KEYS.VALIDATION],
    [401, 'UNAUTHORIZED', ERROR_KEYS.UNAUTHORIZED],
    [403, 'FORBIDDEN', ERROR_KEYS.FORBIDDEN],
    [404, 'NOT_FOUND', ERROR_KEYS.NOT_FOUND],
    [409, 'CONFLICT', ERROR_KEYS.CONFLICT],
    [422, 'VALIDATION', ERROR_KEYS.VALIDATION],
    [429, 'RATE_LIMITED', ERROR_KEYS.RATE_LIMITED],
  ])('mapira status %i na %s', (status, code, messageKey) => {
    const result = normalizeError({ status })
    expect(result.code).toBe(code)
    expect(result.messageKey).toBe(messageKey)
    expect(result.status).toBe(status)
  })

  it.each([500, 502, 503])('svaki 5xx je SERVER (%i)', (status) => {
    expect(normalizeError({ status }).code).toBe('SERVER')
  })

  it('nepoznat 4xx pada na UNKNOWN', () => {
    expect(normalizeError({ status: 418 }).code).toBe('UNKNOWN')
  })

  it.each([
    ['FETCH_ERROR', 'NETWORK', ERROR_KEYS.NETWORK],
    ['TIMEOUT_ERROR', 'TIMEOUT', ERROR_KEYS.TIMEOUT],
    ['PARSING_ERROR', 'UNKNOWN', ERROR_KEYS.UNKNOWN],
    ['CUSTOM_ERROR', 'UNKNOWN', ERROR_KEYS.UNKNOWN],
  ])('mapira RTKQ %s na %s', (status, code, messageKey) => {
    const result = normalizeError({ status })
    expect(result.code).toBe(code)
    expect(result.messageKey).toBe(messageKey)
    expect(result.status).toBe(0)
  })

  it('zadržava details sa servera', () => {
    const result = normalizeError({ status: 422, data: { field: 'email' } })
    expect(result.details).toEqual({ field: 'email' })
  })

  it('izostavlja details kad ih nema', () => {
    expect(normalizeError({ status: 500 })).not.toHaveProperty('details')
  })

  it('ne propušta sirovu serversku poruku u messageKey', () => {
    const result = normalizeError({
      status: 500,
      data: { message: 'psql: relation "users" does not exist' },
    })
    expect(result.messageKey).toBe(ERROR_KEYS.SERVER)
    expect(result.messageKey).not.toContain('psql')
  })

  it.each([null, undefined, 'greška', 42, true])('svodi %s na UNKNOWN', (input) => {
    const result = normalizeError(input)
    expect(result.code).toBe('UNKNOWN')
    expect(result.status).toBe(0)
  })

  it('objekat bez statusa je UNKNOWN', () => {
    expect(normalizeError({ nesto: 'drugo' }).code).toBe('UNKNOWN')
  })

  it('rezultat je uvek validan AppError', () => {
    for (const input of [{ status: 404 }, { status: 'FETCH_ERROR' }, null, 'x']) {
      expect(isAppError(normalizeError(input))).toBe(true)
    }
  })
})

describe('isAppError', () => {
  it('prepoznaje AppError', () => {
    expect(isAppError({ code: 'X', messageKey: 'errors.x', status: 500 })).toBe(true)
  })

  it.each([
    null,
    undefined,
    'greška',
    {},
    { code: 'X' },
    { code: 'X', messageKey: 'y' },
    { code: 1, messageKey: 'y', status: 500 },
  ])('odbija %s', (value) => {
    expect(isAppError(value)).toBe(false)
  })
})
