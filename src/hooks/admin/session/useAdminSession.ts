'use client'

import { useRestoreSessionQuery } from '@/store/api/admin/auth'
import { selectSessionStatus, selectSessionUser } from '@/store/slices/auth'

import { useAppSelector } from '../../useStore'

/**
 * Sesija admin-a. Posle učitavanja stranice access token ne postoji (bio je samo u memoriji),
 * pa se jednom obnavlja iz httpOnly kolačića; dok traje, status je `unknown`.
 */
export const useAdminSession = () => {
  const status = useAppSelector(selectSessionStatus)
  const user = useAppSelector(selectSessionUser)
  useRestoreSessionQuery(undefined, { skip: status !== 'unknown' })

  return { status, user }
}
