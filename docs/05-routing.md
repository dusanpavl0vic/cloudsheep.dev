# 05 — Rutiranje, jezik u URL-u i SEO

> Status: active | Last review: 2026-10-08

## 1. Rute su fajlovi, linkovi su konstante

Next rutira po `src/app/`. `page.tsx` je tanak: pročita podatke, napravi metapodatke, renderuje
jedan View.

```tsx
// app/[locale]/(public)/projects/[slug]/page.tsx
const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { locale, slug } = await params
  bindRequestLocale(locale)
  const project = await getPublishedProject(slug)
  if (!project) notFound()
  return <ProjectView project={project} />
}
```

Linkovi se nikad ne pišu ručno — samo `ROUTES` i builderi iz `constants/routes.ts`:

| Šta             | Kako                                                                    |
| --------------- | ----------------------------------------------------------------------- |
| statičan link   | `<Link href={ROUTES.CONTACT}>`                                          |
| sa parametrom   | `<Link href={projectHref(slug)}>`                                       |
| sa query-jem    | `<Link href={projectsHref('mobile')}>`, `contactHref({ type, budget })` |
| sekcija početne | `homeSectionHref(HOME_SECTIONS.PRICING)` → `/#pricing`                  |
| programski      | `useRouter()` iz `@/i18n/navigation`, **u hooku**                       |

## 2. Jezik u URL-u (ADR 0012)

- Engleski: `/`, `/projects`… Srpski: `/sr`, `/sr/projects`… (`localePrefix: 'as-needed'`).
- **Javni sajt uvozi `Link`, `useRouter`, `redirect` iz `@/i18n/navigation`**, nikad iz
  `next/link` — oni dodaju prefiks. Lint to proverava (`no-restricted-syntax`).
- Jezik se ne pogađa po pregledaču (`localeDetection: false`).
- Admin nema prefiks; njegove putanje počinju sa `/admin` i smeju da koriste `next/link`.

## 3. Grupe ruta i layout-i

| Segment                   | Layout                                                | Pristup                                 |
| ------------------------- | ----------------------------------------------------- | --------------------------------------- |
| `app/[locale]/layout.tsx` | `Document` + `RootLayout` (ModalRoot, ToastContainer) | svi                                     |
| `app/[locale]/(public)/`  | `PublicLayout` (header, footer, aurora)               | svi                                     |
| `app/admin/(guest)/`      | `AuthLayout`                                          | samo gosti → ulogovani na `/admin`      |
| `app/admin/(app)/`        | `AppShell` + `useRequireAuth`                         | samo ulogovani → gost na `/admin/login` |

## 4. Statusni kodovi (indeksiranje)

| Situacija                             | Odgovor                                                 |
| ------------------------------------- | ------------------------------------------------------- |
| nepoznata putanja pod jezikom         | `[locale]/[...rest]/page.tsx` → `notFound()` → **404**  |
| nepostojeći slug projekta/beleške     | `notFound()` u `page.tsx` → **404**                     |
| `/contact/` (kosa crta na kraju)      | **308** → `/contact` (`trailingSlash: false`)           |
| `/uses` (stara stranica)              | **308** → `/#stack`                                     |
| `admin.cloudsheep.dev/*`              | **301** → `/admin/*` (proxy)                            |
| greška pri renderu (baza ne odgovara) | `error.tsx` — poruka bez detalja, **nikad stack trace** |

## 5. Metapodaci

Svaki `page.tsx` izvozi `generateMetadata` sa:

- `title`, `description` iz `meta.<stranica>`;
- `alternates.canonical` — sopstvena adresa na tom jeziku;
- `alternates.languages` — `en`, `sr`, `x-default` (→ engleski);
- `openGraph.url`, `openGraph.locale`.

Helper `buildPageMetadata()` (`helpers/seo.ts`) pravi sve to iz putanje i jezika — ručno sastavljen
`canonical` je zabranjen. `sitemap.ts` čita bazu i daje obe jezičke verzije svake stranice sa
`alternates`; `robots.ts` zabranjuje `/admin` i `/api`.

## 6. Proxy (`src/proxy.ts`)

Redom: stari poddomeni (`admin.`, `api.`) → nonce + CSP → next-intl (javni sajt) ili direktno
(admin). Matcher preskače `/api`, `/uploads`, `/_next` i fajlove sa ekstenzijom. Prefetch se
**ne** preskače — next-intl mu prepisuje putanju.

## Checklist

- [ ] nova stranica: putanja u `ROUTES`, builder ako ima parametar
- [ ] `generateMetadata` kroz `buildPageMetadata()`
- [ ] nepostojeći resurs → `notFound()`, ne prazna stranica sa 200
- [ ] stranica je u `sitemap.ts`
