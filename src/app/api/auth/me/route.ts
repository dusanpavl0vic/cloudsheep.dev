import { HTTP_STATUS } from '@/constants/http'
import { requireAuth } from '@/server/auth/session'
import { handle, HttpError, json } from '@/server/http'
import { me } from '@/server/services/auth'

export const GET = handle(async (request) => {
  const user = await me(requireAuth(request).sub)
  if (!user) throw new HttpError(HTTP_STATUS.UNAUTHORIZED, 'errors.unauthorized')
  return json(user)
})
