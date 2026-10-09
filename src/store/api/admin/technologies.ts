import { API_ENDPOINTS, API_TAGS } from '@/constants/api'
import type { TechnologyInput } from '@/schemas/technology'
import type { AdminTechnology } from '@/types/technology'

import { baseApi } from '../baseApi'
import { crudEndpoints } from './crud'

export const technologiesApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    const crud = crudEndpoints<AdminTechnology, TechnologyInput>(build, API_TAGS.TECHNOLOGY, {
      list: API_ENDPOINTS.ADMIN_TECHNOLOGIES,
      item: API_ENDPOINTS.ADMIN_TECHNOLOGY,
      order: API_ENDPOINTS.ADMIN_TECHNOLOGIES_ORDER,
    })
    return {
      getTechnologies: crud.list,
      createTechnology: crud.create,
      updateTechnology: crud.update,
      deleteTechnology: crud.remove,
      reorderTechnologies: crud.reorder,
    }
  },
})

export const {
  useGetTechnologiesQuery,
  useCreateTechnologyMutation,
  useUpdateTechnologyMutation,
  useDeleteTechnologyMutation,
  useReorderTechnologiesMutation,
} = technologiesApi
