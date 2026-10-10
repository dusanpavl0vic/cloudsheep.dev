import { HTTP_STATUS } from '@/constants/http'
import { attachImageSchema } from '@/schemas/project'
import { handleAdmin } from '@/server/auth/session'
import { json, readJson } from '@/server/http'
import { attachProjectImage } from '@/server/services/projects'

export const POST = handleAdmin<{ id: string }>(async (request, { params }) =>
  json(
    await attachProjectImage(
      (await params).id,
      await readJson(request, attachImageSchema, 'projects.errors.invalid'),
    ),
    HTTP_STATUS.CREATED,
  ),
)
