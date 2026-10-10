import { ADMIN_API_ENDPOINTS, API_TAGS } from '@/constants/adminApi'
import type { NoteInput } from '@/schemas/note'
import type { AdminNote } from '@/types/note'

import { baseApi } from '../baseApi'
import { crudEndpoints } from './crud'

export const notesApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    const crud = crudEndpoints<AdminNote, NoteInput>(build, API_TAGS.NOTE, {
      list: ADMIN_API_ENDPOINTS.ADMIN_NOTES,
      item: ADMIN_API_ENDPOINTS.ADMIN_NOTE,
    })
    return { getNotes: crud.list, createNote: crud.create, updateNote: crud.update, deleteNote: crud.remove }
  },
})

export const { useGetNotesQuery, useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } = notesApi
