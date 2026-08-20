import { baseApi } from '@/store'

import type { TeamMemberInput } from '../schemas/team.schema'
import type { TeamListResponse, TeamMember } from '../types'

export const teamApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    team: build.query<TeamListResponse, undefined>({
      query: () => '/admin/team',
      providesTags: (result) => [
        ...(result?.items ?? []).map(({ id }) => ({ type: 'TeamMember' as const, id })),
        { type: 'TeamMember' as const, id: 'LIST' },
      ],
    }),

    createMember: build.mutation<TeamMember, TeamMemberInput>({
      query: (body) => ({ url: '/admin/team', method: 'POST', body }),
      invalidatesTags: [{ type: 'TeamMember', id: 'LIST' }],
    }),

    updateMember: build.mutation<TeamMember, { id: string; body: Partial<TeamMemberInput> }>({
      query: ({ id, body }) => ({ url: `/admin/team/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'TeamMember', id },
        { type: 'TeamMember', id: 'LIST' },
      ],
    }),

    reorderTeam: build.mutation<undefined, string[]>({
      query: (ids) => ({ url: '/admin/team/order', method: 'PATCH', body: { ids } }),
      invalidatesTags: [{ type: 'TeamMember', id: 'LIST' }],
    }),

    deleteMember: build.mutation<undefined, string>({
      query: (id) => ({ url: `/admin/team/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'TeamMember', id: 'LIST' }],
    }),
  }),
})

export const {
  useTeamQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useReorderTeamMutation,
  useDeleteMemberMutation,
} = teamApi
