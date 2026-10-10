import { profileSchema } from '@/schemas/profile'
import { handleAdmin } from '@/server/auth/session'
import { json, readJson } from '@/server/http'
import { getAdminProfile, updateProfile } from '@/server/services/profile'

export const GET = handleAdmin(async () => json(await getAdminProfile()))

export const PUT = handleAdmin(async (request) =>
  json(await updateProfile(await readJson(request, profileSchema, 'profile.errors.invalid'))),
)
