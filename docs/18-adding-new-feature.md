# 18 — Dodavanje novog domena (od baze do UI-ja)

> Status: active | Last review: 2026-10-10

Automatski: **`/new-feature <domen>`**. Ovaj dokument opisuje redosled i ono što komanda ne
može da pogodi. Primer koji prati ceo tok su **utisci klijenata** (`testimonial`).

## Pre nego što počneš

| Pitanje | Da → | Ne → |
|---|---|---|
| Ima li sopstvene podatke u bazi? | novi domen (svi slojevi ispod) | komponenta u postojećem domenu |
| Ima li javnu stranicu ili sekciju? | serverski servis + keš po tagu | samo admin |
| Treba li ga uređivati? | admin stranica + RTKQ | nema RTKQ-a |

`/explain-arch` odgovara na ovo za konkretan slučaj.

## Slojevi, redom

| # | Sloj | Putanja (primer) | Pravilo |
|---|---|---|---|
| 1 | Model + migracija | `prisma/schema.prisma`, `pnpm db:migrate --name testimonials` | samo dodavanje; unazad kompatibilno (`DEPLOYMENT.md` §5) |
| 2 | Šema | `src/schemas/testimonial.ts` | zod, poruke su i18n ključevi; `update…Schema = schema.partial()` |
| 3 | Tipovi | `src/types/testimonial.ts` | javni (`Testimonial`) i admin (`AdminTestimonial`) oblik |
| 4 | Servis | `src/server/services/testimonials.ts` | `server-only`; serializer nabraja polja; `cached(…, [tag])` za čitanje, `invalidate(tag)` posle izmene |
| 5 | API | `src/app/api/admin/testimonials/route.ts`, `[id]/route.ts`, `order/route.ts` | `handleAdmin`; POST `readJson`; **PATCH `readPatch`** |
| 6 | Klijent (admin) | `src/store/api/admin/testimonials.ts` | `crudEndpoints(build, API_TAGS.X, { list, item, order })` |
| 7 | Hookovi (admin) | `src/hooks/admin/testimonials/` | `useTestimonials` (spisak, akcije), `useTestimonialForm(id, onSaved)` |
| 8 | Komponente | `src/components/admin/testimonials/`, `src/modals/TestimonialFormModal/` | glupe; `DataTable`, `FormDialog`, `RowActions`, `OrderButtons` |
| 9 | Stranica | `src/app/admin/(app)/testimonials/page.tsx` + `ADMIN_NAV_ITEMS` | tanka |
| 10 | Javni prikaz | `src/components/home/Testimonials/` | servis direktno u serverskoj komponenti, bez RTKQ-a |
| 11 | i18n | `src/constants/i18n/en.ts` **i** `sr.ts` | `admin.testimonials.*`, `testimonials.errors.invalid` |
| 12 | Testovi | `src/server/services/testimonials.db.test.ts`, `e2e/admin.spec.ts` | granični slučajevi nad bazom; kritičan tok u pregledaču |

## Šta komanda ne može da pogodi

- **Šta sme da bude prazno.** `optionalText` (podrazumevano `''`) ili `requiredText`. Tako se
  odlučuje da li forma traži polje.
- **Šta je javno.** Javni servis filtrira (`isPublished`), a admin servis vraća sve. Novi zapis
  koji ide na sajt podrazumevano je **nacrt**.
- **Koji tag poništiti.** Izmena tehnologije menja i projekte. `invalidate` mora da pokrije
  sve što prikazuje taj podatak.
- **Redosled.** Ako postoji `sortOrder`, forma ga ne šalje (`schema.omit({ sortOrder: true })`),
  jer se redosled menja strelicama u spisku.

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `fetch('/api/…')` iz serverske komponente | direktan poziv servisa |
| RTK Query na javnoj stranici | servis na serveru (JS budžet, ADR 0014) |
| PATCH ruta sa `readJson(…, schema.partial())` | `readPatch` (inače defaults brišu polja) |
| `res.json(prismaRow)` | serializer koji nabraja polja |
| izmena bez `invalidate(tag)` | svaka mutacija poništava svoj tag |
| prevod samo u `en.ts` | `en.ts` **i** `sr.ts` (typecheck hvata nedostajući `sr` ključ) |

## Checklist

- [ ] Migracija samo dodaje; `pnpm db:migrate` folder commit-ovan
- [ ] Šema, tipovi, servis, API, RTKQ, hookovi, komponente, stranica — tim redom
- [ ] PATCH kroz `readPatch`; izmene poništavaju tag
- [ ] Ključevi u `en.ts` i `sr.ts`; srpski plural ima `one`, `few`, `other`
- [ ] `*.db.test.ts` za granične slučajeve, e2e za kritičan tok
- [ ] `pnpm validate` prolazi
