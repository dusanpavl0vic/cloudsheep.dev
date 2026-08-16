import { createBrowserRouter } from 'react-router'

import { ROUTES } from '@/constants/routes'
import { ContactPage } from '@/features/contact'
import { LandingPage } from '@/features/landing'
import { NotFoundPage } from '@/features/notFound'
import { ProjectPage, ProjectsPage } from '@/features/projects'
import { UsesPage } from '@/features/uses'
import { MainLayout } from '@/layouts/MainLayout'

export const router = createBrowserRouter([
  {
    element: <MainLayout footer="full" />,
    children: [{ index: true, element: <LandingPage /> }],
  },
  {
    element: <MainLayout footer="slim" />,
    children: [
      { path: ROUTES.PROJECTS, element: <ProjectsPage /> },
      { path: ROUTES.PROJECT, element: <ProjectPage /> },
      { path: ROUTES.CONTACT, element: <ContactPage /> },
      { path: ROUTES.USES, element: <UsesPage /> },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
])
