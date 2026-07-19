import { createBrowserRouter } from 'react-router'

import { ROUTES } from '@/constants/routes'
import { LandingPage } from '@/features/landing'
import { MainLayout } from '@/layouts/MainLayout'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [{ index: true, element: <LandingPage /> }],
  },
])
