import { isLocale } from '@/constants/i18n'
import { ROUTES } from '@/constants/routes'
import { readFormToken, redirectToStatus } from '@/server/confirmRedirect'
import { handle } from '@/server/http'
import { LIMITS } from '@/server/rateLimit'
import { clientIp } from '@/server/request'
import { confirmSubscription } from '@/server/services/newsletter'

/** Dugme „Potvrdi prijavu" sa stranice potvrde (ADR 0016) — POST, nikad GET. */
export const POST = handle(async (request) => {
  LIMITS.confirm(clientIp(request))
  const form = await request.clone().formData().catch(() => null)
  const locale = form?.get('locale')
  const status = await confirmSubscription(await readFormToken(request))
  return redirectToStatus(ROUTES.NEWSLETTER_CONFIRM, isLocale(locale) ? locale : 'en', status)
})
