import { loginSchema } from '@/schemas/auth'
import { setRefreshCookie } from '@/server/auth/cookies'
import { handle, json, readJson } from '@/server/http'
import { LIMITS } from '@/server/rateLimit'
import { clientIp } from '@/server/request'
import { login } from '@/server/services/auth'

export const POST = handle(async (request) => {
  LIMITS.login(clientIp(request))
  const { email, password, rememberMe } = await readJson(
    request,
    loginSchema,
    'auth.errors.invalidCredentials',
  )

  const { refreshToken, refreshExpiresAt, ...session } = await login(email, password, rememberMe)
  const response = json(session)
  setRefreshCookie(response, refreshToken, refreshExpiresAt)
  return response
})
