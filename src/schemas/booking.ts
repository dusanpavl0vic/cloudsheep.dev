import { z } from 'zod'

import { BOOKING_SLOT_MINUTES } from '@/constants/booking'

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'validation.time')
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'validation.date')

/**
 * Generator termina u admin-u: od–do (datumi u vremenu studija), dani u nedelji (1 = ponedeljak)
 * i satnice. Termin koji već postoji se preskače.
 */
export const generateSlotsSchema = z
  .object({
    from: day,
    to: day,
    weekdays: z.array(z.number().int().min(1).max(7)).min(1, 'validation.pick'),
    times: z.array(time).min(1, 'validation.pick').max(16),
    durationMin: z.number().int().min(15).max(120).default(BOOKING_SLOT_MINUTES),
  })
  .refine((value) => value.from <= value.to, { path: ['to'], message: 'validation.dateRange' })

export type GenerateSlotsInput = z.input<typeof generateSlotsSchema>
