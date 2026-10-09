# 20 — Sigurnost

> Status: active | Last review: 2026-10-08

Server sada postoji (ADR 0009): tajne žive u `src/server/**` i nikad ne stižu do pregledača.
Sve što je u klijentskom bundle-u je **javno** — to je polazna pretpostavka.

## 1. Pravila

1. **Access token u memoriji (Redux, `auth` slice), refresh u `httpOnly` kolačiću.** Nikad JWT u
   `localStorage`/`sessionStorage` (lint `no-restricted-properties`).
2. **`src/server/**` se ne uvozi iz klijentskog koda** (lint `no-restricted-imports`) i svaki
   serverski modul počinje sa `import 'server-only'` — build puca ako ga klijent dohvati.
3. **`NEXT_PUBLIC_*` je javno.** Tajne su bez prefiksa i čita ih samo `server/env.ts` (zod).
4. **Nijedna greška ne izlazi kao stack trace** — ni iz API-ja (`server/http.ts`), ni sa stranice
   (`error.tsx`). Klijent dobija `{ messageKey }`, detalj ide u log.
5. **HTML iz izvora se ekranira.** `dangerouslySetInnerHTML` postoji na tačno dva mesta: telo
   beleške, koje je markdown renderovan na serveru (`server/markdown.ts`, sirov HTML ekraniran,
   `javascript:` linkovi neutralisani), i `JsonLd` (JSON sa `<` ekraniranim u `\u003c`, pa
   string iz baze ne može da zatvori `<script>`).
6. **Eksterni linkovi:** `rel="noopener noreferrer"`.

## 2. Zaglavlja i CSP

`src/proxy.ts` pravi nonce po zahtevu:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-…' 'strict-dynamic';
  style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self';
  connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
  object-src 'none'; upgrade-insecure-requests
```

- **`script-src` je strog** — nonce, bez `'unsafe-inline'`. Next sam dodaje nonce svojim
  skriptama; JSON-LD ga dobija eksplicitno.
- **`style-src` ima `'unsafe-inline'` namerno:** next-yak dinamičke vrednosti (`$size` → CSS
  promenljiva) i React `style={{}}` idu kroz `style=""` atribut, a nonce atribute ne pokriva.
  Nonce u `style-src` bi poništio `'unsafe-inline'`.
- **Cena:** nonce znači da je svaka stranica dinamička (SSR po zahtevu) — ADR 0009.

`next.config.ts` dodaje `nosniff`, `Referrer-Policy`, `Permissions-Policy`, a `/admin` i `/api`
dobijaju `X-Robots-Tag: noindex, nofollow`. HSTS se ne postavlja: `.dev` je na preload listi.

## 3. Admin sesija

- **Prijava:** `POST /api/auth/login` → `{ user, accessToken }` + kolačić `refresh_token`
  (`httpOnly`, `SameSite=Lax`, `Secure` u produkciji, **`Path=/api/auth`** — ne putuje uz druge
  zahteve). Pogrešna lozinka i nepostojeći nalog daju istu poruku i isto vreme odgovora (bcrypt
  poređenje i nad lažnim hešom).
- **Refresh token je slučajan niz**, u bazi samo njegov SHA-256. **Rotacija:** svaka obnova briše
  stari red — ukraden token radi najviše jednom.
- **401 vs 403:** nevažeći token je 401 (klijent obnavlja sesiju i ponavlja zahtev); pogrešna
  uloga je 403 (obnova ne bi pomogla — bez petlje).
- **Svaka `/api/admin/*` ruta ide kroz `handleAdmin`** — provera uloge je deo omotača, ne može se
  zaboraviti.
- CSRF: refresh je `SameSite=Lax` i samo na `POST /api/auth/*`; admin API traži `Authorization`
  zaglavlje koje pregledač ne šalje sam — cross-site forma ga ne može podmetnuti.

## 4. Javne forme

| Zaštita                                                                                    | Gde                                     |
| ------------------------------------------------------------------------------------------ | --------------------------------------- |
| Rate limit po IP-u (upit 5/h, newsletter 5/h, provera adrese 60/10 min, prijava 10/15 min) | `server/rateLimit.ts`                   |
| IP iza Traefika: **poslednji** element `X-Forwarded-For` (prvi može da podmetne klijent)   | `server/request.ts`                     |
| Honeypot polje `website` — popunjeno se prihvata pa tiho odbacuje, isti 202                | servisi                                 |
| Adresa mora da prima poštu (MX) pre upisa i slanja                                         | `server/email-verification/` (ADR 0013) |
| Upit i prijava važe tek posle potvrde linkom; potvrda je POST (skeneri pošte otvaraju GET) | `services/contact.ts`, `newsletter.ts` (ADR 0016) |
| Token iz linka: 32 bajta, u bazi samo SHA-256; nepotvrđeno se briše posle 7 dana          | `server/confirmation.ts`                |
| Newsletter: isti odgovor za novu i postojeću adresu (ne otkriva ko je prijavljen)          | `services/newsletter.ts`                |
| CSV izvoz: ćelija na `= + - @` dobija apostrof (CSV injection)                             | `services/newsletter.ts`                |

## 5. Mejl

- Pošiljalac je uvek NAŠ nalog; ime posetioca nikad nije u `From` (obrazac krađe identiteta) — ide
  u `Reply-To`, naslov i telo.
- Mejl studiju je čist tekst; HTML potvrde ekranira svako polje iz forme.
- `Auto-Submitted: auto-replied` (RFC 3834) — auto-responderi ne odgovaraju na našu potvrdu.

## 6. Otpremljene datoteke

- Tip se prepoznaje po **magičnim bajtovima**, ne po imenu ni po tipu koji pošalje klijent.
- Ime na disku je `<uuid>.<ext>`; serviranje prihvata samo taj oblik (bez `../`).
- SVG se servira sa `Content-Security-Policy: default-src 'none'; sandbox` — `<script>` u SVG-u se
  ne izvršava. Uz to `nosniff`, `Content-Disposition: inline`.
- Veličina se proverava pre čitanja tela (`Content-Length`), pa pre upisa.

## 7. Zavisnosti

- `pnpm audit --audit-level=high` u CI.
- Build skripte samo za odobrene pakete (`allowBuilds` u `pnpm-workspace.yaml`).
- Novi dependency > 20 KB gzip → ADR.

## Checklist

- [ ] Nijedan token u `localStorage`/`sessionStorage`
- [ ] Nijedna tajna u `NEXT_PUBLIC_*`; serverski modul počinje sa `import 'server-only'`
- [ ] Nova admin ruta koristi `handleAdmin`
- [ ] Nova javna forma: rate limit, honeypot, provera adrese i potvrda linkom ako prima mejl
- [ ] Greške ne otkrivaju detalje (samo `messageKey`)
- [ ] Eksterni linkovi imaju `rel="noopener noreferrer"`
