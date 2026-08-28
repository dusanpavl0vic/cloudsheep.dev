import { baseApi } from '@/store'

import type { TeamMemberInput } from '../schemas/team.schema'
import type { Cv, CvLang, TeamListResponse, TeamMember } from '../types'

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

    cv: build.query<Cv, string>({
      query: (id) => `/admin/team/${id}/cv`,
      providesTags: (_r, _e, id) => [{ type: 'TeamMember', id: `cv-${id}` }],
    }),

    saveCv: build.mutation<Cv, { id: string; body: unknown }>({
      query: ({ id, body }) => ({ url: `/admin/team/${id}/cv`, method: 'PUT', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'TeamMember', id: `cv-${id}` }],
    }),

    /**
     * Preuzimanje PDF-a — jedini binarni odgovor u aplikaciji.
     *
     * Ide kroz RTKQ, a ne kroz goli `fetch`, da bi token i obnova sesije na 401 radili sami
     * (`createBaseApi` to već nosi).
     *
     * `responseHandler` GRANA po `res.ok`, i to je ceo razlog zbog kog je napisan ručno:
     * sa `responseHandler: 'blob'` bi i telo GREŠKE bilo `Blob`, a `normalizeError` čita
     * `isRecord(error.data)` — poruka sa servera bi se tiho izgubila i korisnik bi dobio
     * „nepoznata greška" umesto razloga.
     *
     * `mutation`, ne `query`: PDF se ne kešira. Menja se pri svakoj izmeni CV-a, a `Blob` u
     * Redux store-u nije podatak nego datoteka.
     */
    cvPdf: build.mutation<Blob, { id: string; lang: CvLang }>({
      query: ({ id, lang }) => ({
        url: `/admin/team/${id}/cv.pdf?lang=${lang}`,
        responseHandler: (response) => (response.ok ? response.blob() : response.json()),
      }),
    }),
  }),
})

export const {
  useTeamQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useReorderTeamMutation,
  useDeleteMemberMutation,
  useCvQuery,
  useSaveCvMutation,
  useCvPdfMutation,
} = teamApi
