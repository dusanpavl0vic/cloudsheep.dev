import { reorderSchema } from '@/schemas/common'
import { handleAdmin } from '@/server/auth/session'
import { noContent, readJson } from '@/server/http'
import { reorderTeam } from '@/server/services/team'

// Statičan segment `order` ima prednost nad `[id]` — Next ga ne čita kao id.
export const PATCH = handleAdmin(async (request) => {
  await reorderTeam((await readJson(request, reorderSchema)).ids)
  return noContent()
})
