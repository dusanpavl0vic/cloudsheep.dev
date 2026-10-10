import { handleAdmin } from '@/server/auth/session'
import { noContent } from '@/server/http'
import { deleteSlot, releaseSlot } from '@/server/services/booking'

/** Brisanje slobodnog termina. Zauzet se prvo oslobađa (PATCH), da posetilac ne izgubi poziv tiho. */
export const DELETE = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await deleteSlot((await params).id)
  return noContent()
})

/** Oslobađa zauzet termin. */
export const PATCH = handleAdmin<{ id: string }>(async (_request, { params }) => {
  await releaseSlot((await params).id)
  return noContent()
})
