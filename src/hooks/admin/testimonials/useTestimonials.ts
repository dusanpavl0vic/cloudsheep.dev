'use client'

import { useTranslations } from 'next-intl'

import { MODALS } from '@/constants/modals'
import { useDeleteTestimonialMutation, useGetTestimonialsQuery, useReorderTestimonialsMutation, useUpdateTestimonialMutation } from '@/store/api/admin/testimonials'
import type { AdminTestimonial } from '@/types/testimonial'

import { useModal } from '../../useModal'
import { useAdminAction } from '../useAdminAction'
import { useReorder } from '../useReorder'

/** Utisci klijenata: redosled, objava jednim klikom, dijalog za izmenu, brisanje. */
export const useTestimonials = () => {
  const t = useTranslations('admin.testimonials')
  const query = useGetTestimonialsQuery(undefined)
  const [reorder] = useReorderTestimonialsMutation()
  const [update] = useUpdateTestimonialMutation()
  const [deleteTestimonial] = useDeleteTestimonialMutation()
  const { run, remove } = useAdminAction()
  const form = useModal(MODALS.ADMIN_TESTIMONIAL_FORM)
  const items = query.data ?? []

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    order: useReorder(items, (ids) => reorder(ids).unwrap()),
    add: () => form.open(),
    edit: (item: AdminTestimonial) => form.open({ id: item.id }),
    togglePublished: (item: AdminTestimonial) => run(() => update({ id: item.id, patch: { isPublished: !item.isPublished } }).unwrap(), 'saved'),
    remove: (item: AdminTestimonial) => remove(t('deleteConfirm', { name: item.authorName }), () => deleteTestimonial(item.id).unwrap()),
  }
}
