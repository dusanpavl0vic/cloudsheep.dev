# 14 — Helperi i utils

> Status: active | Last review: 2026-10-09

`src/helpers/` sadrži čiste funkcije bez React-a, sa testom pored fajla (`x.test.ts`).
Koriste ih i server i klijent. Izuzetak su `download.ts`, koji radi sa DOM-om, i `http.ts`, koji radi sa mrežom.

## Pravila

1. **Fajl po domenu** (`date.ts`, `seo.ts`, `cv.ts`…) i test pored njega. Bez `utils.ts` sa 40 eksporta.
2. **Bez `any`.** Generici gde treba, `unknown` + narrowing gde ne.
3. **Bez side-efekata.** Nema mutacije ulaza, nema I/O, nema `console`.
4. **Bez direktnog `Date.now()`/`Math.random()`** — injektuj clock/rng radi testabilnosti.
5. **Biblioteka samo kad se isplati** (`marked` u `markdown.ts`). Helper koji je uvozi ne sme na javnu stranicu kroz klijentski kod.
6. **Datumi uvek kroz `formatDate`** (`sr-Latn-RS`, zona studija). `useFormatter`/`getFormatter` iz next-intl su zabranjeni lint-om, jer bi srpski bio na ćirilici.

## Katalog

| Fajl | Funkcije | Namena |
|---|---|---|
| `date.ts` | `formatDate` · `zonedTimeToUtc` · `dayInZone` · `addDays` · `addMonths` · `isoWeekday` · `daysBetween` | prikaz na jeziku stranice; „13:00 u Beogradu" → UTC; današnji dan u zoni |
| `seo.ts` | `localizedPath` · `absoluteUrl` · `buildPageMetadata` · `studioJsonLd` · `projectJsonLd` · `breadcrumbJsonLd` · `notePostingJsonLd` | canonical, noindex za `/sr`, JSON-LD |
| `apiError.ts` | `parseApiError` | RTKQ greška → `{ status, messageKey, field, suggestion }` |
| `http.ts` | `postJson` | POST sa javnih stranica bez RTKQ-a (prefiks `API_BASE_URL`) |
| `email.ts` | `normalizeEmail` · `emailDomain` · `hasEmailShape` · `suggestEmail` | provera adrese; „gmial.com → gmail.com" |
| `contact.ts` | `parseContactPrefill` · `PLAN_KEYS` | popunjavanje upita iz procene ili paketa (URL) |
| `booking.ts` | `groupSlotsByDay` | slobodni termini po danima |
| `estimator.ts` | `estimate` · `toggleItem` | cena i rok iz izbora |
| `projects.ts` | `pickFeatured` · `countByCategory` · `ordinal` | istaknuti projekti; brojke po kategoriji |
| `chart.ts` | `sparkGeometry` | SVG putanja grafikona rasta |
| `markdown.ts` | `renderMarkdown` · `countWords` | markdown → bezbedan HTML (sirov HTML se ekranira); vreme čitanja |
| `cv.ts` | `cvToForm` · `toCvInput` | CV sa servera ↔ forma (nizovi ↔ tekst) |
| `download.ts` | `saveBlob` · `saveObjectUrl` | preuzimanje CSV/PDF-a iz admin API-ja (traži `Authorization`, pa nije link) |
| `object.ts` | `pick` · `omit` · `isEmpty` · `pickPaths` | — |
| `locale.ts` · `links.ts` | `pickLocalized` · `emailFrom` | sr/en polje po jeziku; adresa iz `mailto:` |

Pretvaranja forma ↔ API koja zavise od šeme stoje u `src/schemas/` pored šeme
(`toNoteInput`, `toProjectInput`, `toGenerateSlotsInput`).

## Primeri

```ts
// ✅ clock injektovan
export function isExpired(date: Date, now: () => number = Date.now): boolean {
  return date.getTime() < now();
}

// test je determinističan
expect(isExpired(new Date('2020-01-01'), () => Date.parse('2026-01-01'))).toBe(true);
```

```ts
// ✅ bez mutacije ulaza
export function sortBy<T>(items: readonly T[], key: keyof T): T[] {
  return items.toSorted((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
}

// ❌ mutira ulaz — pozivalac dobija iznenađenje
export function sortBy<T>(items: T[], key: keyof T) { return items.sort(…); }
```

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `utils.ts` sa 40 eksporta | fajl po domenu |
| `useFormatter().dateTime(...)` / `Intl.DateTimeFormat('sr')` | `formatDate(value, locale)` (latinica, zona studija) |
| `new Date().toISOString().slice(0, 10)` za „danas" | `dayInZone(new Date(), BOOKING_TIME_ZONE)` (inače posle ponoći kasni dan) |
| `Date.now()` u telu funkcije | injektovan clock |
| `items.sort()` | `items.toSorted()` |
| `function pick(obj: any, keys: any)` | generici |
| `process.env.X` / `import.meta.env.X` | `server/env.ts` (zod) / `constants/env.ts` |
| `console.log` u helper funkciji | vrati vrednost, loguje pozivalac |

## Checklist

- [ ] Funkcija je u fajlu svog domena, sa testom pored njega
- [ ] Bez `any`, bez side-efekata, bez mutacije ulaza
- [ ] Vreme i slučajnost su injektovani
- [ ] Datum za prikaz ide kroz `formatDate`
- [ ] Upisana u katalog iznad
