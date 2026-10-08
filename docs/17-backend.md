# 17 — Backend: API, baza, auth, mejl, upload

> Status: active | Last review: 2026-10-08

Backend je deo iste Next.js aplikacije (ADR 0009). Sav kod je u `src/server/`, a HTTP ulaz u
`src/app/api/**/route.ts`.

## 1. Slojevi

```
app/api/**/route.ts      HTTP: parsiraj (schemas/) → servis → json/noContent
server/services/*.ts     poslovna logika + serializeri (javni oblik na jeziku stranice, admin ravan)
server/{auth,mail,uploads,email-verification,cv}/   tehnički moduli
server/{db,env,http,cache,rateLimit,request,log,markdown}.ts
```

- **Svaki modul u `server/` počinje sa `import 'server-only'`.** Ne uvozi React, store ni hookove.
- **Serializer nabraja polja** — `json(prismaRow)` bi propustio svako novo polje iz šeme, i ono koje
  ne treba da izađe.
- Javni oblik je na jeziku stranice (`title: string`); admin oblik je ravan (`titleSr`, `titleEn`),
  jer puni formu.

## 2. Okruženje (`server/env.ts`)

Zod šema, **lenja**: validira se pri prvom pozivu `env()`, ne pri uvozu — `next build` uvozi route
handlere, a CI nema produkcione tajne. Spisak i podrazumevane vrednosti: `.env.example`.

| Promenljiva            | Obavezna         | Napomena                                             |
| ---------------------- | ---------------- | ---------------------------------------------------- |
| `DATABASE_URL`         | da               |                                                      |
| `JWT_SECRET`           | da, ≥ 32 znaka   | `openssl rand -base64 32`                            |
| `UPLOAD_DIR`           | ne (`./uploads`) | u kontejneru montiran volume                         |
| `PUBLIC_UPLOAD_BASE`   | ne (prazno)      | prazno = isto poreklo (`/uploads/…`)                 |
| `SMTP_*`, `CONTACT_TO` | ne               | bez njih se mejl ispisuje u log umesto da se pošalje |
| `NEXT_PUBLIC_SITE_URL` | build-time       | canonical, OG, sitemap, linkovi u mejlu              |

## 3. Baza (Prisma 6)

- Šema i migracije u `prisma/`. Nova migracija: `pnpm db:migrate --name <opis>`. U produkciji je
  pokreće Coolify pre-deployment komanda (`prisma migrate deploy`).
- **Seed** (`pnpm db:seed`): admin iz `SEED_ADMIN_*` (lozinka se nikad ne menja ni loguje),
  početne tehnologije, projekti, profil, tim. Uzorci iz dizajna (beleške, utisak, termini) **samo
  van produkcije** — utisci iz dizajna su izmišljeni i ne smeju na pravi sajt.
- Redosled je kolona `sortOrder`; prevlačenje šalje ceo niz id-eva (`PATCH …/order`).

## 4. API

| Javno                                                             |                                            |
| ----------------------------------------------------------------- | ------------------------------------------ |
| `GET /api/health`, `/api/health/ready`                            | liveness (bez baze) / readiness (sa bazom) |
| `POST /api/contact`                                               | upit u tri koraka (+ termin) → 202         |
| `POST /api/email/check`                                           | provera adrese dok se kuca                 |
| `POST /api/newsletter`, `GET /api/newsletter/unsubscribe?token=`  | prijava / odjava jednim klikom             |
| `GET /api/booking/slots`                                          | slobodni termini (14 dana, ≥ 12 h unapred) |
| `POST /api/auth/login`, `/refresh`, `/logout`, `GET /api/auth/me` | admin sesija                               |
| `GET /uploads/<uuid>.<ext>`                                       | otpremljene slike                          |

Admin (`/api/admin/*`, sve kroz `handleAdmin`): `profile`, `social-links`, `projects` (+ `images`),
`technologies`, `team` (+ `cv`, `cv.pdf`), `messages`, `uploads`, `notes`, `testimonials`,
`newsletter` (+ `export.csv`), `booking/slots` (+ `generate`). Liste vraćaju `{ items }`.

