'use client'

import { useLocale, useTranslations } from 'next-intl'

import { useDeleteProjectMutation, useGetProjectsQuery, useReorderProjectsMutation, useUpdateProjectMutation } from '@/store/api/admin/projects'
import type { AdminProject } from '@/types/project'

import { useAdminAction } from '../useAdminAction'
import { useReorder } from '../useReorder'

/** Projekti: redosled sa sajta, objava i isticanje jednim klikom, brisanje. Izmena je stranica. */
export const useProjects = () => {
  const t = useTranslations('admin.projects')
  const locale = useLocale()
  const query = useGetProjectsQuery(undefined)
  const [reorder] = useReorderProjectsMutation()
  const [update] = useUpdateProjectMutation()
  const [deleteProject] = useDeleteProjectMutation()
  const { run, remove } = useAdminAction()
  const items = (query.data ?? []).map((project) => ({
    ...project,
    title: locale === 'sr' ? project.titleSr : project.titleEn,
    cover: project.images[0]?.url ?? null,
  }))

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    order: useReorder(items, (ids) => reorder(ids).unwrap()),
    toggle: (project: AdminProject, field: 'isPublished' | 'isFeatured') =>
      run(() => update({ id: project.id, patch: { [field]: !project[field] } }).unwrap(), 'saved'),
    remove: (project: AdminProject & { title: string }) =>
      remove(t('deleteConfirm', { title: project.title }), () => deleteProject(project.id).unwrap()),
  }
}
