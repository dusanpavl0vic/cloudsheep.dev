'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { ROUTES } from '@/constants/routes'
import { useDeleteMessageMutation, useGetMessagesQuery, useMarkMessageReadMutation } from '@/store/api/admin/messages'
import type { AdminMessage } from '@/types/contact'

import { useAdminAction } from '../useAdminAction'

export type MessageFilter = 'all' | 'unread'

/** Poruke iz forme za upit. Filter je u URL-u (`?status=unread`), ne u stanju. */
export const useMessages = (status: MessageFilter) => {
  const t = useTranslations('admin.messages')
  const router = useRouter()
  const query = useGetMessagesQuery(status)
  const [markRead] = useMarkMessageReadMutation()
  const [deleteMessage] = useDeleteMessageMutation()
  const { run, remove } = useAdminAction()

  return {
    items: query.data?.items ?? [],
    unread: query.data?.unread ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    setFilter: (next: MessageFilter) => {
      router.replace(next === 'unread' ? `${ROUTES.ADMIN_MESSAGES}?status=unread` : ROUTES.ADMIN_MESSAGES, { scroll: false })
    },
    /** Otvaranje nepročitane poruke je označava kao pročitanu. */
    opened: (message: AdminMessage) => {
      if (!message.isRead) void run(() => markRead({ id: message.id, isRead: true }).unwrap())
    },
    toggleRead: (message: AdminMessage) => run(() => markRead({ id: message.id, isRead: !message.isRead }).unwrap()),
    remove: (message: AdminMessage) => remove(t('deleteConfirm', { name: message.name }), () => deleteMessage(message.id).unwrap()),
  }
}
