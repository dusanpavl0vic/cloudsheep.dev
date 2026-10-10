import { markReadSchema } from '@/schemas/contact'
import { handleAdmin } from '@/server/auth/session'
import { noContent, readJson } from '@/server/http'
import { deleteMessage, markMessageRead } from '@/server/services/contact'

export const PATCH = handleAdmin<{ id: string }>(async (request, { params }) => {
  await markMessageRead((await params).id, (await readJson(request, markReadSchema)).isRead)
  return noContent()
})

export const DELETE = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteMessage((await params).id)
  return noContent()
})
