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

const TIMES_LIST = /^\s*([01]\d|2[0-3]):[0-5]\d(\s*,\s*([01]\d|2[0-3]):[0-5]\d)*\s*$/

/** Forma generatora u admin-u: satnice kao tekst („10:00, 14:30"), dani kao čekirani brojevi. */
export const slotGeneratorFormSchema = z
  .object({
    from: day,
    to: day,
    weekdays: z.array(z.number().int().min(1).max(7)).min(1, 'validation.pick'),
    times: z.string().regex(TIMES_LIST, 'validation.times'),
  })
  .refine((value) => value.from <= value.to, { path: ['to'], message: 'validation.dateRange' })

export type SlotGeneratorForm = z.infer<typeof slotGeneratorFormSchema>

/** Forma → telo zahteva; duplikati satnica se izbacuju, redosled sortira. */
export const toGenerateSlotsInput = ({ times, ...rest }: SlotGeneratorForm): GenerateSlotsInput => ({
  ...rest,
  times: [...new Set(times.split(',').map((time) => time.trim()))].sort(),
})
