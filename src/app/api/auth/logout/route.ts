import { REFRESH_COOKIE } from '@/constants/cookies'
import { clearRefreshCookie } from '@/server/auth/cookies'
import { handle, noContent } from '@/server/http'
import { logout } from '@/server/services/auth'

/** Odjava sa uređaja ne sme da zavisi od toga da li je token još važeći. */
export const POST = handle(async (request) => {
  await logout(request.cookies.get(REFRESH_COOKIE)?.value)
  const response = noContent()
  clearRefreshCookie(response)
  return response
})
