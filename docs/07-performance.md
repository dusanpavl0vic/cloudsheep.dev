# 07 — Performanse

> Status: active | Last review: 2026-08-15
> **Najvažniji dokument u repou.** Ako čitaš samo jedan — ovaj.

## 1. React Compiler je uključen

Compiler radi auto-memoizaciju za sve app-e i `packages/ui`.
`eslint-plugin-react-hooks` v7 nosi compiler pravila i **kršenje je error**, ne warning.

Posledica koju treba razumeti: **ručni `useMemo`/`useCallback` je sada uglavnom redundantan**,
a ponekad se sudara sa compiler analizom. Odluka: [`adr/0001-react-compiler.md`](adr/0001-react-compiler.md).

## 2. `useMemo` / `useCallback` — tri dozvoljena slučaja

`useMemo` nije besplatan: alocira dependency array i poredi ga svaki render. Za jeftin izraz
košta više nego sam izračun.

> Dozvoljen je **samo** u tri slučaja, svaki sa obaveznim komentarom `// memo: <razlog>`:
>
> 1. **Skupa kalkulacija** — O(n) ili gore nad kolekcijom, parsiranje/formatiranje u petlji.
> 2. **Referencijalna stabilnost** za vrednost koja ide u dependency array drugog hooka
>    ili u context value.
> 3. **Selector factory** — `useMemo(() => makeSelectItemById(id), [id])`.

```ts
// ✅ memo: sortiranje 5k redova pri svakom keystroke-u u pretrazi
const sorted = useMemo(() => rows.toSorted(byUpdatedAt), [rows]);

// ✅ memo: referencijalna stabilnost — ulazi u context value
const value = useMemo(() => ({ user, logout }), [user, logout]);

// ❌ jeftin izraz — compiler to radi bolje
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
```

Provera: `/audit-memo` nalazi svaki `useMemo` van ova tri slučaja.

**Iskreno:** "više `useMemo`-a" je pogrešan instinkt uz React Compiler. Legitimna alternativa je
compiler OFF + dosledna ručna memoizacija — ali **ne oba**. Mi smo izabrali compiler ON.

## 3. `useEffect` — whitelist

Dozvoljen **samo** za sinhronizaciju sa spoljnim sistemom:

- pretplata na browser/DOM/3rd-party event (prvo probaj `useSyncExternalStore`)
- imperativni DOM rad — focus, scroll restore, canvas, mape
- setup/teardown ne-React biblioteke
- analytics page-view
- WebSocket lifecycle

**Svaki `useEffect` mora imati komentar `// effect: <koji spoljni sistem sinhronizuje>`.**
Custom lint pravilo `require-effect-comment` ovo proverava.

| Anti-pattern | Zamena |
|---|---|
| Fetch podataka | RTK Query hook |
| Derivirani state | izračunaj tokom rendera |
| Reset state-a na promenu prop-a | `key` prop |
| Sinhronizacija dva state-a | jedan izvor istine |
| Logika koja pripada handleru | u handler |
| Transformacija pred render | `selectFromResult` ili `createSelector` |
| Slušanje rezultata modala | promise-based `useModal` ([`06-modals.md`](06-modals.md)) |
| Inicijalizacija pri startu app-e | module-level kod pre `createRoot` |
| Side-effect na promenu state-a | listener middleware (RTK) |

```ts
// ✅ effect: mousemove na window — svetlo koje prati kursor
useEffect(() => {
  const onMove = (e: MouseEvent) => { … };
  window.addEventListener('mousemove', onMove, { passive: true });
  return () => window.removeEventListener('mousemove', onMove);
}, []);

// ❌ derivirani state
useEffect(() => { setVisible(items.filter((i) => i.tag === tag)); }, [items, tag]);
// ✅
const visible = items.filter((i) => i.tag === tag);
```

**Iskreno:** `// effect:` komentar nije industrijska praksa — to je naše pravilo da bi zahtev
bio mašinski proverljiv. Ako smeta timu, obriši pravilo; whitelist ostaje.

Provera: `/audit-effects`.

## 4. `useState` — najviše 2 po komponenti

Kad prekoračiš 2, redom:

1. **derivirano** → obriši, izračunaj tokom rendera
2. **povezana polja** → `useReducer`
3. **forma** → react-hook-form ([`10-forms-validation.md`](10-forms-validation.md))
4. **prelazi granicu komponente** → Redux preko feature hooka
5. **pripada URL-u** → `useSearchParams`

Ako i dalje treba 3+, komponenta radi previše stvari. Podeli je.

**Iskreno:** ovo je heuristika, **ne industrijski standard**. Kao pritisak ka boljem dizajnu
je odlična; kao dogma vodi u veštačke `useReducer`-e nad tri booleana. Zato eskalaciona lista,
a ne zabrana. Custom lint pravilo `max-usestate` prijavljuje prekoračenje.

