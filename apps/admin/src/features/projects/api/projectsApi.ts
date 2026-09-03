import { baseApi } from '@/store'

import type { AdminProject, ProjectListResponse } from '../types'

/** Telo koje server očekuje: `tech` je niz, prazan URL je `null`. */
export interface ProjectImagePayload {
  assetId: string
  altSr: string
  altEn: string
}

export interface ProjectPayload {
  slug: string
  category: AdminProject['category']
  year: number
  titleSr: string
  titleEn: string
  catSr: string
  catEn: string
  descSr: string
  descEn: string
  captionSr: string
  captionEn: string
  technologyIds: string[]
  galleryLayout: 'grid' | 'feature' | 'none'
  liveUrl: string | null
  repoUrl: string | null
  isPublished: boolean
  isFeatured: boolean
}

/**
 * Endpointi se dodaju kroz `injectEndpoints` — nikad novi `createApi` (docs/11).
 * Generisane hookove troši SAMO feature hook, nikad komponenta (docs/13).
 *
 * Tagovi su u list/id obliku: izmena jednog projekta poništava njegov keš i keš liste, ali
 * ne i ostale projekte. Sa golim `'Project'` bi svaka izmena povukla ponovo baš sve.
 */
export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminProjects: build.query<ProjectListResponse, undefined>({
      query: () => '/admin/projects',
      providesTags: (result) => [
        ...(result?.items ?? []).map(({ id }) => ({ type: 'Project' as const, id })),
        { type: 'Project' as const, id: 'LIST' },
      ],
    }),

    adminProject: build.query<AdminProject, string>({
      query: (id) => `/admin/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Project' as const, id }],
    }),

    createProject: build.mutation<AdminProject, ProjectPayload>({
      query: (body) => ({ url: '/admin/projects', method: 'POST', body }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),

    updateProject: build.mutation<AdminProject, { id: string; body: ProjectPayload }>({
      query: ({ id, body }) => ({ url: `/admin/projects/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
    }),

    deleteProject: build.mutation<undefined, string>({
      query: (id) => ({ url: `/admin/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),

    /** Prevlačenje redosleda projekata šalje ceo niz id-eva u novom poretku. */
    reorderProjects: build.mutation<undefined, string[]>({
      query: (ids) => ({ url: '/admin/projects/order', method: 'PATCH', body: { ids } }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),

    // ── Slike ──────────────────────────────────────────────────────────────────
    // Zasebni endpointi, ne polje u telu projekta: otpremanje je ionako zaseban korak,
    // pa bi guranje celog spiska kroz `PATCH /projects/:id` slalo i slike koje niko nije dirao.

    attachImage: build.mutation<{ id: string }, { projectId: string; body: ProjectImagePayload }>({
      query: ({ projectId, body }) => ({
        url: `/admin/projects/${projectId}/images`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { projectId }) => [{ type: 'Project', id: projectId }],
    }),

    updateImage: build.mutation<
      undefined,
      { projectId: string; imageId: string; body: { altSr?: string; altEn?: string } }
    >({
      query: ({ projectId, imageId, body }) => ({
        url: `/admin/projects/${projectId}/images/${imageId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, { projectId }) => [{ type: 'Project', id: projectId }],
    }),

    reorderImages: build.mutation<undefined, { projectId: string; ids: string[] }>({
      query: ({ projectId, ids }) => ({
        url: `/admin/projects/${projectId}/images/order`,
        method: 'PATCH',
        body: { ids },
      }),
      invalidatesTags: (_r, _e, { projectId }) => [{ type: 'Project', id: projectId }],
    }),

    deleteImage: build.mutation<undefined, { projectId: string; imageId: string }>({
      query: ({ projectId, imageId }) => ({
        url: `/admin/projects/${projectId}/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { projectId }) => [{ type: 'Project', id: projectId }],
    }),
  }),
})

export const {
  useAdminProjectsQuery,
  useAdminProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
  useAttachImageMutation,
  useUpdateImageMutation,
  useReorderImagesMutation,
  useDeleteImageMutation,
} = projectsApi
