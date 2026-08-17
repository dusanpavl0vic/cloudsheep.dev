import { useCallback } from 'react'

import { useAppDispatch } from '@/store/hooks'

import { useLogoutMutation } from '../api/authApi'
import { loggedOut } from '../store/auth.slice'

export function useLogout() {
  const dispatch = useAppDispatch()
  const [logoutMutation, { isLoading }] = useLogoutMutation()

  const logout = useCallback(async () => {
    // Sesija se briše lokalno bez obzira na ishod poziva — ako server ne odgovori,
    // korisnik svejedno mora biti odjavljen na ovom uređaju.
    //
    // `catch`, ne `finally`: `try/finally` bez `catch` uredno obriše sesiju pa ONDA
    // ponovo baci grešku. Pozivalac je `void logout()`, dakle nema ko da je uhvati —
    // svaka odjava bez mreže davala je neuhvaćeno odbijanje u konzoli. Greška ovde
    // nema šta da kaže korisniku: odjava je sa njegove strane ionako uspela.
    try {
      await logoutMutation(undefined).unwrap()
    } catch {
      // namerno progutano — vidi gore
    }
    dispatch(loggedOut())
  }, [dispatch, logoutMutation])

  return { logout, isLoading }
}
