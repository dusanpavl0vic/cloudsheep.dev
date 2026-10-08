import { emailCheckSchema } from '@/schemas/email'
import { handle, json, readJson } from '@/server/http'
import { LIMITS } from '@/server/rateLimit'
import { clientIp } from '@/server/request'
import { checkEmail } from '@/server/services/contact'

/** Provera adrese dok posetilac kuca (on-blur) — ADR 0013. */
export const POST = handle(async (request) => {
  LIMITS.emailCheck(clientIp(request))
  const { email, allowTypo } = await readJson(request, emailCheckSchema)
  return json(await checkEmail(email, allowTypo))
})
