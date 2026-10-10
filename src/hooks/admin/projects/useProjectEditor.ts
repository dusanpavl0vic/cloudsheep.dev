'use client'

import { useRouter } from 'next/navigation'
import { useWatch } from 'react-hook-form'

import { adminProjectHref } from '@/constants/routes'
import { projectFormSchema, toProjectInput, type ProjectForm } from '@/schemas/project'
import { useCreateProjectMutation, useGetProjectsQuery, useUpdateProjectMutation } from '@/store/api/admin/projects'
import { useGetTechnologiesQuery } from '@/store/api/admin/technologies'
import type { AdminProject } from '@/types/project'

import { useAdminForm } from '../useAdminForm'
import { useFormList } from '../useFormList'

const TEXT = ['titleSr', 'titleEn', 'catSr', 'catEn', 'descSr', 'descEn', 'captionSr', 'captionEn', 'roleSr', 'roleEn', 'timelineSr', 'timelineEn', 'client'] as const

const defaultsOf = (project: AdminProject | undefined) => ({
  ...Object.fromEntries(TEXT.map((field) => [field, project?.[field] ?? ''])),
  slug: project?.slug ?? '',
  category: project?.category ?? 'fullStack',
  year: project?.year ?? new Date().getFullYear(),
  metrics: project?.metrics ?? [],
  chapters: project?.chapters ?? [],
  growth: project?.growth.join(', ') ?? '',
  technologyIds: project?.technologyIds ?? [],
  galleryLayout: project?.galleryLayout ?? 'grid',
  liveUrl: project?.liveUrl ?? '',
  repoUrl: project?.repoUrl ?? '',
  isPublished: project?.isPublished ?? false,
  isFeatured: project?.isFeatured ?? false,
})

/** Projekat za editor: `projectId` — postojeći (čeka spisak), bez njega — novi. */
export const useProjectPage = (projectId: string | undefined) => {
  const query = useGetProjectsQuery(undefined, { skip: !projectId })
  const project = query.data?.find((item) => item.id === projectId)
  return {
    project,
    isLoading: Boolean(projectId) && query.isLoading,
    isError: query.isError || (Boolean(projectId) && query.isSuccess && !project),
  }
}

/** Editor projekta: forma, rezultati i poglavlja kao ponavljajuće grupe, izbor tehnologija. */
export const useProjectEditor = (project: AdminProject | undefined) => {
  const router = useRouter()
  const [create] = useCreateProjectMutation()
  const [update] = useUpdateProjectMutation()
  const { technologies } = useGetTechnologiesQuery(undefined, {
    selectFromResult: ({ data }) => ({ technologies: data ?? [] }),
  })

  const admin = useAdminForm({
    schema: projectFormSchema,
    defaultValues: defaultsOf(project),
    save: async (values) => {
      if (project) return update({ id: project.id, patch: toProjectInput(values) }).unwrap()
      const created = await create(toProjectInput(values)).unwrap()
      router.replace(adminProjectHref(created.id))
      return created
    },
  })
  const { control } = admin.form
  const metrics = useFormList<ProjectForm, unknown, NonNullable<ProjectForm['metrics']>[number]>({ control, setValue: admin.form.setValue, name: 'metrics' })
  const chapters = useFormList<ProjectForm, unknown, NonNullable<ProjectForm['chapters']>[number]>({ control, setValue: admin.form.setValue, name: 'chapters' })
  // `useWatch`, ne `form.watch` — Compiler bi memoizovao rezultat.
  const selected = useWatch({ control, name: 'technologyIds' }) ?? []

  return {
    ...admin,
    isEdit: Boolean(project),
    metrics: {
      items: metrics.items,
      add: () => {
        metrics.add({ value: '', labelSr: '', labelEn: '' })
      },
      remove: metrics.remove,
    },
    chapters: {
      items: chapters.items,
      add: () => {
        chapters.add({ titleSr: '', titleEn: '', bodySr: '', bodyEn: '' })
      },
      remove: chapters.remove,
    },
    technologies: technologies.map((technology) => ({ ...technology, selected: selected.includes(technology.id) })),
    toggleTechnology: (id: string) => {
      const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]
      admin.form.setValue('technologyIds', next, { shouldDirty: true })
    },
  }
}

export type ProjectEditorApi = ReturnType<typeof useProjectEditor>
