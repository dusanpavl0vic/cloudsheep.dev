# ADR 0013 — Provera mejla: sintaksa + MX + disposable, bez SMTP probe

> Status: accepted
> Datum: 2026-10-08
> Učesnici: Dušan Pavlović

## Context

Kontakt forma je proveravala samo oblik adrese (`z.email()`). Prolazila je svaka adresa koja
izgleda ispravno — i izmišljena i pogrešno ukucana (`marko@gmial.com`). Automatski odgovor
je zatim išao na nepostojeću adresu i vraćao se kao bounce na Gmail nalog sa kog šaljemo,
što kvari reputaciju pošiljaoca. Korisnik traži da se nepostojeće adrese **ne mogu upisati**.

## Decision

Adresu proveravamo na serveru u tri koraka, i to i **dok korisnik kuca** (on-blur) i
**pri slanju**:

1. sintaksa (zod);
2. **domen mora imati MX zapis** (`dns.promises.resolveMx`, timeout 3 s, keš 1 h);
   „null MX" (RFC 7505) se odbija;
3. domen ne sme biti na listi privremenih (disposable) servisa.

Uz to, za česte greške u kucanju (`gmial.com`) nudimo predlog — čista funkcija, radi i na
klijentu. Neispravna adresa daje **422 sa greškom na polju** i nikad ne pokreće upis ni slanje.
Isto važi za newsletter.

Ako DNS ne odgovori (timeout, SERVFAIL), adresa se **prihvata** — kvar našeg DNS-a ne sme
da blokira pravog posetioca.

## Consequences

### Pozitivne
- Izmišljeni i pogrešno ukucani domeni se odbijaju pre slanja; bounce-ova praktično nema.
- Posetilac vidi grešku dok kuca, sa predlogom ispravke.

### Negativne
- **Postojanje samog sandučeta se ne proverava.** `nepostojim123@gmail.com` prolazi, jer
  gmail.com ima MX. SMTP proba (RCPT TO) je nepouzdana: Gmail i drugi veliki provajderi
  namerno prihvataju svaki RCPT, a port 25 je na VPS-u blokiran.
- DNS upit dodaje do ~100 ms (prvi put po domenu) na slanje forme.
- Lista disposable domena zastareva; osvežava se sa paketom.

### Neutralne / posledice po proces
- `docs/17-backend.md` §Mejl, `docs/10-forms-validation.md`.

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| Ne raditi ništa | — | bounce-ovi i loša reputacija | to je problem |
| SMTP RCPT proba | proverava sandučić | nepouzdana, blokiran port 25, liči na spam | ne radi u praksi |
| Double opt-in (potvrda klikom) | jedini siguran dokaz | trenje za posetioca koji samo pita | prevelika cena za kontakt formu |
| Spoljni servis za verifikaciju | proverava i sandučić | trošak, šalje adrese trećoj strani | privatnost |

## Revisit when

Ako se bounce-ovi i dalje pojavljuju (vidi `emailError` u admin-u) — tada double opt-in
za newsletter.

## Reference

- RFC 5321 §5.1, RFC 7505 (null MX)
- `src/server/email-verification/`
