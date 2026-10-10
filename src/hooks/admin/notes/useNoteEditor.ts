'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useWatch } from 'react-hook-form'

import type { Locale } from '@/constants/i18n'
import { adminNoteHref } from '@/constants/routes'
import { renderMarkdown } from '@/helpers/markdown'
import { noteFormSchema, toNoteInput } from '@/schemas/note'
import { useCreateNoteMutation, useGetNotesQuery, useUpdateNoteMutation } from '@/store/api/admin/notes'
import type { Asset } from '@/types/media'
import type { AdminNote } from '@/types/note'

import { useAdminForm } from '../useAdminForm'

/** Beleška za editor: `noteId` — postojeća (čeka spisak), bez njega — nova. */
export const useNotePage = (noteId: string | undefined) => {
  const query = useGetNotesQuery(undefined, { skip: !noteId })
  const note = query.data?.find((item) => item.id === noteId)
  return { note, isLoading: Boolean(noteId) && query.isLoading, isMissing: Boolean(noteId) && query.isSuccess && !note, isError: query.isError }
}

/** Editor beleške: forma, jezik teksta koji se piše (EN/SR) i pregled markdown-a uživo. */
export const useNoteEditor = (note: AdminNote | undefined) => {
  const router = useRouter()
  const [create] = useCreateNoteMutation()
  const [update] = useUpdateNoteMutation()
  const [bodyLocale, setBodyLocale] = useState<Locale>('en')
  const [coverUrl, setCoverUrl] = useState(note?.coverUrl ?? null)

  const admin = useAdminForm({
    schema: noteFormSchema,
    defaultValues: {
      slug: note?.slug ?? '',
      titleSr: note?.titleSr ?? '',
      titleEn: note?.titleEn ?? '',
      excerptSr: note?.excerptSr ?? '',
      excerptEn: note?.excerptEn ?? '',
      bodySr: note?.bodySr ?? '',
      bodyEn: note?.bodyEn ?? '',
      tags: note?.tags.join(', ') ?? '',
      coverId: note?.coverId ?? null,
      isPublished: note?.isPublished ?? false,
    },
    save: async (values) => {
      if (note) return update({ id: note.id, patch: toNoteInput(values) }).unwrap()
      const created = await create(toNoteInput(values)).unwrap()
      // Nova beleška dobija svoju adresu — dalje čuvanje je izmena, ne nova beleška.
      router.replace(adminNoteHref(created.id))
      return created
    },
    // Tekst na drugom jeziku nije prikazan — prebaci na njega, inače se greška ne vidi.
    onInvalid: (errors) => {
      const current = bodyLocale === 'sr' ? errors.bodySr : errors.bodyEn
      if (!current && errors.bodySr) setBodyLocale('sr')
      else if (!current && errors.bodyEn) setBodyLocale('en')
    },
  })
  const body = useWatch({ control: admin.form.control, name: bodyLocale === 'sr' ? 'bodySr' : 'bodyEn' })

  return {
    ...admin,
    isEdit: Boolean(note),
    bodyLocale,
    setBodyLocale,
    previewHtml: renderMarkdown(body),
    coverUrl,
    setCover: (asset: Asset | null) => {
      setCoverUrl(asset?.url ?? null)
      admin.form.setValue('coverId', asset?.id ?? null, { shouldDirty: true })
    },
  }
}
