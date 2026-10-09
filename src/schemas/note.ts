import { z } from 'zod'

import { NOTE_LIMITS } from '@/constants/notes'

import { optionalText, requiredText, slugSchema, uuidOrNull } from './common'

export const noteSchema = z.object({
  slug: slugSchema,
  titleSr: requiredText(NOTE_LIMITS.titleMax),
  titleEn: requiredText(NOTE_LIMITS.titleMax),
  excerptSr: optionalText(NOTE_LIMITS.excerptMax),
  excerptEn: optionalText(NOTE_LIMITS.excerptMax),
  bodySr: requiredText(NOTE_LIMITS.bodyMax),
  bodyEn: requiredText(NOTE_LIMITS.bodyMax),
  tags: z
    .array(z.string().trim().min(1).max(NOTE_LIMITS.tagMax))
    .max(NOTE_LIMITS.tagsMax)
    .default([]),
  coverId: uuidOrNull,
  isPublished: z.boolean().default(false),
})

export const updateNoteSchema = noteSchema.partial()

export type NoteInput = z.input<typeof noteSchema>

/** Forma beleške u admin-u: oznake su tekst odvojen zarezom. */
export const noteFormSchema = noteSchema.extend({ tags: z.string().max(NOTE_LIMITS.tagsMax * (NOTE_LIMITS.tagMax + 2)) })

export type NoteForm = z.input<typeof noteFormSchema>

/** Forma → telo zahteva (oznake postaju niz, prazne i duplikati otpadaju). */
export const toNoteInput = ({ tags, ...rest }: z.output<typeof noteFormSchema>): NoteInput => ({
  ...rest,
  tags: [...new Set(tags.split(',').map((tag) => tag.trim()).filter(Boolean))],
})
