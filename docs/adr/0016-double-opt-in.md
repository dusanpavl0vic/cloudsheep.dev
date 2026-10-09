# ADR 0016 — Potvrda adrese linkom (double opt-in) za upit i newsletter

> Status: accepted (dopunjuje ADR 0013)
> Datum: 2026-10-09
> Učesnici: Dušan Pavlović

## Context

Vlasnik želi da mu pišu **samo ljudi sa pravom adresom**. Provera iz ADR 0013 (sintaksa, MX,
privremeni servisi, greška u kucanju) odbacuje izmišljene DOMENE, ali ne može da dokaže da
SANDUČE postoji: Gmail i ostali namerno prihvataju svaki primalac na svom domenu, a port 25 je
na VPS-u zatvoren. `nepostoji123456@gmail.com` prolazi.

## Decision

**Upit i prijava na newsletter važe tek kad posetilac klikne link iz mejla.**

- `POST /api/contact` posle provere iz ADR 0013 upisuje upit kao **nepotvrđen** (heš tokena,
  kao refresh token), drži izabrani termin **24 h** i šalje posetiocu mejl „Potvrdi adresu".
  Studio ne dobija ništa. Ako se potvrda ne može poslati (SMTP), upit se poništava i posetilac
  dobija grešku — inače bi upit nestao bez traga.
- Link vodi na stranicu sa dugmetom **„Potvrdi i pošalji"** koje šalje `POST`. Potvrda NIJE na
  `GET`: skeneri pošte (Outlook Safe Links, antivirus) otvaraju linkove iz mejla i potvrdili bi
  i adrese koje niko ne čita. Radi i bez JS-a (obična forma).
- Potvrda: `confirmedAt`, pa mejl studiju i potvrda posetiocu (kao do sada, docs/17 §5).
- Termin nepotvrđenog upita stariji od 24 h ponovo je slobodan; nepotvrđeni podaci se brišu
  posle 7 dana (minimizacija ličnih podataka).
- Newsletter isto: prijava je aktivna tek posle potvrde; izvoz i broj prijava računaju samo
  potvrđene. Odgovor forme je isti za novu i postojeću adresu (ne otkriva ko je prijavljen).
- Admin vidi samo potvrđene upite.

## Consequences

### Pozitivne
- Svaki upit koji stigne ima adresu koja postoji i koju pošiljalac čita.
- Newsletter je GDPR praksa (dokaziva saglasnost), bez spam prijava tuđih adresa.

### Negativne
- Korak više za posetioca; deo pravih posetilaca neće potvrditi (mejl u spamu, zaborav).
- Bez ispravnog SMTP-a forma ne radi uopšte — slanje je sada uslov, ne dodatak.
- Termin može biti „zauzet" do 24 h upitom koji nikad neće biti potvrđen.

### Neutralne / posledice po proces
- docs/17 §5, docs/20 §4, e2e: forma završava porukom „proveri sanduče".

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| Samo provera domena (ADR 0013) | bez koraka za posetioca | izmišljen sandučić na pravom domenu prolazi | ne ispunjava zahtev |
| SMTP proba (RCPT TO) | bez koraka | port 25 zatvoren; Gmail prihvata sve; rizik od crne liste | nepouzdano |
| Potvrda na GET linku | jedan klik | skeneri pošte potvrđuju sami | lažne potvrde |

## Revisit when

- Udeo nepotvrđenih upita pređe 30 % — proveriti dostavljivost (SPF/DKIM, spam).

## Reference

- ADR 0013, docs/17-backend.md §5–§7, docs/20-security.md §4
