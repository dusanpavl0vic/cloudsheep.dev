import { HTTP_STATUS } from '@/constants/http'
import { subscribeSchema } from '@/schemas/newsletter'
import { handle, json, readJson } from '@/server/http'
import { LIMITS } from '@/server/rateLimit'
import { clientIp } from '@/server/request'
import { subscribe } from '@/server/services/newsletter'

/** Isti odgovor za novu i postojeću adresu — forma ne otkriva ko je prijavljen. */
export const POST = handle(async (request) => {
  LIMITS.newsletter(clientIp(request))
  await subscribe(await readJson(request, subscribeSchema, 'contact.errors.invalid'))
  return json({ ok: true }, HTTP_STATUS.ACCEPTED)
})
