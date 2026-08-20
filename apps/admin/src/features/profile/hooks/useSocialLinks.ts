import { useCallback } from 'react'

import {
  useCreateSocialLinkMutation,
  useDeleteSocialLinkMutation,
  useReorderSocialLinksMutation,
  useUpdateSocialLinkMutation,
} from '../api/profileApi'
import type { SocialLinkInput } from '../schemas/profile.schema'
import type { SocialLink } from '../types'

export function useSocialLinks() {
  const [create, { isLoading: isCreating }] = useCreateSocialLinkMutation()
  const [update] = useUpdateSocialLinkMutation()
  const [reorder] = useReorderSocialLinksMutation()
  const [remove] = useDeleteSocialLinkMutation()

  // memo: referencijalna stabilnost — sve idu u props komponente
  const add = useCallback(
    async (values: SocialLinkInput) => {
      const result = await create(values)
      return { ok: !('error' in result) }
    },
    [create],
  )

  const toggleVisible = useCallback(
    (link: SocialLink) => {
      void update({ id: link.id, body: { isVisible: !link.isVisible } })
    },
    [update],
  )

  /** Pomeranje za jedno mesto; ceo novi poredak ide serveru, ne samo pomerena stavka. */
  const move = useCallback(
    (links: readonly SocialLink[], index: number, direction: -1 | 1) => {
      const target = index + direction
      if (target < 0 || target >= links.length) return

      const ids = links.map((link) => link.id)
      const moved = ids[index]
      const replaced = ids[target]
      if (!moved || !replaced) return

      ids[index] = replaced
      ids[target] = moved
      void reorder(ids)
    },
    [reorder],
  )

  const removeLink = useCallback(
    (id: string) => {
      void remove(id)
    },
    [remove],
  )

  return { add, toggleVisible, move, removeLink, isAdding: isCreating }
}
