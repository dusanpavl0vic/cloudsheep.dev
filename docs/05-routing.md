# 05 — Rutiranje

> Status: active | Last review: 2026-08-15

React Router 8, `createBrowserRouter` sa objektnim rutama. Obrazloženje izbora:
[`adr/0002-router-choice.md`](adr/0002-router-choice.md).

## Pravila

1. **Svaka ruta je lazy.** Bez izuzetka — čak i mala ruta nosi svoj feature sa sobom.
2. **Guard je wrapper komponenta**, ne `useEffect` + `navigate`.
3. **URL query params su izvor istine** za filtere, paginaciju i tabove — **ne Redux**.
4. **`errorElement` na root nivou** + po ruti gde greška ima drugačije značenje.
5. **Breadcrumbs iz `handle: { crumb }`** na route objektu, ne iz zasebne mape.
6. **Preload na hover** — link poziva `route.lazy()` na `onMouseEnter`.
7. **Meta tagovi po ruti** kroz React 19 hoisting (`<title>`, `<meta>` u komponenti).

## Primeri

### `router.tsx`

```tsx
// apps/web/src/routes/router.tsx
import { createBrowserRouter } from 'react-router';
import { ROUTES } from '@/lib/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    errorElement: <RootErrorPage />,
    children: [
      { index: true, lazy: () => import('@/pages/LandingPage') },
      {
        path: ROUTES.PROJECTS,
        lazy: () => import('@/pages/ProjectsPage'),
        handle: { crumb: 'nav.projects' },
      },
      {
        path: ROUTES.PROJECT_DETAIL,
        lazy: () => import('@/pages/ProjectPage'),
        handle: { crumb: 'nav.projectDetail' },
      },
      { path: '*', lazy: () => import('@/pages/NotFoundPage') },
    ],
  },
]);
```

Lazy modul eksportuje `Component` (i opciono `loader`) — jedini mesto gde je
`default export` dozvoljen po [`03-naming-conventions.md`](03-naming-conventions.md):

```tsx
// apps/web/src/pages/ProjectsPage.tsx
export function Component() {
  return <ProjectsView />;
}
Component.displayName = 'ProjectsPage';
```

### Guard

```tsx
// apps/admin/src/routes/RequireAuth.tsx
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/features/auth';

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageSpinner />;
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  return <Outlet />;
}
```

**Zašto ne `useEffect` + `navigate`:** effect se izvršava *posle* rendera, pa zaštićeni sadržaj
bljesne pre redirekcije. `<Navigate>` se dešava tokom rendera — nema bljeska, nema effect-a.

### URL kao izvor istine za filtere

```ts
// features/projects/hooks/useProjectFilters.ts
export function useProjectFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tag = searchParams.get('tag') ?? ALL_TAGS;
  const page = Number(searchParams.get('page') ?? 1);

  const setTag = (next: string) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      next === ALL_TAGS ? p.delete('tag') : p.set('tag', next);
      p.delete('page'); // promena filtera resetuje paginaciju
      return p;
    });
  };

  return { tag, page, setTag };
}
```

Korist: URL je deljiv, refresh čuva stanje, back dugme radi očekivano — sve besplatno.

### Preload na hover

```tsx
// apps/web/src/components/PrefetchLink/PrefetchLink.tsx
export function PrefetchLink({ to, prefetch, ...props }: PrefetchLinkProps) {
  return <Link to={to} onMouseEnter={() => void prefetch?.()} {...props} />;
}
```

Chunk se skida dok korisnik pomera miš ka linku — klik zatiče modul već u kešu.

### Meta po ruti (React 19 hoisting)

```tsx
export function Component() {
  const { t } = useTranslation('projects');
  return (
    <>
      <title>{t('projects.meta.title')}</title>
      <meta name="description" content={t('projects.meta.description')} />
      <ProjectsView />
    </>
  );
}
```

React 19 sam podiže ove tagove u `<head>` — nema `react-helmet`.

## Anti-patterns

| ❌ | Zašto | ✅ |
|---|---|---|
| `useEffect(() => { if (!user) navigate('/login') })` | zaštićeni sadržaj bljesne | `<Navigate>` u guard komponenti |
| `element: <Dashboard />` bez lazy | ceo feature u initial bundle-u | `lazy: () => import(...)` |
| filteri u Redux slice-u | URL nije deljiv, back ne radi | `useSearchParams` |
| hardkodovan string `'/projects'` u linku | promena rute lomi tiho | `ROUTES.PROJECTS` |
| breadcrumb mapa u zasebnom fajlu | dva izvora istine za istu rutu | `handle: { crumb }` |
| `window.location.href = ...` | pun reload, gubi SPA state | `navigate()` |

## Checklist

- [ ] Nova ruta je `lazy`
- [ ] Putanja je konstanta u `lib/routes.ts`, ne literal
- [ ] Zaštićena ruta ide kroz `<RequireAuth>`, bez `useEffect`-a
- [ ] Filteri/paginacija čitaju i pišu u `useSearchParams`
- [ ] Ruta ima `handle.crumb` ako se pojavljuje u breadcrumbs-u
- [ ] Ruta ima `<title>` i `<meta name="description">` kroz i18n ključeve
- [ ] Lazy reducer feature-a je registrovan (`injectReducer`)
- [ ] E2E smoke test za novu rutu
