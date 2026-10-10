import { HTTP_STATUS } from '@/constants/http'
import { handleAdmin } from '@/server/auth/session'
import { env } from '@/server/env'
import { HttpError, json } from '@/server/http'
import { LIMITS } from '@/server/rateLimit'
import { createAsset } from '@/server/services/assets'

/**
 * Otpremanje slike (`multipart/form-data`, polje `file`). Veličina se proverava PRE čitanja
 * tela (Content-Length), pa 50 MB ne završi u memoriji uzalud; magični bajtovi pre upisa na disk.
 */
export const POST = handleAdmin(async (request, _context, user) => {
  LIMITS.uploads(user.sub)

  const length = Number(request.headers.get('content-length') ?? 0)
  if (length > env().MAX_UPLOAD_BYTES + 64 * 1024) throw new HttpError(HTTP_STATUS.PAYLOAD_TOO_LARGE, 'uploads.errors.tooLarge')

  const file = (await request.formData()).get('file')
  if (!(file instanceof File)) throw new HttpError(HTTP_STATUS.BAD_REQUEST, 'uploads.errors.missing')

  const asset = await createAsset({ buffer: Buffer.from(await file.arrayBuffer()), name: file.name })
  return json(asset, HTTP_STATUS.CREATED)
})
