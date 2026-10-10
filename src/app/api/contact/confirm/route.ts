import { ROUTES } from '@/constants/routes'
import { readFormToken, redirectToStatus } from '@/server/confirmRedirect'
import { handle } from '@/server/http'
import { LIMITS } from '@/server/rateLimit'
import { clientIp } from '@/server/request'
import { confirmBrief } from '@/server/services/contact'

/** Dugme „Potvrdi i pošalji" sa stranice potvrde (ADR 0016) — POST, nikad GET. */
export const POST = handle(async (request) => {
  LIMITS.confirm(clientIp(request))
  const { status, locale } = await confirmBrief(await readFormToken(request))
  return redirectToStatus(ROUTES.CONTACT_CONFIRM, locale, status)
})
