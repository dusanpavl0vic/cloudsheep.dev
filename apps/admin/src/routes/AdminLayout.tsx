import { Outlet } from 'react-router'

import { AdminShell } from '@/components/AdminShell'
import { RouteProgress } from '@/components/RouteProgress'
import { useAuth, useLogout } from '@/features/auth'
import { ModalRoot } from '@/providers/ModalRoot'

/**
 * Ožičenje ljuske. Stoji u `routes/` jer taj sloj sme da uvozi feature-e, a
 * `components/` ne sme (docs/01 §2).
 *
 * `ModalRoot` je ovde, a ne u `AppProviders`: čita `useLocation()` da bi zatvorio modale
 * pri navigaciji, pa mora biti UNUTAR router-a. `AppProviders` je iznad njega.
 *
 * `RouteProgress` je iznad ljuske, a ne u njoj: `AdminShell` je komponenta bez znanja o
 * router-u, i to pravilo se ne krši zbog jedne trake. Cena je da `/login` i admin 404 —
 * jedine rute izvan ovog layout-a — nemaju indikator; prvi ulaz ionako nema šta da pokaže,
 * a prelaz na login je odjava, koja menja ceo ekran.
 */
export const AdminLayout = () => {
  const { user } = useAuth()
  const { logout, isLoading } = useLogout()

  return (
    <>
      <RouteProgress />
      <AdminShell
        userName={user?.name ?? ''}
        isSigningOut={isLoading}
        onSignOut={() => {
          void logout()
        }}
      >
        <Outlet />
        <ModalRoot />
      </AdminShell>
    </>
  )
}
