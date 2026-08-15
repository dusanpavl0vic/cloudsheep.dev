# ADR 0008 — Tema preko `data-theme` atributa, ne `class`

> Status: **accepted**
> Datum: 2026-08-15

## Context

[ADR 0000](0000-initial-spec.md) §11 kaže: „Dark mode: `class` strategija" — što je Tailwind v3
konvencija (`<html class="dark">` + `dark:` prefiks vezan za `.dark` selektor).

Postojeći `apps/web` koristi **`data-theme` atribut**:

```css
@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));
```

```html
<html data-theme="dark">
```

Tailwind v4 uvodi `@custom-variant`, koji čini `dark:` prefiks vezljivim za **bilo koji**
selektor — `class` više nije jedina podržana strategija, nego jedna od opcija.

Postojeće rešenje je napisano, testirano i radi: listener middleware postavlja atribut,
inline script u `index.html` sprečava FOUC, `prefers-color-scheme` je fallback pri prvom ulasku.

## Decision

**Zadržavamo `data-theme` atribut.** `@custom-variant dark` ostaje u `theme.css`.

Tema se menja postavljanjem atributa na `<html>`; to radi listener middleware u `@app/core`.

## Consequences

### Pozitivne
- **Nema migracije** koda koji radi — nema rizika regresije na live sajtu
- `data-*` je semantički ispravnije od klase za stanje: klasa opisuje izgled, atribut stanje
- Proširivo bez sudara: `data-theme="dark"`, `"high-contrast"`, `"sepia"` su tri vrednosti
  istog atributa, dok bi kao klase bile tri klase koje se mogu slučajno kombinovati
- `document.documentElement.dataset.theme` je jasniji API od `classList.toggle('dark')`

### Negativne
- **Odstupanje od shadcn/Tailwind podrazumevanog** — copy-paste primer iz shadcn dokumentacije
  koji koristi `.dark` klasu neće raditi bez prilagođavanja
- Novi developer koji zna Tailwind očekuje `class` strategiju; mora se pročitati ovaj ADR
- Alati koji pretpostavljaju `.dark` (neki Tailwind pluginovi) traže konfiguraciju

### Neutralne
- Inline anti-FOUC script postavlja atribut umesto klase — ista složenost

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| **`class` strategija** (SPEC default) | podrazumevano u shadcn dokumentaciji, očekivano | migracija radnog koda bez funkcionalne koristi; rizik regresije na live sajtu | promena radi usklađenosti sa dokumentom, ne radi korisnika |
| **`prefers-color-scheme` bez prekidača** | najjednostavnije | korisnik ne može da bira | zahtev je ručni prekidač |
| **Oba (klasa + atribut)** | maksimalna kompatibilnost | dva izvora istine za istu stvar | odbačeno odmah |

## Revisit when

- shadcn objavi komponente koje tvrdo zavise od `.dark` selektora
- Uvodi se treća tema (tada proveriti da li atribut i dalje najbolje skalira — verovatno da)

## Reference

- [`docs/08-styling-ui.md`](../08-styling-ui.md)
- [ADR 0000](0000-initial-spec.md) §11
