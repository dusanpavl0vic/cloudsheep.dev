# 20 — Sigurnost

> Status: active | Last review: 2026-08-15

SPA nema server na kome bi krila tajne. Sve što je u bundle-u je **javno** — to je polazna
pretpostavka, ne rizik koji se ublažava.

## Pravila

1. **Access token u memoriji (Redux), refresh u `httpOnly` cookie.**
   **Nikad JWT u `localStorage`.**
2. **`dangerouslySetInnerHTML` je zabranjen.** Ako mora — `DOMPurify` + eksplicitan ESLint izuzetak
   sa komentarom zašto.
3. **`VITE_` prefiks znači javno vidljivo.** Nikad tajne, ključeve ni tokene.
4. **CSP bez `unsafe-inline`**, plus HSTS i `X-Content-Type-Options: nosniff`.
5. **Eksterni linkovi:** `rel="noopener noreferrer"`.
6. **`pnpm audit` u CI** + Renovate/Dependabot za automatske update-ove.

## Tokeni

```ts
// ✅ access token živi u Redux-u — nestaje sa tabom
const authSlice = createSlice({ name: 'auth', initialState: { accessToken: null }, … });

// ❌ NIKAD
localStorage.setItem('token', jwt);
```

**Zašto ne `localStorage`:** dostupan je svakoj skripti na stranici. Jedan kompromitovan
npm paket sa `postinstall` skriptom ili jedan XSS i token je odnet. Refresh u `httpOnly`
cookie-ju JavaScript ne može da pročita.

**Cena koju treba znati:** refresh preko cookie-ja zahteva `SameSite=Strict`/`Lax` i CSRF
zaštitu na backendu. To je backend ugovor — dokumentuj ga kad se API definiše.

Refresh flow sa mutexom: [`11-data-fetching.md`](11-data-fetching.md).

## Env promenljive

```ts
// ✅
import { env } from '@app/utils/env'
const apiUrl = env.VITE_API_URL

// ❌ zaobilazi zod validaciju
const apiUrl = import.meta.env.VITE_API_URL
```

| Promenljiva  | Javno?               | Sme li tajna?   |
| ------------ | -------------------- | --------------- |
| `VITE_*`     | **da, u bundle-u**   | **nikad**       |
| bez prefiksa | ne stiže do klijenta | build-time only |

Ako ti treba tajna u runtime-u — treba ti backend endpoint, ne env promenljiva.

## HTML iz spoljnog izvora

```tsx
// ❌
<div dangerouslySetInnerHTML={{ __html: post.body }} />

// ✅ ako stvarno mora
// eslint-disable-next-line react/no-danger -- CMS sadržaj, sanitizovan DOMPurify-jem
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }} />
```

Prvo pitanje nije "kako da sanitizujem" nego "zašto uopšte primam HTML" — markdown →
komponente je skoro uvek bolji odgovor.

## Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';
                         img-src 'self' data:; connect-src 'self' <API_URL>;
                         frame-ancestors 'none'; base-uri 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Za `web` i `admin` postavlja ih nginx (`infra/nginx/spa.conf`), za `api` ih postavlja
`helmet` (`apps/api/src/app.ts`). HSTS ne diramo na `.dev` domenu — on je na HSTS preload
listi, pa pretraživač i bez zaglavlja odbija HTTP.

**`unsafe-inline` i tema:** inline script protiv FOUC-a ([`08-styling-ui.md`](08-styling-ui.md))
je jedini inline kod — pokriva se `nonce`-om ili hash-om, ne otvaranjem `unsafe-inline`.

## Zavisnosti

- `pnpm audit --audit-level=high` u CI
- Novi dependency > 20 KB gzip → ADR ([`07-performance.md`](07-performance.md) §6);
  isto pitanje vredi i za sigurnost — svaki paket je kod koji izvršavaš
- `pnpm-lock.yaml` se ne menja ručno (`PreToolUse` hook to blokira)

## Anti-patterns

| ❌                                         | ✅                                       |
| ------------------------------------------ | ---------------------------------------- |
| `localStorage.setItem('token', …)`         | Redux + `httpOnly` cookie                |
| `VITE_API_SECRET=…`                        | backend endpoint                         |
| `import.meta.env.X` direktno               | `env.X` sa zod validacijom               |
| `dangerouslySetInnerHTML` bez sanitizacije | `DOMPurify` + eslint-disable sa razlogom |
| `target="_blank"` bez `rel`                | `rel="noopener noreferrer"`              |
| prikaz sirove serverske greške             | `t(error.messageKey)`                    |
| `eval`, `new Function`                     | nikad                                    |
| autorizacija samo na frontendu             | frontend krije UI, backend proverava     |
| logovanje tokena/lozinki                   | nikad, ni u dev-u                        |

## Checklist

- [ ] Nijedan token nije u `localStorage`/`sessionStorage`
- [ ] Nijedna tajna u `VITE_` promenljivoj
- [ ] `import.meta.env` se čita samo u `packages/utils/env`
- [ ] Nema `dangerouslySetInnerHTML` bez `DOMPurify` i komentara
- [ ] Eksterni linkovi imaju `rel="noopener noreferrer"`
- [ ] CSP bez `unsafe-inline`
- [ ] `pnpm audit` prolazi
- [ ] Greške ne otkrivaju interne detalje
- [ ] Nova zavisnost proverena (veličina, održavanost, poznate ranjivosti)
