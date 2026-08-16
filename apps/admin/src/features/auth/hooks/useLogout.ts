import { useCallback } from 'react'

import { useAppDispatch } from '@/store/hooks'

import { useLogoutMutation } from '../api/authApi'
import { loggedOut } from '../store/auth.slice'

export function useLogout() {
  const dispatch = useAppDispatch()
  const [logoutMutation, { isLoading }] = useLogoutMutation()

  const logout = useCallback(async () => {
    // Sesija se briše lokalno bez obzira na ishod poziva — ako server ne odgovori,
    // korisnik svejedno mora biti odjavljen na ovom uređaju
    try {
      await logoutMutation(undefined).unwrap()
    } finally {
      dispatch(loggedOut())
    }
  }, [dispatch, logoutMutation])

  return { logout, isLoading }
}
