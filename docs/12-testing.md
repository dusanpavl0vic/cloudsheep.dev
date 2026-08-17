# 12 — Testiranje

> Status: active | Last review: 2026-08-15

Vitest 4 + Testing Library + `user-event` + MSW 2 + Playwright.

## Piramida

| Nivo        | Alat                    | Coverage                   | Šta se testira                                |
| ----------- | ----------------------- | -------------------------- | --------------------------------------------- |
| Unit        | Vitest                  | **100%** `packages/utils`  | čiste funkcije, reduceri, selektori, zod šeme |
| Hook        | `renderHook`            | **90%** `features/*/hooks` | **primarni fokus** — logika živi u hookovima  |
| Komponenta  | RTL + `user-event`      | 80%                        | ponašanje, ne implementacija                  |
| Integracija | RTL + MSW + pravi store | ključni flow-ovi           | feature end-to-end u JSDOM-u                  |
| E2E         | Playwright              | kritični putevi            | login, CRUD, i18n switch, modal flow          |

Ukupni prag: **80%**. Pragovi su u `vitest.config.ts` i **obaraju CI**.

Težište je na **hook nivou** — to je posledica hook-first pravila. Ako je logika u hookovima,
tu je i najveći povraćaj po testu.

## Pravila

1. **Nikad ne testiraj implementaciju.** Bez `container.querySelector`, bez provere imena
   CSS klase, bez `.state()`.
2. **Prioritet query-ja:** `getByRole` > `getByLabelText` > `getByText` > `getByTestId`.
   `data-testid` je poslednje utočište, ne prvo.
3. **`renderWithProviders`** iz `@app/testing` — nikad ručno sklapanje providera.
4. **MSW handleri kolokovani uz feature**, ne u globalnom fajlu koji naraste na 800 linija.
5. **Test data kroz factory funkcije**, ne JSON blobove.
6. **`user-event`, ne `fireEvent`** — `fireEvent` preskače ono što browser stvarno radi.
7. **Svaki bug fix počinje failing testom.**
8. **i18n u `cimode`** — testira se ključ, ne prevod.

## `renderWithProviders`

```ts
// packages/testing/src/renderWithProviders.tsx
export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, store = createTestStore(preloadedState), route = '/', ...options }: Options = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={testI18n}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </I18nextProvider>
      </Provider>
    );
  }
  return { store, user: userEvent.setup(), ...render(ui, { wrapper: Wrapper, ...options }) };
}
```

Vraća i `store` (za proveru dispatch-ovanih akcija) i `user` (već setup-ovan).

## Primeri po nivou

### Unit — čista funkcija

```ts
describe('slugify', () => {
  it.each([
    ['Zdravo Svete', 'zdravo-svete'],
    ['Čačak i Šabac', 'cacak-i-sabac'],
    ['  trim  ', 'trim'],
  ])('%s → %s', (input, expected) => {
    expect(slugify(input)).toBe(expected)
  })
})
```

### Reducer

```ts
it('briše sesiju na loggedOut', () => {
  const state = authReducer({ user: makeUser(), accessToken: 'x' }, loggedOut())
  expect(state).toEqual({ user: null, accessToken: null })
})
```

### Hook — primarni fokus

```ts
it('vraća isAuthenticated true kad postoji korisnik', () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: createWrapper({ preloadedState: { auth: { user: makeUser(), accessToken: 't' } } }),
  })
  expect(result.current.isAuthenticated).toBe(true)
})
```

### Komponenta — ponašanje

```ts
it('prikazuje grešku kad je lozinka prekratka', async () => {
  const { user } = renderWithProviders(<LoginForm />);

  await user.type(screen.getByLabelText('auth.login.email'), 'a@b.rs');
  await user.type(screen.getByLabelText('auth.login.password'), 'kratka');
  await user.click(screen.getByRole('button', { name: 'auth.login.submit' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('auth.errors.passwordTooShort');
});
```

### Integracija — MSW + pravi store

```ts
it('login puni sesiju i vodi na dashboard', async () => {
  server.use(http.post('/auth/login', () => HttpResponse.json({ user: makeUser(), accessToken: 't' })));

  const { user, store } = renderWithProviders(<App />, { route: '/login' });
  await user.type(screen.getByLabelText('auth.login.email'), 'a@b.rs');
  await user.type(screen.getByLabelText('auth.login.password'), 'lozinka123');
  await user.click(screen.getByRole('button', { name: 'auth.login.submit' }));

  expect(await screen.findByRole('heading', { name: 'dashboard.title' })).toBeVisible();
  expect(selectIsAuthenticated(store.getState())).toBe(true);
});
```

