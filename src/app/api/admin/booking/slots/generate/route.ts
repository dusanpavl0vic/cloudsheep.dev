import { HTTP_STATUS } from '@/constants/http'
import { generateSlotsSchema } from '@/schemas/booking'
import { handleAdmin } from '@/server/auth/session'
import { json, readJson } from '@/server/http'
import { generateSlots } from '@/server/services/booking'

export const POST = handleAdmin(async (request) =>
  json(
    await generateSlots(await readJson(request, generateSlotsSchema, 'booking.errors.invalid')),
    HTTP_STATUS.CREATED,
  ),
)
