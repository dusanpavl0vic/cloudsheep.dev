import { useCallback } from 'react'

import {
  useAdminProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  type ProjectPayload,
} from '../api/projectsApi'
import type { ProjectInput } from '../schemas/project.schema'

/** Prazan string iz forme znači „nema linka" — server očekuje `null`, ne `''`. */
const toPayload = (values: ProjectInput): ProjectPayload => ({
  ...values,
  technologyIds: [...values.technologyIds],
  liveUrl: values.liveUrl === '' ? null : values.liveUrl,
  repoUrl: values.repoUrl === '' ? null : values.repoUrl,
})

/**
 * Jedan hook i za novi i za postojeći projekat.
 *
 * Razdvajanje na `useCreateProject` i `useUpdateProject` bi značilo da stranica bira koji
 * da zove, dakle logiku u stranici — a `docs/02` kaže da stranica nema logiku. Ovako
 * stranica prosledi `id` ili ne prosledi.
 */
export function useProjectForm(id?: string) {
  const { data: project, isLoading } = useAdminProjectQuery(id ?? '', { skip: !id })
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation()
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()

  // memo: referencijalna stabilnost — `save` ide u dependency array `handleSubmit`-a.
  const save = useCallback(
    async (values: ProjectInput) => {
      const body = toPayload(values)
      const result = id ? await updateProject({ id, body }) : await createProject(body)

      if ('error' in result) return { ok: false as const, error: result.error }
      return { ok: true as const }
    },
    [id, createProject, updateProject],
  )

  return {
    project,
    save,
    isLoading: Boolean(id) && isLoading,
    isSaving: isCreating || isUpdating,
  }
}
