import { HTTP_STATUS } from '@/constants/http'
import { noteSchema } from '@/schemas/note'
import { handleAdmin } from '@/server/auth/session'
import { json, readJson } from '@/server/http'
import { createNote, listAdminNotes } from '@/server/services/notes'

export const GET = handleAdmin(async () => json({ items: await listAdminNotes() }))

export const POST = handleAdmin(async (request) =>
  json(
    await createNote(await readJson(request, noteSchema, 'notes.errors.invalid')),
    HTTP_STATUS.CREATED,
  ),
)
