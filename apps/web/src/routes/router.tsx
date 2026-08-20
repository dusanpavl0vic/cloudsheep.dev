import { Suspense, lazy } from 'react'
import type React from 'react'
import { Outlet, createBrowserRouter } from 'react-router'

import { MainLayout } from '@/components/MainLayout'
import { RouteProgress } from '@/components/RouteProgress'
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
 * Isto, ali vraća i `loader` — i to je razlog zašto postoji.
 *
 * Loader uvozi API klijent, koji uvozi zod. Da se `./loaders` uveze na vrhu ovog fajla,
 * zod bi ušao u POČETNI chunk (~18 KB) i oborio budžet, iako ga početna strana treba tek
 * kad se ruta razreši. Ovako putuje sa chunk-om svoje rute, kao i prevodi.
 *
 * Cena: podaci se traže tek pošto chunk stigne, ne paralelno sa njim.
 */
async function lazyPageWithLoader<T extends Record<string, unknown>>(
  namespace: FeatureNamespace | null,
  load: () => Promise<T>,
  exportName: keyof T,
  loaderName: 'featuredLoader' | 'projectsLoader' | 'projectLoader',
) {
  const [module, loaders] = await Promise.all([
    load(),
    import('./loaders'),
    namespace ? loadFeatureNamespace(namespace) : Promise.resolve(),
  ])

  return {
    Component: module[exportName] as React.ComponentType,
    loader: (loaders as Record<string, unknown>)[loaderName] as never,
  }
}

/**
 * Svaka ruta je lazy (docs/05-routing.md §1).
 *
 * Lazy modul eksportuje `Component` — to je ugovor React Router-a i jedini slučaj
 * u kome je `default export` bio alternativa. Ovde koristimo imenovani `Component`,
 * pa `import/no-default-export` ostaje uključen i za `pages/`.
 */
/**
 * Loader ljuske, uvezen DINAMIČKI.
 *
 * `import { siteLoader } from './loaders'` na vrhu ovog fajla vratio bi zod (~18 KB) u
 * početni chunk, jer je `router.tsx` deo početnog učitavanja. Ovako modul stiže tek kad
 * navigacija krene, kao i kod loader-a pojedinačnih ruta.
 */
const loadSite = async () => (await import('./loaders')).siteLoader()

/**
 * 404 stranica kao `errorElement` za projekat.
 *
 * `lazy()` stoji na nivou modula, ne u telu komponente: napravljen u renderu, React ga na
 * svaki render vidi kao NOV tip i remontira podstablo (`react-hooks/static-components`).
 *
 * Ranije je `ProjectPage` sam renderovao inline „prazno" stanje kad slug ne postoji — što
 * je posetiocu izgledalo kao prazna stranica sa linkom, a pretraživaču kao HTTP 200.
 */
const LazyNotFound = lazy(async () => {
  const { NotFoundPage } = await import('@/pages/NotFoundPage')
  return { default: NotFoundPage }
})

export const router = createBrowserRouter([
  {
    /*
     * Bezputni korenski layout koji ne radi ništa osim što drži traku napretka.
     *
     * Traka MORA stajati iznad `MainLayout`-a: `site-full` i `site-slim` su dve različite
     * rute, pa se pri prelasku sa `/` na `/projects` layout remontira — traka unutra bi se
     * ugasila u trenutku kad je najpotrebnija.
     *
     * Roditelj namerno nema svoj `loader`: `useRouteLoaderData('site-full')` i dalje čita sa
     * istih `id`-jeva, pa se ponašanje postojećih ruta ne menja.
     */
    element: (
      <>
        <RouteProgress />
        <Outlet />
      </>
    ),
    children: [
      {
        // `id` + `loader` na LAYOUT ruti: podnožje je na svakoj stranici, pa profil treba
        // jednom po navigaciji, a `useRouteLoaderData('site-full')` ga čita bez prosleđivanja
        // kroz svaku stranicu.
        id: 'site-full',
        loader: loadSite,
        element: <MainLayout footer="full" />,
        children: [
          {
            index: true,
            lazy: () =>
              lazyPageWithLoader(
                'landing',
                () => import('@/pages/LandingPage'),
                'LandingPage',
                'featuredLoader',
              ),
          },
        ],
      },
      {
        id: 'site-slim',
        loader: loadSite,
        element: <MainLayout footer="slim" />,
        children: [
          {
            path: ROUTES.PROJECTS,
            handle: { crumb: 'nav.work' },
            lazy: () =>
              lazyPageWithLoader(
                'projects',
                () => import('@/pages/ProjectsPage'),
                'ProjectsPage',
                'projectsLoader',
              ),
          },
          {
            path: ROUTES.PROJECT,
            handle: { crumb: 'nav.work' },
            // Nepostojeći ili neobjavljen projekat baca 404 iz loader-a; bez `errorElement` bi
            // React Router prikazao sopstveni goli ekran greške umesto naše 404 stranice.
            lazy: () =>
              lazyPageWithLoader(
                'projects',
                () => import('@/pages/ProjectPage'),
                'ProjectPage',
                'projectLoader',
              ),
            errorElement: (
              <Suspense fallback={null}>
                <LazyNotFound />
              </Suspense>
            ),
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
    ],
  },
])
