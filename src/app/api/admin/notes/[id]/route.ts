import { HTTP_STATUS } from '@/constants/http'
import { updateNoteSchema } from '@/schemas/note'
import { handleAdmin } from '@/server/auth/session'
import { HttpError, json, noContent, readJson } from '@/server/http'
import { deleteNote, getAdminNote, updateNote } from '@/server/services/notes'

export const GET = handleAdmin<{ id: string }>(async (_request, { params }) => {
  const item = await getAdminNote((await params).id)
  if (!item) throw new HttpError(HTTP_STATUS.NOT_FOUND, 'errors.notFound')
  return json(item)
})

export const PATCH = handleAdmin<{ id: string }>(async (request, { params }) =>
  json(
    await updateNote(
      (await params).id,
      await readJson(request, updateNoteSchema, 'notes.errors.invalid'),
    ),
  ),
)

export const DELETE = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteNote((await params).id)
  return noContent()
})
