import { updateTechnologySchema } from '@/schemas/technology'
import { handleAdmin } from '@/server/auth/session'
import { json, noContent, readPatch } from '@/server/http'
import { deleteTechnology, updateTechnology } from '@/server/services/technologies'

export const PATCH = handleAdmin<{ id: string }>(async (request, { params }) =>
  json(
    await updateTechnology(
      (await params).id,
      await readPatch(request, updateTechnologySchema, 'technologies.errors.invalid'),
    ),
  ),
)

export const DELETE = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteTechnology((await params).id)
  return noContent()
})
