import { HTTP_STATUS } from '@/constants/http'
import { cvSchema } from '@/schemas/cv'
import { handleAdmin } from '@/server/auth/session'
import { HttpError, json, readJson } from '@/server/http'
import { getCv, saveCv } from '@/server/services/team'

export const GET = handleAdmin<{ id: string }>(async (_request, { params }) => {
  const cv = await getCv((await params).id)
  if (!cv) throw new HttpError(HTTP_STATUS.NOT_FOUND, 'errors.notFound')
  return json(cv)
})

export const PUT = handleAdmin<{ id: string }>(async (request, { params }) =>
  json(await saveCv((await params).id, await readJson(request, cvSchema, 'cv.errors.invalid'))),
)
