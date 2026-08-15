# 18 — Dodavanje novog feature-a

> Status: active | Last review: 2026-08-15

Automatski: **`/new-feature <app> <feature>`**. Ovaj dokument opisuje šta komanda generiše
i po kom redosledu se popunjava.

## Pre nego što počneš

Pitanja koja odlučuju gde kod ide:

| Pitanje | Da → | Ne → |
|---|---|---|
| Ima li sopstveni domen i URL? | feature | komponenta u postojećem feature-u |
| Koristi li ga druga app? | `packages/` | ostaje u app-i |
| Može li se obrisati `rm -rf` bez lomljenja ostatka? | ✅ dobar feature | granica je propuštena |

`/explain-arch` odgovara na ovo za konkretan slučaj.

## Skelet

```
features/<name>/
├── api/           <name>Api.ts          RTKQ injectEndpoints
├── components/    <Component>/          folder + .variants.ts + index.ts
├── modals/        <Modal>.tsx           lazy, upisan u registry
├── hooks/         use<Name>.ts          ← javni API
├── store/         <name>.slice.ts, <name>.selectors.ts
├── schemas/       <name>.schema.ts      zod
├── locales/       sr.json, en.json      namespace "<name>"
├── types.ts
├── __tests__/     integracija
└── index.ts       public API
```

**Ne prave se prazni folderi.** Feature bez modala nema `modals/`.

## Redosled rada

Ovaj redosled nije proizvoljan — svaki korak daje tip koji sledeći koristi.

### 1. Tipovi i šeme

```ts
// types.ts
export type Project = { id: string; name: string; isActive: boolean };

// schemas/project.schema.ts
export const projectSchema = z.object({ id: z.uuid(), name: z.string().min(1), isActive: z.boolean() });
```

### 2. API

```ts
export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => '/projects',
      providesTags: [{ type: 'Project', id: 'LIST' }],
    }),
  }),
});
```

Novi `tagType` se dodaje u `baseApi.tagTypes`. Detalji: [`11-data-fetching.md`](11-data-fetching.md).

### 3. Slice (samo ako treba client state)

Server state ide u RTKQ — slice je **samo** za ono što nije sa servera (izabrani red,
otvoren panel). Ako feature nema takvo stanje, nema ni slice.

```ts
store.injectReducer('projects', projectsReducer);   // lazy, uz feature chunk
```

### 4. Hook — javni API

```ts
export function useProjects() {
  const { data, isLoading, error } = useGetProjectsQuery();
  return { projects: data ?? EMPTY_PROJECTS, isLoading, error };
}
```

`EMPTY_PROJECTS` je modul-level konstanta — `?? []` pravi novi niz svaki render.

### 5. Prevodi

`locales/sr.json` i `locales/en.json`, namespace `<name>`, ključevi `<name>.section.element`.
**Oba fajla, uvek.** Plural kroz ICU ([`09-i18n.md`](09-i18n.md)).

### 6. Komponente

Folder + `.variants.ts` + `index.ts`. Komponenta ne zna za Redux — samo za hook.

### 7. Public API

```ts
// index.ts
export { useProjects } from './hooks/useProjects';
export { ProjectList } from './components/ProjectList';
export type { Project } from './types';
// ❌ nikad slice, selektore ni endpointe
```

### 8. Page i ruta

```tsx
// pages/ProjectsPage.tsx — samo kompozicija
export function Component() {
  return <ProjectList />;
}
```

```ts
{ path: ROUTES.PROJECTS, lazy: () => import('@/pages/ProjectsPage'), handle: { crumb: 'nav.projects' } }
```

### 9. Testovi

Redom: zod šema → reducer → selektori → **hook (primarni fokus)** → komponenta →
integracija sa MSW → e2e smoke. Vidi [`12-testing.md`](12-testing.md).

## Registracija — lako se zaboravi

- [ ] Reducer (`injectReducer`) ako ima slice
- [ ] `tagTypes` u `baseApi` ako ima nove tagove
- [ ] Namespace u i18n konfiguraciji, lazy uz rutu
- [ ] Modali u `modalRegistry` **i** `ModalPropsMap`
- [ ] Ruta u `router.tsx`
- [ ] MSW handleri u test setup-u

## Anti-patterns

| ❌ | ✅ |
|---|---|
| feature koji importuje drugi feature | kroz barrel, ili izdigni deljeno |
| `export { projectsSlice }` iz `index.ts` | samo hookovi, tipovi, komponente |
| prazan `modals/`, `schemas/` folder | ne pravi ga dok ne treba |
| komponenta koja zove `useGetProjectsQuery` | kroz `useProjects()` |
| prevodi dodati samo u `sr.json` | oba fajla |
| ruta bez `lazy` | uvek lazy |
| page sa logikom | logika u hook |
| `?? []` u hooku | modul-level `EMPTY_*` konstanta |

## Checklist

- [ ] Feature se može obrisati `rm -rf` bez lomljenja ostatka
- [ ] `index.ts` eksportuje samo hookove, tipove i komponente
- [ ] Ne importuje drugi feature direktno
- [ ] Prevodi u `sr.json` i `en.json`, ključevi sa `<name>.` prefiksom
- [ ] Ruta je lazy, reducer lazy registrovan
- [ ] Hook testovi ≥ 90%
- [ ] 0 `useEffect` (ili svaki sa `// effect:` i sa whitelist-e)
- [ ] ≤ 2 `useState` po komponenti
- [ ] `pnpm validate` prolazi
