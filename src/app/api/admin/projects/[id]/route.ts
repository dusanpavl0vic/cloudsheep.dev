import { HTTP_STATUS } from '@/constants/http'
import { updateProjectSchema } from '@/schemas/project'
import { handleAdmin } from '@/server/auth/session'
import { HttpError, json, noContent, readPatch } from '@/server/http'
import { deleteProject, getAdminProject, updateProject } from '@/server/services/projects'

export const GET = handleAdmin<{ id: string }>(async (_request, { params }) => {
  const item = await getAdminProject((await params).id)
  if (!item) throw new HttpError(HTTP_STATUS.NOT_FOUND, 'errors.notFound')
  return json(item)
})

export const PATCH = handleAdmin<{ id: string }>(async (request, { params }) =>
  json(
    await updateProject(
      (await params).id,
      await readPatch(request, updateProjectSchema, 'projects.errors.invalid'),
    ),
  ),
)

export const DELETE = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteProject((await params).id)
  return noContent()
})
