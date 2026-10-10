import { reorderSchema } from '@/schemas/common'
import { handleAdmin } from '@/server/auth/session'
import { noContent, readJson } from '@/server/http'
import { reorderTestimonials } from '@/server/services/testimonials'

// Statičan segment `order` ima prednost nad `[id]` — Next ga ne čita kao id.
export const PATCH = handleAdmin(async (request) => {
  await reorderTestimonials((await readJson(request, reorderSchema)).ids)
  return noContent()
})
