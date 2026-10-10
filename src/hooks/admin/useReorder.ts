'use client'

import { useAdminAction } from './useAdminAction'

/** Pomera stavku gore/dole i šalje ceo novi redosled (`PATCH { ids }`). */
export const useReorder = (items: readonly { id: string }[], reorder: (ids: string[]) => Promise<unknown>) => {
  const { run } = useAdminAction()

  return {
    canMove: (index: number, delta: -1 | 1) => index + delta >= 0 && index + delta < items.length,
    move: (index: number, delta: -1 | 1) => {
      const ids = items.map((item) => item.id)
      const target = index + delta
      const [moved] = ids.splice(index, 1)
      if (!moved || target < 0 || target > ids.length) return
      ids.splice(target, 0, moved)
      void run(() => reorder(ids))
    },
  }
}
