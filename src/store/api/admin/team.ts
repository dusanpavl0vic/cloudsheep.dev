import { API_ENDPOINTS, API_LIST_ID, API_TAGS } from '@/constants/api'
import type { CvInput } from '@/schemas/cv'
import type { TeamMemberInput } from '@/schemas/team'
import type { AdminCv } from '@/types/cv'
import type { AdminTeamMember } from '@/types/team'

import { baseApi } from '../baseApi'
import { crudEndpoints } from './crud'

export const teamApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    const crud = crudEndpoints<AdminTeamMember, TeamMemberInput>(build, API_TAGS.TEAM_MEMBER, {
      list: API_ENDPOINTS.ADMIN_TEAM,
      item: API_ENDPOINTS.ADMIN_TEAM_MEMBER,
      order: API_ENDPOINTS.ADMIN_TEAM_ORDER,
    })
    return {
      getTeam: crud.list,
      createTeamMember: crud.create,
      updateTeamMember: crud.update,
      deleteTeamMember: crud.remove,
      reorderTeam: crud.reorder,
      getCv: build.query<AdminCv, string>({
        query: (memberId) => API_ENDPOINTS.ADMIN_TEAM_CV(memberId),
        providesTags: (_result, _error, memberId) => [{ type: API_TAGS.CV, id: memberId }],
      }),
      /** CV menja i diplomu na članu — zato poništava i listu tima. */
      saveCv: build.mutation<AdminCv, { memberId: string; cv: CvInput }>({
        query: ({ memberId, cv }) => ({ url: API_ENDPOINTS.ADMIN_TEAM_CV(memberId), method: 'PUT', body: cv }),
        invalidatesTags: (_result, _error, { memberId }) => [
          { type: API_TAGS.CV, id: memberId },
          { type: API_TAGS.TEAM_MEMBER, id: API_LIST_ID },
        ],
      }),
      /**
       * PDF kao object URL — link ne može da nosi Authorization zaglavlje, a Blob ne sme u
       * Redux (nije serijalizabilan). Pozivalac oslobađa URL posle preuzimanja.
       */
      downloadCvPdf: build.mutation<string, { memberId: string; lang: 'sr' | 'en' }>({
        query: ({ memberId, lang }) => ({
          url: API_ENDPOINTS.ADMIN_TEAM_CV_PDF(memberId),
          params: { lang },
          responseHandler: async (response): Promise<unknown> => (response.ok ? URL.createObjectURL(await response.blob()) : response.json()),
        }),
      }),
    }
  },
})

export const {
  useGetTeamQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  useReorderTeamMutation,
  useGetCvQuery,
  useSaveCvMutation,
  useDownloadCvPdfMutation,
} = teamApi
