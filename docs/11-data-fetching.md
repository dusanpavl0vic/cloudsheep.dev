# 11 — Podaci: server i klijent

> Status: active | Last review: 2026-10-08

Dva puta, sa jasnom granicom (docs/01 §3):

| Ko traži                                      | Kako                                        | Zašto                                             |
| --------------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| javna stranica (server komponenta)            | direktan poziv `server/services/<domen>.ts` | Google mora da dobije sadržaj u HTML-u            |
| admin (klijentske komponente)                 | RTK Query → `/api/**`                       | šablon §6.2; keš, stanja učitavanja, invalidacija |
| javna forma (kontakt, newsletter)             | `postJson` → `/api/**`, podaci sa servera   | JS budžet (ADR 0014) — RTK Query nije na javnim stranicama |

## 1. Javne stranice

```tsx
// app/[locale]/(public)/projects/page.tsx
const ProjectsPage = async ({ params }: Props) => {
  const { locale } = await params
  const projects = await listPublishedProjects(locale)
  return <ProjectsView projects={projects} />
}
```

- Servis vraća podatke **već na jeziku stranice** (`title: string`, ne `{ sr, en }`) — klijent ne
  nosi drugi jezik.
- Nepostojeći resurs je `null` → `page.tsx` zove `notFound()` (pravi 404).
- Greška baze se ne hvata u `page.tsx` — propada do `error.tsx`, koji ne prikazuje detalje.

## 2. Keš podataka

Stranice su dinamičke (CSP nonce), pa javni servisi keširaju rezultat kroz `cached()`
(`server/cache.ts`, `unstable_cache`) sa tagom iz `CACHE_TAGS`:

```ts
export const listPublishedProjects = cached(
  async (locale: Locale) => (await findPublished()).map((p) => summary(p, locale)),
  'projects',
  [CACHE_TAGS.PROJECTS],
)
```

- **Svaka admin izmena** zove `invalidate(tag)` (`revalidateTag(tag, { expire: 0 })`) — sledeći
  zahtev dobija sveže podatke. Nov projekat je vidljiv i indeksabilan **bez rebuild-a**.
- Rezultat se čuva kao JSON: servis vraća samo serijalizabilne podatke (datum kao ISO string).
- Ne kešira se ono što se menja sa svakim posetiocem: slobodni termini (`listFreeSlots`).

## 3. API rute

`app/api/**/route.ts` je tanak: parsiraj → servis → odgovor.

```ts
export const PATCH = handleAdmin<{ id: string }>(async (request, { params }) =>
  json(
    await updateNote(
      (await params).id,
      await readPatch(request, updateNoteSchema, 'notes.errors.invalid'),
    ),
  ),
)
```

| Pomoćnik (`server/http.ts`, `server/auth/session.ts`) | Šta radi                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `handle(fn)`                                          | hvata svaku grešku → `{ messageKey, details? }`, nikad stack |
| `handleAdmin(fn)`                                     | `handle` + provera admin uloge (401/403)                     |
| `readJson(request, schema, key)`                      | limit veličine, JSON, zod; greška → 400 sa `details.field`   |
| `readPatch(request, schema, key)`                     | isto, ali vraća SAMO poslate ključeve — obavezno za PATCH    |
| `readQuery(request, schema)`                          | query kroz šemu                                              |
| `HttpError(status, messageKey, details?)`             | namerna greška sa i18n ključem i poljem forme                |

Statičan segment ima prednost nad dinamičkim: `/api/admin/projects/order` se ne čita kao `[id]`.

**PATCH nikad kroz `readJson` sa `.partial()` šemom.** Zod 4 primenjuje `.default()` i unutar
`.partial()`, pa bi `{ isPublished: true }` stigao i kao `metrics: []`, `company: ''`,
`avatarId: null`… i izmena jednog polja bi obrisala ostala. `readPatch` to sprečava.

## 4. RTK Query (klijent)

Tačno po šablonu §6.2: `baseApi` nema endpointe, a svaki domen ubacuje svoje
(`store/api/admin/<domen>.ts`). URL-ovi dolaze iz `API_ENDPOINTS`, tagovi iz `API_TAGS`.
Admin spiskovi dele `crudEndpoints(build, tag, { list, item, order? })`: lista (`{ items }`),
dodavanje, izmena (`PATCH`), brisanje i redosled. Svaka mutacija poništava tag liste.

- `baseApi` se ubacuje **lenjo** (docs/04 §2) — samo stranice koje ga uvezu ga plaćaju.
- **Javne stranice ne koriste RTKQ** (JS budžet, ADR 0014). Forme šalju kroz `postJson`
  (`helpers/http.ts`), a termini stižu sa servera.
- `baseQuery` nosi access token iz memorije (`auth` slice). Na 401 jednom zove
  `POST /api/auth/refresh` i ponavlja zahtev. Ako obnova ne uspe, sledi `sessionEnded()` i
  prijava. Istovremeni 401-ovi čekaju istu obnovu, a `/auth/*` se nikad ne obnavlja sam.
- Fajl (CSV, PDF) se ne čuva u Redux-u. CSV ide kao tekst, a PDF kao object URL (string).
  Blob nije serijalizabilan. Preuzimanje radi `helpers/download.ts`, jer link ne može da nosi
  `Authorization`.
- Komponenta nikad ne zove RTKQ hook direktno — uvek kroz domenski hook (`hooks/<domen>/`).
- Greška iz API-ja se prevodi kroz `messageKey` (`helpers/apiError.ts` → `parseApiError`);
  `details.field` ide na polje forme (`setError`), ne u toast.

## Anti-patterns

| ❌                                               | ✅                                     |
| ------------------------------------------------ | -------------------------------------- |
| `fetch('/api/projects')` iz serverske komponente | direktan poziv servisa                 |
| `useEffect(() => { fetch(…) })`                  | RTKQ hook u domenskom hooku            |
| servis vraća `Date` iz keširane funkcije         | ISO string                             |
| admin izmena bez `invalidate(tag)`               | svaka mutacija invalidira svoje tagove |
| PATCH ruta sa `readJson(…, schema.partial())`    | `readPatch`                            |
| `responseHandler: (r) => r.blob()` u RTKQ        | tekst ili object URL (serijalizabilno) |
| `res.json(prismaRow)`                            | serializer koji nabraja polja          |
