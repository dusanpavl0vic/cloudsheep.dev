'use client'

import { useTranslations } from 'next-intl'

import { MODALS } from '@/constants/modals'
import { useDeleteTechnologyMutation, useGetTechnologiesQuery, useReorderTechnologiesMutation } from '@/store/api/admin/technologies'
import type { AdminTechnology } from '@/types/technology'

import { useModal } from '../../useModal'
import { useAdminAction } from '../useAdminAction'
import { useReorder } from '../useReorder'

/** Tehnologije: spisak u redosledu sa sajta, dodavanje/izmena u dijalogu, brisanje. */
export const useTechnologies = () => {
  const t = useTranslations('admin.technologies')
  const query = useGetTechnologiesQuery(undefined)
  const [reorder] = useReorderTechnologiesMutation()
  const [deleteTechnology] = useDeleteTechnologyMutation()
  const { remove } = useAdminAction()
  const form = useModal(MODALS.ADMIN_TECHNOLOGY_FORM)
  const items = query.data ?? []

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    order: useReorder(items, (ids) => reorder(ids).unwrap()),
    add: () => form.open(),
    edit: (technology: AdminTechnology) => form.open({ id: technology.id }),
    remove: (technology: AdminTechnology) => remove(t('deleteConfirm', { name: technology.label }), () => deleteTechnology(technology.id).unwrap()),
  }
}
