import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { ApiError, apiGet } from './apiClient'

const schema = z.object({ ok: z.boolean() })

const mockFetch = (impl: () => Promise<Response> | Response) => {
  vi.stubGlobal('fetch', vi.fn(impl))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiGet', () => {
  it('vraća parsiran odgovor', async () => {
    mockFetch(() => Response.json({ ok: true }))

    await expect(apiGet('/test', schema)).resolves.toEqual({ ok: true })
  })

  it('zove API na adresi iz env-a', async () => {
    const spy = vi.fn(() => Response.json({ ok: true }))
    vi.stubGlobal('fetch', spy)

    await apiGet('/projects', schema)

    expect(spy).toHaveBeenCalledWith('http://localhost:3000/projects', expect.anything())
  })

  it('404 daje ApiError sa ključem notFound', async () => {
    mockFetch(() => new Response(null, { status: 404 }))

    await expect(apiGet('/nema', schema)).rejects.toMatchObject({
      status: 404,
      messageKey: 'errors.notFound',
    })
  })

  it('500 daje ApiError', async () => {
    mockFetch(() => new Response(null, { status: 500 }))

    await expect(apiGet('/test', schema)).rejects.toBeInstanceOf(ApiError)
  })

  // Status 0 znači „nije ni stiglo do servera" — drugačiji problem od 500
  it('prekinuta mreža daje status 0', async () => {
    mockFetch(() => Promise.reject(new Error('offline')))

    await expect(apiGet('/test', schema)).rejects.toMatchObject({
      status: 0,
      messageKey: 'errors.network',
    })
  })

  /*
   * Izmena oblika na serveru mora da pukne OVDE, ne u JSX-u.
   *
   * Bez validacije odgovora greška stigne do komponente kao „cannot read property of
   * undefined", daleko od uzroka.
   */
  it('odgovor pogrešnog oblika se odbija, ne prosleđuje dalje', async () => {
    mockFetch(() => Response.json({ nesto: 'drugo' }))

    await expect(apiGet('/test', schema)).rejects.toMatchObject({ status: 500 })
  })
})
