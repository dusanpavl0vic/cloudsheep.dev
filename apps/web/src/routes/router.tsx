import { createBrowserRouter } from 'react-router'

import { MainLayout } from '@/components/MainLayout'
import { ROUTES } from '@/lib/routes'

/**
 * Svaka ruta je lazy (docs/05-routing.md §1).
 *
 * Lazy modul eksportuje `Component` — to je ugovor React Router-a i jedini slučaj
 * u kome je `default export` bio alternativa. Ovde koristimo imenovani `Component`,
 * pa `import/no-default-export` ostaje uključen i za `pages/`.
 */
export const router = createBrowserRouter([
  {
    element: <MainLayout footer="full" />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { LandingPage } = await import('@/pages/LandingPage')
          return { Component: LandingPage }
        },
      },
    ],
  },
  {
    element: <MainLayout footer="slim" />,
    children: [
      {
        path: ROUTES.PROJECTS,
        handle: { crumb: 'nav.projects' },
        lazy: async () => {
          const { ProjectsPage } = await import('@/pages/ProjectsPage')
          return { Component: ProjectsPage }
        },
      },
      {
        path: ROUTES.PROJECT,
        handle: { crumb: 'nav.caseStudy' },
        lazy: async () => {
          const { ProjectPage } = await import('@/pages/ProjectPage')
          return { Component: ProjectPage }
        },
      },
      {
        path: ROUTES.CONTACT,
        handle: { crumb: 'nav.contact' },
        lazy: async () => {
          const { ContactPage } = await import('@/pages/ContactPage')
          return { Component: ContactPage }
        },
      },
      {
        path: ROUTES.USES,
        handle: { crumb: 'nav.uses' },
        lazy: async () => {
          const { UsesPage } = await import('@/pages/UsesPage')
          return { Component: UsesPage }
        },
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
