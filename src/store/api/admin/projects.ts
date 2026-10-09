import { API_ENDPOINTS, API_LIST_ID, API_TAGS } from '@/constants/api'
import type { AttachImageInput, ProjectInput, UpdateImageInput } from '@/schemas/project'
import type { AdminProject, AdminProjectImage } from '@/types/project'

import { baseApi } from '../baseApi'
import { crudEndpoints } from './crud'

const LIST = { type: API_TAGS.PROJECT, id: API_LIST_ID } as const

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => {
    const crud = crudEndpoints<AdminProject, ProjectInput>(build, API_TAGS.PROJECT, {
      list: API_ENDPOINTS.ADMIN_PROJECTS,
      item: API_ENDPOINTS.ADMIN_PROJECT,
      order: API_ENDPOINTS.ADMIN_PROJECTS_ORDER,
    })
    return {
      getProjects: crud.list,
      createProject: crud.create,
      updateProject: crud.update,
      deleteProject: crud.remove,
      reorderProjects: crud.reorder,
      addProjectImage: build.mutation<AdminProjectImage, AttachImageInput & { projectId: string }>({
        query: ({ projectId, ...body }) => ({ url: API_ENDPOINTS.ADMIN_PROJECT_IMAGES(projectId), method: 'POST', body }),
        invalidatesTags: [LIST],
      }),
      updateProjectImage: build.mutation<undefined, { projectId: string; imageId: string; patch: UpdateImageInput }>({
        query: ({ projectId, imageId, patch }) => ({ url: API_ENDPOINTS.ADMIN_PROJECT_IMAGE(projectId, imageId), method: 'PATCH', body: patch }),
        invalidatesTags: [LIST],
      }),
      deleteProjectImage: build.mutation<undefined, { projectId: string; imageId: string }>({
        query: ({ projectId, imageId }) => ({ url: API_ENDPOINTS.ADMIN_PROJECT_IMAGE(projectId, imageId), method: 'DELETE' }),
        invalidatesTags: [LIST],
      }),
      reorderProjectImages: build.mutation<undefined, { projectId: string; ids: string[] }>({
        query: ({ projectId, ids }) => ({ url: API_ENDPOINTS.ADMIN_PROJECT_IMAGES_ORDER(projectId), method: 'PATCH', body: { ids } }),
        invalidatesTags: [LIST],
      }),
    }
  },
})

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
  useAddProjectImageMutation,
  useUpdateProjectImageMutation,
  useDeleteProjectImageMutation,
  useReorderProjectImagesMutation,
} = projectsApi
