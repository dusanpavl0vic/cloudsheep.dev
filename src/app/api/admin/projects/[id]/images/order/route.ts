import { reorderSchema } from '@/schemas/common'
import { handleAdmin } from '@/server/auth/session'
import { noContent, readJson } from '@/server/http'
import { reorderProjectImages } from '@/server/services/projects'

export const PATCH = handleAdmin(async (request) => {
  await reorderProjectImages((await readJson(request, reorderSchema)).ids)
  return noContent()
})