Provera: `/audit-state`.

## 5. Render performanse

- **Liste > 100 stavki → `@tanstack/react-virtual`.** Bez izuzetka.
- **`key` nikad `index`** za dinamičke liste — reorder pravi pogrešan reuse DOM čvorova.
- **Context split** na `StateContext`/`DispatchContext`. Za često-menjajuće podatke koristi
  Redux, ne Context — Context rerenderuje sve potrošače.
- **`useDeferredValue`** za search-as-you-type.
- **`useTransition`** za skupu navigaciju ili filter.
- **`content-visibility: auto`** za sekcije ispod fold-a.

## 6. Bundle

- Route-level splitting **obavezan**; feature-level za teške feature-e.
- Manual chunks: `react-vendor`, `redux-vendor`, `ui-vendor`. Ne granularnije — previše
  malih chunkova je sporije od par većih.
- **Budžeti (CI fail):** initial JS gzip ≤ **150 KB**, CSS gzip ≤ **20 KB**, po ruti ≤ **60 KB**.
- **Zabranjeno:** `moment`, ceo `lodash`, cele icon biblioteke (`import * as Icons`).
- `import()` za: chart, rich text editor, PDF, mape, date picker.
- **Novi dependency > 20 KB gzip → ADR.**

```ts
// ❌ cela biblioteka
import _ from 'lodash';
import * as Icons from 'lucide-react';

// ✅ per-import
import { debounce } from '@app/utils';
import { ChevronDown } from 'lucide-react';
```

Provera: `/bundle-check`, `pnpm size`.

## 7. Lighthouse

| Metrika | Cilj | Mehanizam |
|---|---|---|
| LCP | < 1.8 s | preload hero/fonta, `fetchpriority="high"` |
| CLS | 0 | `width`/`height` na `<img>`, `aspect-ratio`, rezervisani skeletoni |
| INP | < 200 ms | `useTransition`, virtualizacija, ništa sinhrono > 50 ms u handleru |
| TBT | < 150 ms | code splitting, defer non-critical JS |
| A11y | 100 | `jsx-a11y` error, axe u CI, kontrast ≥ 4.5:1 |

**Fontovi:** self-hostovani, subset `latin` + `latin-ext` (bez `latin-ext` srpski č/ć/š/ž/đ
padaju na fallback), `woff2`, `font-display: swap`, preload samo za prvi ekran.
Varijabilni font = **jedan** fajl za sve težine (`font-weight: 400 700`) — naivno skidanje
sa Google-a daje 18 fajlova / 572 KB umesto 6 / 174 KB.

**Slike:** AVIF/WebP, `<picture>`, `loading="lazy"` osim LCP slike, `srcset`.

**Meri se samo produkcijski build.** Dev server servira nemitifikovane ESM module sa
react-refresh-om — Lighthouse tamo pokazuje FCP od 13 s i „duplicated JavaScript", što nema
veze sa stvarnošću.

```bash
pnpm build --filter=web && pnpm preview --filter=web   # pa Lighthouse na :4173
```

LHCI assertions: ≥ 0.95 performance, 1.0 a11y/best-practices/seo.

**Iskreno:** Lighthouse 100 u lab-u (throttled, prazan cache) je ostvarivo za SPA. Field
(CrUX) zavisi od mreže i hostinga — zato `web-vitals` reporting iz [`16`](16-tooling-ci.md).

Provera: `/perf-audit`, `pnpm lh`.

## 8. Referentne brojke `apps/web`

Baseline pre monorepo migracije (produkcijski build, throttled):
**desktop 100 / mobile 92**, FCP 0.5 s, LCP 0.6 s, 337 KiB ukupno.

Sastav bundle-a: `react-dom` 37%, `react-router` 28%, `tailwind-merge` 7%,
`i18next` 6%, `@reduxjs/toolkit` 5%.

Svaka izmena koja obori ove brojke mora imati obrazloženje u PR-u.

## Checklist

- [ ] Nijedan novi `useMemo`/`useCallback` bez `// memo:` komentara i bez jednog od 3 razloga
- [ ] Nijedan novi `useEffect` bez `// effect:` komentara i bez stavke sa whitelist-e
- [ ] Nijedna komponenta sa 3+ `useState`
- [ ] Lista > 100 stavki je virtualizovana
- [ ] `key` nije `index`
- [ ] Nova ruta je lazy
- [ ] Novi dependency < 20 KB gzip, inače ADR
- [ ] `pnpm size` prolazi
- [ ] Slika ima `width`/`height` ili `aspect-ratio` kontejner
