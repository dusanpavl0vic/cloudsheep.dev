import { useAppSelector } from '@/store/hooks'

import { selectCurrentUser, selectIsAuthenticated } from '../store/auth.slice'

/**
 * Javni API feature-a: ko je ulogovan.
 *
 * Komponente NIKAD ne zovu `useAppSelector` direktno — sve ide kroz ovaj hook (docs/13).
 */
export function useAuth() {
  const user = useAppSelector(selectCurrentUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  return { user, isAuthenticated }
}
