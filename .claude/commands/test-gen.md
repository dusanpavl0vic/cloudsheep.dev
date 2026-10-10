---
description: Generiše testove po piramidi iz docs/12 za dati fajl, feature ili paket
argument-hint: [putanja]
arguments: target
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm test:*), Bash(pnpm lint:*)
---

Napiši testove za `$target`.

## Prvo pročitaj

`docs/12-testing.md` — piramida, pragovi, `renderWithProviders` API.

## Odredi nivo po tome šta je `$target`

| Šta je | Nivo | Prag |
|---|---|---|
| čista funkcija u `src/helpers` / šema u `src/schemas` | unit | pun |
| reducer / selektor / zod šema | unit | pun |
| feature hook | `renderHook` | **90%** — primarni fokus |
| komponenta | RTL + `user-event` | 80% |
| feature kao celina | integracija sa MSW i pravim store-om | ključni flow |
| korisnički put | Playwright e2e | kritični putevi |

## Pravila — kršenje ovih čini test bezvrednim

- **Nikad ne testiraj implementaciju.** Bez `container.querySelector`, bez provere CSS klase
- Query prioritet: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- `user-event`, **ne** `fireEvent`
- servis koji piše u bazu: `*.db.test.ts` nad `appdb_test`, bez mock-a Prisma-e
- Test data kroz **factory** (`makeUser({ role: 'admin' })`), nikad JSON blob
- i18n u `cimode` — proveravaj **ključ**, ne prevod
- MSW na mrežnom nivou, nikad mock celog RTKQ modula
- Bez `setTimeout` u testu — `findBy*` ili `waitFor`
- Organism dobija i `jest-axe` test

## Postupak

1. Pročitaj `$target` u celosti i razumi šta radi
2. Izlistaj **ponašanja** koja treba pokriti (ne funkcije — ponašanja)
3. Napiši testove, uključujući granične slučajeve i putanju greške
4. `pnpm test` — svi moraju proći

## Acceptance

- Svi testovi prolaze
- Pokrivenost dostiže prag za taj nivo
- Nijedan test ne bi pao ako se promeni samo interna implementacija, uz isto ponašanje
