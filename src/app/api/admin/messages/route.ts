import { messageQuerySchema } from '@/schemas/contact'
import { handleAdmin } from '@/server/auth/session'
import { json, readQuery } from '@/server/http'
import { listMessages } from '@/server/services/contact'

export const GET = handleAdmin(async (request) =>
  json(await listMessages(readQuery(request, messageQuerySchema).status)),
)
