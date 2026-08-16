import type React from 'react'
import { createBrowserRouter } from 'react-router'

import { MainLayout } from '@/components/MainLayout'
import { loadFeatureNamespace, type FeatureNamespace } from '@/i18n'
import { ROUTES } from '@/lib/routes'

/**
 * Učitava chunk stranice I prevode njenog feature-a paralelno.
 *
 * Bez ovoga se namespace nikad ne registruje i `t('insight.uptime')` renderuje sam ključ —
 * greška koja se ne vidi u typecheck-u, samo na ekranu (docs/09-i18n.md).
 */
async function lazyPage<T extends Record<string, unknown>>(
  namespace: FeatureNamespace | null,
  load: () => Promise<T>,
  exportName: keyof T,
) {
  const [module] = await Promise.all([
    load(),
    namespace ? loadFeatureNamespace(namespace) : Promise.resolve(),
  ])
  return { Component: module[exportName] as React.ComponentType }
}

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
        lazy: () => lazyPage('landing', () => import('@/pages/LandingPage'), 'LandingPage'),
      },
    ],
  },
  {
    element: <MainLayout footer="slim" />,
    children: [
      {
        path: ROUTES.PROJECTS,
        handle: { crumb: 'nav.work' },
        lazy: () => lazyPage('projects', () => import('@/pages/ProjectsPage'), 'ProjectsPage'),
      },
      {
        path: ROUTES.PROJECT,
        handle: { crumb: 'nav.work' },
        lazy: () => lazyPage('projects', () => import('@/pages/ProjectPage'), 'ProjectPage'),
      },
      {
        path: ROUTES.CONTACT,
        handle: { crumb: 'nav.contact' },
        lazy: () => lazyPage('contact', () => import('@/pages/ContactPage'), 'ContactPage'),
      },
      {
        path: ROUTES.USES,
        handle: { crumb: 'nav.uses' },
        lazy: () => lazyPage('uses', () => import('@/pages/UsesPage'), 'UsesPage'),
      },
      {
        path: ROUTES.NOT_FOUND,
        lazy: () => lazyPage(null, () => import('@/pages/NotFoundPage'), 'NotFoundPage'),
      },
    ],
  },
])
