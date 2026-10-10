'use client'

import { useLocale, useTranslations } from 'next-intl'

import { formatDate } from '@/helpers/date'
import { useDeleteNoteMutation, useGetNotesQuery, useUpdateNoteMutation } from '@/store/api/admin/notes'
import type { AdminNote } from '@/types/note'

import { useAdminAction } from '../useAdminAction'

/** Beleške: spisak (najnovije prve), objava jednim klikom, brisanje. Izmena je zasebna stranica. */
export const useNotes = () => {
  const t = useTranslations('admin.notes')
  const locale = useLocale()
  const query = useGetNotesQuery(undefined)
  const [update] = useUpdateNoteMutation()
  const [deleteNote] = useDeleteNoteMutation()
  const { run, remove } = useAdminAction()
  const titleOf = (note: AdminNote) => (locale === 'sr' ? note.titleSr : note.titleEn)

  return {
    items: (query.data ?? []).map((note) => ({ ...note, title: titleOf(note), updated: formatDate(note.updatedAt, locale) })),
    isLoading: query.isLoading,
    isError: query.isError,
    togglePublished: (note: AdminNote) => run(() => update({ id: note.id, patch: { isPublished: !note.isPublished } }).unwrap(), 'saved'),
    remove: (note: AdminNote) => remove(t('deleteConfirm', { title: titleOf(note) }), () => deleteNote(note.id).unwrap()),
  }
}
