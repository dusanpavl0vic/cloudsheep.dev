import { baseApi } from '@/store'

import type { TechnologyInput } from '../schemas/technology.schema'
import type { Technology, TechnologyListResponse } from '../types'

export const technologiesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    technologies: build.query<TechnologyListResponse, undefined>({
      query: () => '/admin/technologies',
      providesTags: (result) => [
        ...(result?.items ?? []).map(({ id }) => ({ type: 'Technology' as const, id })),
        { type: 'Technology' as const, id: 'LIST' },
      ],
    }),

    createTechnology: build.mutation<Technology, TechnologyInput>({
      query: (body) => ({ url: '/admin/technologies', method: 'POST', body }),
      invalidatesTags: [{ type: 'Technology', id: 'LIST' }],
    }),

    updateTechnology: build.mutation<Technology, { id: string; body: TechnologyInput }>({
      query: ({ id, body }) => ({ url: `/admin/technologies/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Technology', id },
        { type: 'Technology', id: 'LIST' },
      ],
    }),

    deleteTechnology: build.mutation<undefined, string>({
      query: (id) => ({ url: `/admin/technologies/${id}`, method: 'DELETE' }),
      // Brisanje tehnologije menja i projekte koji je koriste (kaskada u bazi)
      invalidatesTags: [
        { type: 'Technology', id: 'LIST' },
        { type: 'Project', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useTechnologiesQuery,
  useCreateTechnologyMutation,
  useUpdateTechnologyMutation,
  useDeleteTechnologyMutation,
} = technologiesApi
