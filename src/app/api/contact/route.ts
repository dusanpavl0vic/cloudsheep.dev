import { HTTP_STATUS } from '@/constants/http'
import { briefSchema } from '@/schemas/contact'
import { handle, json, readJson } from '@/server/http'
import { LIMITS } from '@/server/rateLimit'
import { clientIp, userAgent } from '@/server/request'
import { submitBrief } from '@/server/services/contact'

/**
 * Upit iz forme. 202, ne 200: upit je primljen; da li je mejl stigao ne zna se u ovom trenutku.
 * Isti 202 dobija i bot koji je popunio honeypot.
 */
export const POST = handle(async (request) => {
  const ip = clientIp(request)
  LIMITS.contact(ip)
  const brief = await readJson(request, briefSchema, 'contact.errors.invalid')

  await submitBrief(brief, { ip, userAgent: userAgent(request) })
  return json({ ok: true }, HTTP_STATUS.ACCEPTED)
})
