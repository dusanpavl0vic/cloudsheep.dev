import { ADMIN_API_ENDPOINTS, API_TAGS } from '@/constants/adminApi'
import type { TestimonialInput } from '@/schemas/testimonial'
import type { AdminTestimonial } from '@/types/testimonial'

import { baseApi } from '../baseApi'
import { crudEndpoints } from './crud'

export const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    const crud = crudEndpoints<AdminTestimonial, TestimonialInput>(build, API_TAGS.TESTIMONIAL, {
      list: ADMIN_API_ENDPOINTS.ADMIN_TESTIMONIALS,
      item: ADMIN_API_ENDPOINTS.ADMIN_TESTIMONIAL,
      order: ADMIN_API_ENDPOINTS.ADMIN_TESTIMONIALS_ORDER,
    })
    return {
      getTestimonials: crud.list,
      createTestimonial: crud.create,
      updateTestimonial: crud.update,
      deleteTestimonial: crud.remove,
      reorderTestimonials: crud.reorder,
    }
  },
})

export const {
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useReorderTestimonialsMutation,
} = testimonialsApi
