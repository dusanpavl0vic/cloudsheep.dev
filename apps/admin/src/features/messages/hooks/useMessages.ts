import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

import { useDeleteMessageMutation, useMarkReadMutation, useMessagesQuery } from '../api/messagesApi'
import type { ContactMessage } from '../types'

/** Modul-konstanta — `?? []` bi pravio nov niz na svaki render (docs/07 §2). */
const EMPTY: readonly ContactMessage[] = []

export function useMessages() {
  // Filter je u URL-u, ne u `useState` — pogled na nepročitane je link koji se može sačuvati
  const [params, setParams] = useSearchParams()
  const status = params.get('status') === 'unread' ? 'unread' : 'all'

  const { data, isLoading, error } = useMessagesQuery(status)
  const [markRead] = useMarkReadMutation()
  const [remove] = useDeleteMessageMutation()

  // memo: referencijalna stabilnost — sve idu u props liste
  const toggleRead = useCallback(
    (message: ContactMessage) => {
      void markRead({ id: message.id, isRead: !message.isRead })
    },
    [markRead],
  )

  const removeMessage = useCallback(
    (id: string) => {
      void remove(id)
    },
    [remove],
  )

  const setStatus = useCallback(
    (next: 'all' | 'unread') => {
      setParams(next === 'all' ? {} : { status: next }, { replace: true })
    },
    [setParams],
  )

  return {
    messages: data?.items ?? EMPTY,
    unread: data?.unread ?? 0,
    status,
    setStatus,
    toggleRead,
    removeMessage,
    isLoading,
    error,
  }
}
