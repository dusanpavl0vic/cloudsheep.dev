import { HTTP_STATUS } from '@/constants/http'
import { projectSchema } from '@/schemas/project'
import { handleAdmin } from '@/server/auth/session'
import { json, readJson } from '@/server/http'
import { createProject, listAdminProjects } from '@/server/services/projects'

export const GET = handleAdmin(async () => json({ items: await listAdminProjects() }))

export const POST = handleAdmin(async (request) =>
  json(
    await createProject(await readJson(request, projectSchema, 'projects.errors.invalid')),
    HTTP_STATUS.CREATED,
  ),
)
