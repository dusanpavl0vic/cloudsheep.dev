# 10 — Forme i validacija

> Status: active | Last review: 2026-10-09

`react-hook-form` 7 + `zod` 4 + `@hookform/resolvers`, uz React Compiler.

## Pravila

1. **Logika forme je u hook-u** (`useBriefForm`, `useLogin`, `useTechnologyForm`…).
   Komponenta samo raspoređuje polja.
2. **Zod šema je jedini izvor istine** i ista je na klijentu i na serveru (`src/schemas/`).
   Tip se izvodi iz nje: `z.input` za formu, `z.output` za ono što server prima.
3. **Poruke grešaka su i18n ključevi** (`validation.*`, `<domen>.errors.*`), a ne tekst.
   Prevodi ih `useKeyTranslator`; nepoznat ključ pada na `errors.unexpected`.
4. **Greške i `isSubmitting` čitaju se samo kroz `useFormState`**, nikad kroz `form.formState`.
   React Compiler memoizuje proxy `formState`, pa se greške nikad ne bi prikazale (lint:
   `no-restricted-properties`).
5. **Praćenje vrednosti ide kroz `useWatch`, ne kroz `form.watch`**, iz istog razloga.
6. **`mode: 'onTouched'`**: korisnik ne dobija grešku dok kuca prvi put, a ispravka se
   potvrđuje odmah.
7. **Greška polja sa servera ide na to polje** (`setError`). Ostale greške idu u toast.
8. **Dugme za slanje je onemogućeno do hidratacije** (`useHydrated`). Inače bi pregledač poslao
   formu kao GET, sa ličnim podacima u URL-u.
9. **`noValidate` na `<form>`**: validira zod, ne pregledač.

## Šema

```ts
// schemas/technology.ts
export const technologySchema = z.object({
  slug: z.string().trim().min(1, 'validation.required').regex(/^[a-z0-9]+$/, 'validation.slug'),
  label: requiredText(40),
  group: z.enum(TECHNOLOGY_GROUPS).default('tooling'),
  logoId: uuidOrNull,
  sortOrder: z.number().int().min(0).default(0),
})

/** Forma ne šalje sortOrder: redosled se menja strelicama, a čuvanje bi ga vratilo na 0. */
export const technologyFormSchema = technologySchema.omit({ sortOrder: true })
```

Kada se oblik forme razlikuje od API-ja (tekst „jedno po redu" umesto niza, brojevi odvojeni
zarezom), postoji `xFormSchema` sa pretvaranjem `toXInput` (npr. `cvFormSchema`, `noteFormSchema`,
`projectFormSchema`, `slotGeneratorFormSchema`). Pretvaranje je testirano.

## Admin forma: `useAdminForm`

```ts
const admin = useAdminForm({
  schema: technologyFormSchema,
  defaultValues: { slug: technology?.slug ?? '', … },
  save: (values) => (technology ? update({ id, patch: values }).unwrap() : create(values).unwrap()),
  onSaved: onClose,
  onInvalid: (errors) => { /* npr. prebaci na karticu jezika sa greškom */ },
})
// → { form, errors, submit, isSubmitting, isDirty }
```

`useAdminForm` daje RHF sa zod resolver-om i greške kroz `useFormState`. Na uspeh pokazuje
toast „Sačuvano." i resetuje `isDirty`. Na grešku sa `details.field` postavlja `setError` na
to polje i fokusira ga. Forma se renderuje **tek kad podaci stignu** (`useXPage` → `<XForm
key={id}>`), pa su podrazumevane vrednosti tačne i ne treba `useEffect(() => reset(data))`.

## Polja

`TextField` (input, `multiline` → textarea, `options` → select) i `CheckboxField` povezuju
oznaku, grešku i opis (`aria-invalid`, `aria-describedby`, `role="alert"`) i rade sa
`register`. Slika ide kroz `ImageField`: otprema se odmah, a forma čuva samo `assetId`.

### Ponavljajuće grupe

Admin liste (pozicije u CV-u, rezultati i poglavlja projekta) idu kroz `useFormList`
(`hooks/admin`), ne kroz RHF `useFieldArray`. RHF dele admin i forma upita, pa bi
`useFieldArray` ostao u JS-u `/contact` (+1,4 KB, docs/07 §6a). Niz se čita kroz `useWatch`, a
menja ceo kroz `setValue`, koji upisuje vrednosti i u registrovana polja. Ključ stavke je
indeks. Test: `e2e/admin.spec.ts` („ukloni prvi — ostaje drugi").

### Brojevi i prazna polja

```ts
// RHF i podrazumevanu vrednost (null) provlači kroz setValueAs — Number(null) je 0!
const nullableNumber = (value: unknown) => (value === '' || value === null || value === undefined ? null : Number(value))
register('endYear', { setValueAs: nullableNumber })
register('projectId', { setValueAs: (v: string) => v || null })  // prazan <select> → null
```

## Server

- `readJson(request, schema, 'x.errors.invalid')` daje 400 sa `details.field` prvog
  neispravnog polja.
- **PATCH ide kroz `readPatch`**, nikad kroz `readJson` sa `.partial()` šemom. Zod 4
  primenjuje `.default()` i unutar `.partial()`. `{ isPublished: true }` bi zato vratio i
  `metrics: []`, `company: ''`… i izmena jednog polja bi obrisala ostala. `readPatch` posle
  validacije zadržava samo poslate ključeve.
- Jedinstven ključ u bazi (P2002) daje 409 `errors.conflict` sa poljem (npr. zauzet `slug`).

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `form.formState.errors` | `useFormState({ control }).errors` |
| `form.watch('x')` | `useWatch({ control, name: 'x' })` |
| `useFieldArray` u admin formi | `useFormList` (docs/07 §6a) |
| `useState` za vrednosti, greške, slanje | RHF |
| ručno pisan tip forme | `z.input<typeof schema>` |
| `.min(8, { message: 'Lozinka je prekratka' })` | i18n ključ |
| `useEffect(() => reset(data), [data])` | forma se renderuje sa podacima, `key` po zapisu |
| `readJson(request, schema.partial())` za PATCH | `readPatch` |
| sve server greške u toast | `setError` na polje |

## Checklist

- [ ] Šema u `src/schemas/`, ista za klijent i server; poruke su i18n ključevi u `en.ts` **i** `sr.ts`
- [ ] Logika u hook-u; greške kroz `useFormState`, vrednosti kroz `useWatch`
- [ ] `noValidate`; dugme onemogućeno do hidratacije (javne forme)
- [ ] Prazno brojčano ili izborno polje → `null` kroz `setValueAs`
- [ ] PATCH ruta koristi `readPatch`
- [ ] Test šeme ili pretvaranja forme (`*.test.ts` pored šeme ili helpera)
