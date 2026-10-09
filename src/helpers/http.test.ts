import { afterEach, describe, expect, it, vi } from 'vitest'

import { parseApiError } from './apiError'
import { postJson } from './http'

const respond = (status: number, body: unknown) =>
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(JSON.stringify(body), { status }))))

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('postJson', () => {
  it('vraća telo odgovora', async () => {
    respond(202, { ok: true })
    await expect(postJson('/api/x', {})).resolves.toEqual({ ok: true })
  })

  it('greška sa servera ima oblik koji parseApiError razume (polje + predlog)', async () => {
    respond(422, { messageKey: 'email.typo', details: { field: 'email', suggestion: 'a@gmail.com' } })
    const caught: unknown = await postJson('/api/x', {}).catch((error: unknown) => error)
    expect(parseApiError(caught)).toEqual({ status: 422, messageKey: 'email.typo', field: 'email', suggestion: 'a@gmail.com' })
  })

  it('pad mreže je errors.network', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('offline'))))
    const caught: unknown = await postJson('/api/x', {}).catch((error: unknown) => error)
    expect(parseApiError(caught).messageKey).toBe('errors.network')
  })
})
