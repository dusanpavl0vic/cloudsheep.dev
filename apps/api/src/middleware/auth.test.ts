import type { NextFunction, Request, Response } from 'express'
import { describe, expect, it, vi } from 'vitest'

import { requireRole } from './auth.ts'
import { HttpError } from './error.ts'

/** Minimalan `Request` — `requireRole` čita samo `req.user`. */
const reqWithRole = (role?: string) =>
  ({ user: role ? { sub: 'u1', email: 'a@b.c', role } : undefined }) as Request

const res = {} as Response

const run = (handler: ReturnType<typeof requireRole>, req: Request) => {
  const next = vi.fn() as unknown as NextFunction
  handler(req, res, next)
  return next as unknown as ReturnType<typeof vi.fn>
}

describe('requireRole', () => {
  it('propušta kad se uloga poklapa', () => {
    const next = run(requireRole('admin'), reqWithRole('admin'))

    expect(next).toHaveBeenCalledOnce()
  })

  it('propušta kad je uloga jedna od nabrojanih', () => {
    const next = run(requireRole('admin', 'member'), reqWithRole('member'))

    expect(next).toHaveBeenCalledOnce()
  })

  /*
   * 403, ne 401 — i to je cela poenta ovog middleware-a.
   *
   * Klijentski `createBaseApi` na 401 pokreće obnovu sesije i ponavlja zahtev. Da ovde
   * stoji 401, `viewer` bi u petlji obnavljao potpuno važeću sesiju za zahtev koji nikad
   * neće proći.
   */
  it('vraća 403 kad uloga nije dovoljna', () => {
    expect(() => {
      run(requireRole('admin'), reqWithRole('viewer'))
    }).toThrow(expect.objectContaining({ status: 403, messageKey: 'errors.forbidden' }) as Error)
  })

  it('vraća 401 kad korisnika uopšte nema — `requireAuth` nije odrađen', () => {
    expect(() => {
      run(requireRole('admin'), reqWithRole(undefined))
    }).toThrow(expect.objectContaining({ status: 401 }) as Error)
  })

  it('ne zove next kad odbije', () => {
    const next = vi.fn() as unknown as NextFunction

    expect(() => {
      requireRole('admin')(reqWithRole('viewer'), res, next)
    }).toThrow(HttpError)
    expect(next).not.toHaveBeenCalled()
  })
})
