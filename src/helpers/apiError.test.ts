import { describe, expect, it } from 'vitest'

import { parseApiError } from './apiError'

describe('parseApiError', () => {
  it('čita ključ, polje i predlog iz odgovora servera', () => {
    expect(
      parseApiError({ status: 422, data: { messageKey: 'email.errors.typo', details: { field: 'email', suggestion: 'a@gmail.com' } } }),
    ).toEqual({ status: 422, messageKey: 'email.errors.typo', field: 'email', suggestion: 'a@gmail.com' })
  })

  it('mreža bez odgovora', () => {
    expect(parseApiError({ status: 'FETCH_ERROR', error: 'TypeError' }).messageKey).toBe('errors.network')
  })

  it('nepoznat oblik', () => {
    expect(parseApiError(undefined).messageKey).toBe('errors.unexpected')
    expect(parseApiError({ status: 500, data: '<html>' }).messageKey).toBe('errors.unexpected')
  })
})
