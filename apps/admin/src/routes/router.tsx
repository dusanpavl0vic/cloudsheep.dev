import { createBrowserRouter } from 'react-router'

import { ROUTES } from '@/lib/routes'

import { RequireAuth } from './RequireAuth'

export const router = createBrowserRouter([
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
        path: ROUTES.DASHBOARD,
        handle: { crumb: 'nav.dashboard' },
        lazy: async () => {
          const { DashboardPage } = await import('@/pages/DashboardPage')
          return { Component: DashboardPage }
        },
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
])
