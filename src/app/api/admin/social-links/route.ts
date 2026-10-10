import { HTTP_STATUS } from '@/constants/http'
import { socialLinkSchema } from '@/schemas/profile'
import { handleAdmin } from '@/server/auth/session'
import { json, readJson } from '@/server/http'
import { createSocialLink } from '@/server/services/profile'

export const POST = handleAdmin(async (request) =>
  json(
    await createSocialLink(await readJson(request, socialLinkSchema, 'profile.errors.invalid')),
    HTTP_STATUS.CREATED,
  ),
)
