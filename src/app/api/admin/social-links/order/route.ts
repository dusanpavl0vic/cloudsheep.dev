import { reorderSchema } from '@/schemas/common'
import { handleAdmin } from '@/server/auth/session'
import { noContent, readJson } from '@/server/http'
import { reorderSocialLinks } from '@/server/services/profile'

export const PATCH = handleAdmin(async (request) => {
  await reorderSocialLinks((await readJson(request, reorderSchema)).ids)
  return noContent()
})
