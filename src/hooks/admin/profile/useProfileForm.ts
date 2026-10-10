'use client'

import { profileSchema } from '@/schemas/profile'
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/api/admin/profile'
import type { AdminProfile } from '@/types/profile'

import { useAdminForm } from '../useAdminForm'

const EMPTY: AdminProfile = {
  fullName: '',
  location: '',
  isAvailable: true,
  headlineSr: '',
  headlineEn: '',
  bioSr: '',
  bioEn: '',
  universitySr: '',
  universityEn: '',
  degreeSr: '',
  degreeEn: '',
}

/** Profil i linkovi za stranicu (učitavanje pre forme). */
export const useProfilePage = () => {
  const query = useGetProfileQuery(undefined)
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}

/** Forma profila — renderuje se sa učitanim podacima, pa su podrazumevane vrednosti tačne. */
export const useProfileForm = (profile: AdminProfile | null) => {
  const [update] = useUpdateProfileMutation()
  return useAdminForm({
    schema: profileSchema,
    defaultValues: profile ?? EMPTY,
    save: (values) => update(values).unwrap(),
  })
}
