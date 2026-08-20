import { createBrowserRouter } from 'react-router'

import { ROUTES } from '@/lib/routes'

import { AdminLayout } from './AdminLayout'
import { RequireAuth } from './RequireAuth'
import { SessionGate } from './SessionGate'

export const router = createBrowserRouter([
  {
    /*
     * Bezputna korenska ruta koja samo čeka obnovu sesije.
     *
     * Obuhvata i `/login`: access token nestaje sa svakim osvežavanjem stranice, pa se bez
     * ovog koraka panel pri svakom ulasku ponaša kao da nisi prijavljen — a refresh cookie
     * je sve vreme tu. Zato stoji iznad svega, ne samo oko zaštićenih ruta.
     */
    element: <SessionGate />,
    children: [
      {
        path: ROUTES.LOGIN,
        lazy: async () => {
          const { LoginPage } = await import('@/pages/LoginPage')
          return { Component: LoginPage }
        },
      },
      {
        element: <RequireAuth />,
        children: [
          {
            // Ljuska je layout ruta: navigacija i zaglavlje se ne remontiraju pri prelasku
            // između stranica, pa fokus i pozicija skrola ostaju gde jesu.
            element: <AdminLayout />,
            children: [
              {
                path: ROUTES.DASHBOARD,
                handle: { crumb: 'nav.dashboard' },
                lazy: async () => {
                  const { DashboardPage } = await import('@/pages/DashboardPage')
                  return { Component: DashboardPage }
                },
              },
              {
                path: ROUTES.PROJECTS,
                handle: { crumb: 'nav.projects' },
                lazy: async () => {
                  const { ProjectsPage } = await import('@/pages/ProjectsPage')
                  return { Component: ProjectsPage }
                },
              },
              {
                // `/projects/new` mora PRE `/projects/:id`, inače bi „new" bio pročitan
                // kao id projekta i stranica bi tražila nepostojeći zapis.
                path: ROUTES.PROJECT_NEW,
                lazy: async () => {
                  const { ProjectEditPage } = await import('@/pages/ProjectEditPage')
                  return { Component: ProjectEditPage }
                },
              },
              {
                path: ROUTES.TECHNOLOGIES,
                handle: { crumb: 'nav.technologies' },
                lazy: async () => {
                  const { TechnologiesPage } = await import('@/pages/TechnologiesPage')
                  return { Component: TechnologiesPage }
                },
              },
              {
                path: ROUTES.PROFILE,
                handle: { crumb: 'nav.profile' },
                lazy: async () => {
                  const { ProfilePage } = await import('@/pages/ProfilePage')
                  return { Component: ProfilePage }
                },
              },
              {
                path: ROUTES.TEAM,
                handle: { crumb: 'nav.team' },
                lazy: async () => {
                  const { TeamPage } = await import('@/pages/TeamPage')
                  return { Component: TeamPage }
                },
              },
              {
                path: ROUTES.MESSAGES,
                handle: { crumb: 'nav.messages' },
                lazy: async () => {
                  const { MessagesPage } = await import('@/pages/MessagesPage')
                  return { Component: MessagesPage }
                },
              },
              {
                path: ROUTES.PROJECT_EDIT,
                lazy: async () => {
                  const { ProjectEditPage } = await import('@/pages/ProjectEditPage')
                  return { Component: ProjectEditPage }
                },
              },
            ],
          },
        ],
      },
      {
        path: ROUTES.NOT_FOUND,
        lazy: async () => {
          const { NotFoundPage } = await import('@/pages/NotFoundPage')
          return { Component: NotFoundPage }
        },
      },
    ],
  },
])
