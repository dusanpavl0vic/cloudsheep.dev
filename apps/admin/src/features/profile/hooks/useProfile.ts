import { useCallback } from 'react'

import { useProfileQuery, useSaveProfileMutation } from '../api/profileApi'
import type { ProfileInput } from '../schemas/profile.schema'
import type { SocialLink } from '../types'

/** Modul-konstanta — `?? []` bi pravio nov niz na svaki render (docs/07 §2). */
const EMPTY_LINKS: readonly SocialLink[] = []

export function useProfile() {
  const { data, isLoading, error } = useProfileQuery(undefined)
  const [saveProfile, { isLoading: isSaving }] = useSaveProfileMutation()

  // memo: referencijalna stabilnost — funkcija ide u props forme
  const save = useCallback(
    async (values: ProfileInput) => {
      const result = await saveProfile(values)
      return { ok: !('error' in result) }
    },
    [saveProfile],
  )

  return {
    profile: data?.profile ?? null,
    links: data?.links ?? EMPTY_LINKS,
    save,
    isLoading,
    isSaving,
    error,
  }
}
