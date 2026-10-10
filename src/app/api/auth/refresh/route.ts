import { REFRESH_COOKIE } from '@/constants/cookies'
import { HTTP_STATUS } from '@/constants/http'
import { clearRefreshCookie, setRefreshCookie } from '@/server/auth/cookies'
import { handle, json } from '@/server/http'
import { refresh } from '@/server/services/auth'

/** Obnova sesije iz httpOnly kolačića; nevažeći token briše kolačić i vraća 401. */
export const POST = handle(async (request) => {
  const token = request.cookies.get(REFRESH_COOKIE)?.value
  const session = token ? await refresh(token) : null

  if (!session) {
    const response = json({ messageKey: 'errors.unauthorized' }, HTTP_STATUS.UNAUTHORIZED)
    clearRefreshCookie(response)
    return response
  }

  const { refreshToken, refreshExpiresAt, ...body } = session
  const response = json(body)
  setRefreshCookie(response, refreshToken, refreshExpiresAt)
  return response
})
