'use client'

import { useTranslations } from 'next-intl'

import { MODALS } from '@/constants/modals'
import { socialLinkSchema } from '@/schemas/profile'
import {
  useCreateSocialLinkMutation,
  useDeleteSocialLinkMutation,
  useGetProfileQuery,
  useReorderSocialLinksMutation,
  useUpdateSocialLinkMutation,
} from '@/store/api/admin/profile'
import type { AdminSocialLink } from '@/types/profile'

import { useModal } from '../../useModal'
import { useAdminAction } from '../useAdminAction'
import { useAdminForm } from '../useAdminForm'
import { useReorder } from '../useReorder'

/** Kontakt linkovi: redosled, vidljivost, dijalog, brisanje. */
export const useSocialLinks = (links: AdminSocialLink[]) => {
  const t = useTranslations('admin.profile')
  const [reorder] = useReorderSocialLinksMutation()
  const [update] = useUpdateSocialLinkMutation()
  const [deleteLink] = useDeleteSocialLinkMutation()
  const { run, remove } = useAdminAction()
  const form = useModal(MODALS.ADMIN_SOCIAL_LINK_FORM)

  return {
    order: useReorder(links, (ids) => reorder(ids).unwrap()),
    add: () => form.open(),
    edit: (link: AdminSocialLink) => form.open({ id: link.id }),
    toggleVisible: (link: AdminSocialLink) => run(() => update({ id: link.id, patch: { isVisible: !link.isVisible } }).unwrap(), 'saved'),
    remove: (link: AdminSocialLink) => remove(t('deleteLinkConfirm', { name: link.label }), () => deleteLink(link.id).unwrap()),
  }
}

/** Dijalog linka (`id` — izmena). */
export const useSocialLinkForm = (id: string | undefined, onSaved: () => void) => {
  const { link } = useGetProfileQuery(undefined, { selectFromResult: ({ data }) => ({ link: data?.links.find((item) => item.id === id) }) })
  const [create] = useCreateSocialLinkMutation()
  const [update] = useUpdateSocialLinkMutation()

  const admin = useAdminForm({
    schema: socialLinkSchema,
    defaultValues: { platform: link?.platform ?? '', label: link?.label ?? '', url: link?.url ?? '', isVisible: link?.isVisible ?? true },
    save: (values) => (link ? update({ id: link.id, patch: values }).unwrap() : create(values).unwrap()),
    onSaved,
  })
  return { ...admin, isEdit: Boolean(link) }
}
