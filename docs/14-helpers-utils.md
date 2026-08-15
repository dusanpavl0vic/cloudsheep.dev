# 14 — Helperi i utils

> Status: active | Last review: 2026-08-15

`@app/utils` — čiste funkcije, **zero dependencies**, bez React-a, **100% coverage**.

## Pravila

1. **Jedna funkcija = jedan fajl = jedan test.** Bez `utils.ts` sa 40 eksporta.
2. **Bez `any`.** Generici gde treba, `unknown` + narrowing gde ne.
3. **Bez side-efekata.** Nema mutacije ulaza, nema I/O, nema `console`.
4. **Bez direktnog `Date.now()`/`Math.random()`** — injektuj clock/rng radi testabilnosti.
5. **Zero-dep.** Ako funkciji treba biblioteka, ne pripada ovde.
6. **Formatiranje za prikaz nije ovde** — to je `@app/i18n` (zavisi od jezika).

## Struktura

```
packages/utils/src/
├── string/       slugify · truncate · capitalize · mask
├── number/       clamp · round · percentage · bytes
├── date/         isExpired · toISODate · diffInDays        // formatiranje → @app/i18n
├── array/        groupBy · uniqueBy · chunk · partition · sortBy
├── object/       pick · omit · deepMerge · isEmpty
├── validation/   isEmail · isJMBG · isPIB · isPhoneRS
├── storage/      typed localStorage wrapper (zod parse + try/catch)
├── url/          buildQuery · parseQuery
├── async/        sleep · withTimeout · pRetry
└── env/          zod-validiran env parser
```

## Katalog

### `string`
| Funkcija | Potpis |
|---|---|
| `slugify` | `(input: string) => string` — transliteruje č/ć/š/ž/đ |
| `truncate` | `(input: string, max: number, suffix?: string) => string` |
| `capitalize` | `(input: string) => string` |
| `mask` | `(input: string, visible: number) => string` — `****3456` |

### `number`
`clamp(value, min, max)` · `round(value, decimals)` · `percentage(part, total)` · `bytes(n)`

### `date`
`isExpired(date, clock)` · `toISODate(date)` · `diffInDays(a, b)`

### `array`
`groupBy(items, key)` · `uniqueBy(items, key)` · `chunk(items, size)` ·
`partition(items, predicate)` · `sortBy(items, ...keys)`

### `object`
`pick(obj, keys)` · `omit(obj, keys)` · `deepMerge(a, b)` · `isEmpty(value)`

### `validation`
| Funkcija | Šta proverava |
|---|---|
| `isEmail` | RFC-ish, pragmatično |
| `isJMBG` | 13 cifara + kontrolna cifra po modulu 11 |
| `isPIB` | 9 cifara + kontrolna cifra |
| `isPhoneRS` | srpski format, `+381` i lokalni |

### `storage`
```ts
const themeStorage = createStorage('cs.theme', themeSchema);
themeStorage.get();        // T | null — zod parse, nikad baca
themeStorage.set('dark');
themeStorage.remove();
```
Pokvaren ili zastareo `localStorage` unos vraća `null` umesto da obori app.

### `async`
`sleep(ms)` · `withTimeout(promise, ms)` · `pRetry(fn, { retries, backoff })`

### `env`
```ts
// packages/utils/src/env/env.ts
const envSchema = z.object({
  VITE_APP_ENV: z.enum(['development', 'test', 'production']),
  VITE_API_URL: z.url(),
});

export const env = envSchema.parse(import.meta.env);
```

**Build pada ako fali obavezna varijabla** — bolje nego `undefined` u produkciji.
**Nikad `import.meta.env.X` direktno** — samo kroz `env` objekat.

## Primeri

```ts
// ✅ packages/utils/src/date/isExpired.ts — clock injektovan
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
| `utils.ts` sa 40 eksporta | fajl po funkciji |
| `formatDate` u `@app/utils` | `@app/i18n` — zavisi od jezika |
| `Date.now()` u telu funkcije | injektovan clock |
| `items.sort()` | `items.toSorted()` |
| `function pick(obj: any, keys: any)` | generici |
| `localStorage.getItem` direktno | `createStorage` sa zod šemom |
| `import.meta.env.VITE_API_URL` | `env.VITE_API_URL` |
| funkcija koja uvozi `lodash` | zero-dep, napiši je |
| `console.log` u util funkciji | vrati vrednost, loguje pozivalac |

## Checklist

- [ ] Funkcija je u svom fajlu, u pravoj kategoriji
- [ ] Ima test — `packages/utils` ostaje na **100%**
- [ ] Bez `any`, bez side-efekata, bez mutacije ulaza
- [ ] Bez zavisnosti
- [ ] Vreme/slučajnost injektovani
- [ ] Nije formatiranje za prikaz (to ide u `@app/i18n`)
- [ ] Upisana u katalog iznad
