import { reorderSchema } from '@/schemas/common'
import { handleAdmin } from '@/server/auth/session'
import { noContent, readJson } from '@/server/http'
import { reorderProjects } from '@/server/services/projects'

// Statičan segment `order` ima prednost nad `[id]` — Next ga ne čita kao id.
export const PATCH = handleAdmin(async (request) => {
  await reorderProjects((await readJson(request, reorderSchema)).ids)
  return noContent()
})
