import { updateImageSchema } from '@/schemas/project'
import { handleAdmin } from '@/server/auth/session'
import { noContent, readJson } from '@/server/http'
import { deleteProjectImage, updateProjectImage } from '@/server/services/projects'

export const PATCH = handleAdmin<{ id: string; imageId: string }>(async (request, { params }) => {
  await updateProjectImage(
    (await params).imageId,
    await readJson(request, updateImageSchema, 'projects.errors.invalid'),
  )
  return noContent()
})

export const DELETE = handleAdmin<{ id: string; imageId: string }>(async (_request, { params }) => {
  await deleteProjectImage((await params).imageId)
  return noContent()
})
