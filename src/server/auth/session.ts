import 'server-only'

import type { NextRequest } from 'next/server'

import { HTTP_STATUS } from '@/constants/http'

import { handle, HttpError, type RouteContext, type RouteParams } from '../http'
import { verifyAccessToken, type AccessTokenPayload } from './tokens'

/**
 * Važeći access token iz `Authorization: Bearer`.
 *
 * **401**, ne 403: klijentski `baseQueryWithReauth` na 401 obnavlja sesiju i ponavlja zahtev.
 */
export const requireAuth = (request: NextRequest): AccessTokenPayload => {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Bearer '))
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, 'errors.unauthorized')

  try {
    return verifyAccessToken(header.slice('Bearer '.length))
  } catch {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, 'errors.unauthorized')
  }
}

/**
 * Admin uloga. **403**, namerno suprotno od `requireAuth`: na 401 bi klijent u petlji
 * obnavljao sasvim važeću sesiju za zahtev koji nikad neće proći.
 */
export const requireAdmin = (request: NextRequest): AccessTokenPayload => {
  const user = requireAuth(request)
  if (user.role !== 'admin') throw new HttpError(HTTP_STATUS.FORBIDDEN, 'errors.forbidden')
  return user
}

type AdminHandler<P extends RouteParams> = (
  request: NextRequest,
  context: RouteContext<P>,
  user: AccessTokenPayload,
) => Promise<Response>

/**
 * Omotač za SVE `/api/admin/*` rute: provera uloge je deo omotača, pa nova ruta ne može da je
 * zaboravi (isto kao `adminRouter.use(requireAuth, requireRole('admin'))` ranije).
 */
export const handleAdmin = <P extends RouteParams = RouteParams>(handler: AdminHandler<P>) =>
  handle<P>((request, context) => handler(request, context, requireAdmin(request)))