Javni JSON endpointi starog API-ja (`/projects`, `/profile`, `/team`, `/technologies`) **ne postoje**:
javne stranice čitaju servise direktno (docs/11 §1), a manje površine je manje za održavanje.

## 5. Upit i termini

`submitBrief` (`services/contact.ts`):

1. honeypot popunjen → tiho ništa (ruta i dalje vraća 202);
2. adresa mora da prima poštu → inače **422** na polju `email`, bez upisa i slanja (§6);
3. **jedna transakcija**: upis poruke + zauzimanje termina
   `updateMany({ where: { id, contactMessageId: null, startsAt: { gt: sada + 12 h } } })` — uslov je
   deo istog UPDATE-a, pa dva istovremena upita ne mogu oba da dobiju termin (drugi → **409** na
   `slotId`, poruka se poništava). Test: `contact.db.test.ts`;
4. **prvo upis, pa slanje**: pad SMTP-a ne gubi upit — `emailError` se vidi u admin-u;
5. potvrda posetiocu u zasebnom `try` — njegov pun sandučić ne poništava zapis o mejlu studiju.

Termine pravi admin generatorom (dani u nedelji × satnice, u vremenu `Europe/Belgrade`; letnje
vreme dolazi iz `Intl`, `helpers/date.ts`). Zauzet termin se ne briše — prvo se oslobađa.

## 6. Provera mejla (ADR 0013)

`verifyEmail(email, { allowTypo })` u `server/email-verification/`:

| Korak                                                     | Rezultat                                                        |
| --------------------------------------------------------- | --------------------------------------------------------------- |
| oblik (`helpers/email.ts`)                                | `syntax`                                                        |
| greška u kucanju poznatog provajdera (`gmial.com`)        | `typo` + predlog — osim ako je posetilac potvrdio (`allowTypo`) |
| privremeni servis (lista ~8.900 domena)                   | `disposable`                                                    |
| MX zapis; bez MX-a A/AAAA (implicitni MX); „null MX" = ne | `noMx`                                                          |
| DNS ne odgovori (timeout 3 s, SERVFAIL)                   | **prihvata se** — kvar našeg DNS-a ne sme da odbije posetioca   |

Rezultat po domenu se pamti sat vremena. Isti postupak važi za `POST /api/email/check` (forma
proverava na blur) i pri slanju upita i prijave na newsletter. Sam sandučić se ne proverava — vidi
ADR 0013 za razloge.

## 7. Mejl

`server/mail/`: lenji nodemailer transport, `briefMails.ts` (studiju — čist tekst, srpski;
posetiocu — tekst + HTML na jeziku forme, sa terminom ako je izabran), `template.ts` (inline stil,
tabele, hex boje iz `PALETTE`, sve ekranirano). Tekst je u `mail` namespace-u poruka i čita se kroz
`createTranslator` (radi bez zahteva).

## 8. Upload

`POST /api/admin/uploads` (`multipart/form-data`, polje `file`) → `storeUpload` (magični bajtovi,
`image-size` za dimenzije, `<uuid>.<ext>` na disku) → red u `Asset`. Serviranje: `app/uploads/[...path]`
sa zaglavljima iz docs/20 §6. Slike se ne optimizuju u runtime-u (`images.unoptimized`) — sharp bi
trošio memoriju koju server nema.

## 9. CV

`GET /api/admin/team/<id>/cv.pdf?lang=sr|en` — pdfkit (čist JS), fontovi iz `assets/fonts`
(uključeni u standalone image kroz `outputFileTracingIncludes`).

## 10. Testovi

`*.db.test.ts` rade nad pravim Postgres-om (test baza, `TEST_DATABASE_URL`), sekvencijalno,
sa praznom bazom pre svakog testa. DNS i SMTP su mokovani; Next keš je u testu prolaz. Vidi
`docs/12-testing.md`.
