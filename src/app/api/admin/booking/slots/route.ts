import { handleAdmin } from '@/server/auth/session'
import { json } from '@/server/http'
import { listAdminSlots } from '@/server/services/booking'

export const GET = handleAdmin(async () => json({ items: await listAdminSlots() }))
