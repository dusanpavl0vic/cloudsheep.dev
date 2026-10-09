import type { EndpointBuilder } from '@reduxjs/toolkit/query/react'

import { API_LIST_ID, type API_REDUCER_PATH, type ApiTag } from '@/constants/api'

import type { baseQuery } from '../baseQuery'

type Builder = EndpointBuilder<typeof baseQuery, ApiTag, typeof API_REDUCER_PATH>

interface CrudUrls {
  list: string
  item: (id: string) => string
  /** Redosled (`PATCH { ids }`) — samo za liste koje se ređaju. */
  order?: string
}

/**
 * Isti CRUD za svaki admin spisak: lista (`{ items }`), dodavanje, izmena (`PATCH` delimično),
 * brisanje i redosled. Svaka mutacija poništava listu, pa se tabela sama osveži.
 */
export const crudEndpoints = <Item extends { id: string }, Input>(build: Builder, tag: ApiTag, urls: CrudUrls) => {
  const LIST = { type: tag, id: API_LIST_ID }

  return {
    list: build.query<Item[], undefined>({
      query: () => urls.list,
      transformResponse: (response: { items: Item[] }) => response.items,
      providesTags: [LIST],
    }),
    create: build.mutation<Item, Input>({
      query: (body) => ({ url: urls.list, method: 'POST', body }),
      invalidatesTags: [LIST],
    }),
    update: build.mutation<Item, { id: string; patch: Partial<Input> }>({
      query: ({ id, patch }) => ({ url: urls.item(id), method: 'PATCH', body: patch }),
      invalidatesTags: [LIST],
    }),
    remove: build.mutation<undefined, string>({
      query: (id) => ({ url: urls.item(id), method: 'DELETE' }),
      invalidatesTags: [LIST],
    }),
    reorder: build.mutation<undefined, string[]>({
      query: (ids) => ({ url: urls.order ?? urls.list, method: 'PATCH', body: { ids } }),
      invalidatesTags: [LIST],
    }),
  }
}
