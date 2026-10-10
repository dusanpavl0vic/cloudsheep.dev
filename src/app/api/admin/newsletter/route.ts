import { handleAdmin } from '@/server/auth/session'
import { json } from '@/server/http'
import { listSubscribers } from '@/server/services/newsletter'

export const GET = handleAdmin(async () => json({ items: await listSubscribers() }))
