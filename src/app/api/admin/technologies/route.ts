import { HTTP_STATUS } from '@/constants/http'
import { technologySchema } from '@/schemas/technology'
import { handleAdmin } from '@/server/auth/session'
import { json, readJson } from '@/server/http'
import { createTechnology, listAdminTechnologies } from '@/server/services/technologies'

export const GET = handleAdmin(async () => json({ items: await listAdminTechnologies() }))

export const POST = handleAdmin(async (request) =>
  json(
    await createTechnology(
      await readJson(request, technologySchema, 'technologies.errors.invalid'),
    ),
    HTTP_STATUS.CREATED,
  ),
)
