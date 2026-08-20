import type { Role } from '@prisma/client'
import type { RequestHandler } from 'express'

import { HttpError } from './error.ts'
import { verifyAccessToken, type AccessTokenPayload } from '../lib/tokens.ts'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Express tipove proširuje samo ovako
  namespace Express {
    interface Request {
      user?: AccessTokenPayload
    }
  }
}

/**
 * Traži važeći access token u `Authorization: Bearer`.
 *
 * Vraća **401**, ne 403: klijentski `createBaseApi` na 401 pokreće obnovu sesije i ponavlja
 * zahtev. Da ovde stoji 403, korisniku bi sesija istekla umesto da se tiho produži.
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(401, 'errors.unauthorized')
  }

  try {
    req.user = verifyAccessToken(header.slice('Bearer '.length))
    next()
  } catch {
    throw new HttpError(401, 'errors.unauthorized')
  }
}

/**
 * Traži ulogu. Ide UVEK posle `requireAuth` — sam ne proverava token.
 *
 * Vraća **403**, namerno suprotno od `requireAuth` iznad. Klijentski `createBaseApi` na 401
 * pokreće obnovu sesije i ponavlja zahtev; da ovde stoji 401, korisnik sa nedovoljnom ulogom
 * bi u petlji obnavljao sasvim važeću sesiju za zahtev koji nikad neće proći.
 *
 * Primenjuje se na nivou router-a (`adminRouter.use(requireAuth, requireRole('admin'))`),
 * ne po ruti — tako se nova ruta ne može zaboraviti.
 */
export const requireRole =
  (...roles: readonly Role[]): RequestHandler =>
  (req, _res, next) => {
    const role = req.user?.role
    if (!role) throw new HttpError(401, 'errors.unauthorized')
    // `some` umesto `includes`: `role` je `string` u tokenu, `roles` su `Role` iz Prisme.
    // Poređenje prolazi, `includes` ne bi — a tip poziva ostaje proveren (`requireRole('admin')`).
    if (!roles.some((allowed) => allowed === role)) throw new HttpError(403, 'errors.forbidden')

    next()
  }
