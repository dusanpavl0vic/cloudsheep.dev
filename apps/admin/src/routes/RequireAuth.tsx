import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '@/features/auth'
import { ROUTES } from '@/lib/routes'

/**
 * Guard kao wrapper komponenta, NE `useEffect` + `navigate` (docs/05-routing.md).
 *
 * Effect se izvršava posle rendera, pa bi zaštićeni sadržaj bljesnuo pre redirekcije.
 * `<Navigate>` se dešava tokom rendera — nema bljeska i nema effect-a.
 *
 * Ovo krije UI. Autorizaciju proverava backend (docs/20-security.md).
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