### A11y

```ts
it('nema axe povreda', async () => {
  const { container } = renderWithProviders(<DataTable rows={makeRows(5)} />);
  expect(await axe(container)).toHaveNoViolations();
});
```

`jest-axe` (ne `vitest-axe` — vidi [`16-tooling-ci.md`](16-tooling-ci.md) §1.5 C).
**Obavezno u svakom organism testu.**

### E2E

Živi u `apps/web/e2e/`, vozi ga `pnpm e2e` (turbo, `dependsOn: ["build"]`).

**Šta pripada ovde, a šta ne.** Sve što jsdom može ostaje u Vitest-u — brže je i preciznije.
E2E nosi samo ono što traži pravi pretraživač:

| Ide u E2E                                  | Zašto ne može u jsdom                                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| mobilni panel (`<dialog>` + `showModal()`) | jsdom nema top-layer; u unit testu su `showModal` i `close` **stubovani**, pa zamku fokusa i `Esc` tamo niko ne proverava |
| `color-contrast` kroz axe                  | traži stvarno izračunate boje i raspored                                                                                  |
| `<html lang>` na dokumentu                 | unit test vidi i18next instancu, ne atribut koji čita screen reader                                                       |
| serviranje `/robots.txt`, `/sitemap.xml`   | rewrite pravila postoje tek nad pravim serverom                                                                           |

**Dve zamke koje su nas već koštale:**

1. **Axe mora meriti mirno stanje.** `.reveal` animira `opacity`, pa axe uhvati element usred
   prelaza i prijavi lažan `color-contrast`. Izgledalo je kao tri prave WCAG greške;
   sa `page.emulateMedia({ reducedMotion: 'reduce' })` — nula. WCAG ionako ne meri prelazna
   stanja, a usput se proverava i verzija stranice za korisnike sa smanjenim kretanjem.
2. **Vitest i Playwright se moraju razdvojiti izričito.** Vitest-ov podrazumevani obrazac
   hvata i `*.spec.ts`, pa je pokupio Playwright fajlove i pao na njihovom importu. Otud
   `include: ['src/**/*.test.{ts,tsx}']` u `vitest.config.ts`: **Vitest je `.test.` u `src/`,
   Playwright je `.spec.` u `e2e/`.**

```ts
test('korisnik se prijavljuje i odjavljuje', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('E-pošta').fill('a@b.rs')
  await page.getByLabel('Lozinka').fill('lozinka123')
  await page.getByRole('button', { name: 'Prijavi se' }).click()
  await expect(page.getByRole('heading', { name: 'Kontrolna tabla' })).toBeVisible()

  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})
```

## Factories

```ts
// packages/testing/src/factories/user.ts
export const makeUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: 'usr_1',
  email: 'test@cloudsheep.dev',
  name: 'Test Korisnik',
  role: 'member',
  ...overrides,
})
```

`makeUser({ role: 'admin' })` čita se u jednom redu; JSON blob od 40 linija ne čita se nikako.

## Anti-patterns

| ❌                                           | ✅                              |
| -------------------------------------------- | ------------------------------- |
| `container.querySelector('.btn-primary')`    | `getByRole('button', { name })` |
| `fireEvent.change(input, …)`                 | `await user.type(input, …)`     |
| `data-testid` kao prvi izbor                 | `getByRole`/`getByLabelText`    |
| test koji proverava da je `useState` pozvan  | testiraj šta korisnik vidi      |
| `await new Promise(r => setTimeout(r, 500))` | `findBy*` / `waitFor`           |
| mock celog RTKQ modula                       | MSW na mrežnom nivou            |
| JSON fixture od 40 linija                    | factory sa `overrides`          |
| test koji proverava tekst prevoda            | `cimode`, proveri ključ         |
| snapshot cele stranice                       | ciljane provere ponašanja       |

## Checklist

- [ ] Nova čista funkcija ima test — `packages/utils` ostaje na 100%
- [ ] Novi feature hook ima test (≥ 90% za `features/*/hooks`)
- [ ] Reducer i selektori pokriveni
- [ ] Komponenta testirana kroz `getByRole`, bez `querySelector`-a
- [ ] Organism ima axe test
- [ ] MSW handler kolokovan uz feature
- [ ] Test data kroz factory
- [ ] Kritičan flow ima e2e
- [ ] Bug fix ima test koji je pao pre popravke
- [ ] `pnpm test` prolazi sa pragovima
