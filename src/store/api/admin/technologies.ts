import { ADMIN_API_ENDPOINTS, API_TAGS } from '@/constants/adminApi'
import type { TechnologyInput } from '@/schemas/technology'
import type { AdminTechnology } from '@/types/technology'

import { baseApi } from '../baseApi'
import { crudEndpoints } from './crud'

export const technologiesApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    const crud = crudEndpoints<AdminTechnology, TechnologyInput>(build, API_TAGS.TECHNOLOGY, {
      list: ADMIN_API_ENDPOINTS.ADMIN_TECHNOLOGIES,
      item: ADMIN_API_ENDPOINTS.ADMIN_TECHNOLOGY,
      order: ADMIN_API_ENDPOINTS.ADMIN_TECHNOLOGIES_ORDER,
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
