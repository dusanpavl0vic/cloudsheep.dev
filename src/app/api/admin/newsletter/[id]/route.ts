import { handleAdmin } from '@/server/auth/session'
import { noContent } from '@/server/http'
import { deleteSubscriber } from '@/server/services/newsletter'

export const DELETE = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteSubscriber((await params).id)
  return noContent()
})
