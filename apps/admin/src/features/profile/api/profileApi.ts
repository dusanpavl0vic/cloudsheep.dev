import { baseApi } from '@/store'

import type { ProfileInput, SocialLinkInput } from '../schemas/profile.schema'
import type { Profile, ProfileResponse, SocialLink } from '../types'

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    profile: build.query<ProfileResponse, undefined>({
      query: () => '/admin/profile',
      providesTags: ['Profile'],
    }),

    /** `PUT`, ne `PATCH`: forma je jedna i šalje se cela. */
    saveProfile: build.mutation<Profile, ProfileInput>({
      query: (body) => ({ url: '/admin/profile', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),

    createSocialLink: build.mutation<SocialLink, SocialLinkInput>({
      query: (body) => ({ url: '/admin/social-links', method: 'POST', body }),
      invalidatesTags: ['Profile'],
    }),

    updateSocialLink: build.mutation<SocialLink, { id: string; body: Partial<SocialLinkInput> }>({
      query: ({ id, body }) => ({ url: `/admin/social-links/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Profile'],
    }),

    reorderSocialLinks: build.mutation<undefined, string[]>({
      query: (ids) => ({ url: '/admin/social-links/order', method: 'PATCH', body: { ids } }),
      invalidatesTags: ['Profile'],
    }),

    deleteSocialLink: build.mutation<undefined, string>({
      query: (id) => ({ url: `/admin/social-links/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useProfileQuery,
  useSaveProfileMutation,
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
  useReorderSocialLinksMutation,
  useDeleteSocialLinkMutation,
} = profileApi
