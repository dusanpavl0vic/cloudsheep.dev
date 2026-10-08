import { handle, json } from '@/server/http'
import { listFreeSlots } from '@/server/services/booking'

/** Slobodni termini — klijent ih osvežava kad termin koji je posetilac izabrao bude zauzet. */
export const GET = handle(async () => json({ items: await listFreeSlots() }))
