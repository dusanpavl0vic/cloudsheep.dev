import { API_ENDPOINTS, API_TAGS } from '@/constants/api'
import type { ProfileInput, SocialLinkInput } from '@/schemas/profile'
import type { AdminProfile, AdminSocialLink } from '@/types/profile'

import { baseApi } from '../baseApi'

/** Profil i linkovi stižu zajedno (`GET /admin/profile`), pa svaka izmena linka osveži profil. */
const PROFILE = [API_TAGS.PROFILE]

export const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<{ profile: AdminProfile | null; links: AdminSocialLink[] }, undefined>({
      query: () => API_ENDPOINTS.ADMIN_PROFILE,
      providesTags: PROFILE,
    }),
    updateProfile: build.mutation<AdminProfile, ProfileInput>({
      query: (body) => ({ url: API_ENDPOINTS.ADMIN_PROFILE, method: 'PUT', body }),
      invalidatesTags: PROFILE,
    }),
    createSocialLink: build.mutation<AdminSocialLink, SocialLinkInput>({
      query: (body) => ({ url: API_ENDPOINTS.ADMIN_SOCIAL_LINKS, method: 'POST', body }),
      invalidatesTags: PROFILE,
    }),
    updateSocialLink: build.mutation<AdminSocialLink, { id: string; patch: Partial<SocialLinkInput> }>({
      query: ({ id, patch }) => ({ url: API_ENDPOINTS.ADMIN_SOCIAL_LINK(id), method: 'PATCH', body: patch }),
      invalidatesTags: PROFILE,
    }),
    deleteSocialLink: build.mutation<undefined, string>({
      query: (id) => ({ url: API_ENDPOINTS.ADMIN_SOCIAL_LINK(id), method: 'DELETE' }),
      invalidatesTags: PROFILE,
    }),
    reorderSocialLinks: build.mutation<undefined, string[]>({
      query: (ids) => ({ url: API_ENDPOINTS.ADMIN_SOCIAL_LINKS_ORDER, method: 'PATCH', body: { ids } }),
      invalidatesTags: PROFILE,
    }),
  }),
})

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
  useDeleteSocialLinkMutation,
  useReorderSocialLinksMutation,
} = profileApi
