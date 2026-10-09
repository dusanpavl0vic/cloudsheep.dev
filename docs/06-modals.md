# 06 — Modali i dijalozi

> Status: active | Last review: 2026-10-09
> Engine je sopstveni i radi preko Redux-a. Odluka je u [`adr/0006-modal-engine.md`](adr/0006-modal-engine.md);
> oblik je prilagođen Next.js-u (ADR 0009).

**Svaki dijalog se otvara preko Redux-a (`ui.modals`), a ne preko lokalnog `isOpen` stanja.**

## Pravila

1. **`useState(false)` za dijalog sa domenskom akcijom je zabranjen.** Lokalno stanje je
   dozvoljeno samo za čisto prezentacione stvari (tooltip, `<details>`).
2. **Props-i modala su serijalizabilni** (`ModalProps`: string, broj, boolean, `null`, niz
   stringova). Funkcija, Promise i Blob ne idu u Redux.
3. **Modal komponenta je `lazy`**, pa nijedan modal nije u početnom JS-u javnih stranica.
4. **`ModalRoot` se renderuje jednom**, u `RootLayout`-u. Promena rute zatvara sve modale.
5. **Mehaniku daje `Overlay`**: fokus ostaje u dijalogu, `aria-modal`, Esc, zaključan skrol,
   a klik na pozadinu zatvara dijalog. Ništa od toga se ne piše ručno.
6. **Potvrda vraća rezultat kroz `await`** (`useConfirm`), a ne kroz `useEffect` koji sluša
   stanje.

## Delovi

```
constants/modals.ts            MODALS (imena) + MODAL_KIND (popover | overlay)
store/slices/ui                ui.modals — { name, props } po otvorenom modalu
hooks/useModal.ts              open(props?) / close() / isOpen / props
hooks/useConfirm.ts            Promise<boolean>; odgovori žive u Map-i VAN Redux-a
modals/ModalRoot/              OVERLAY_MODALS (lazy registar) + renderer
modals/<Ime>/                  sam modal; prima { props, onClose }
components/overlays/Overlay    zajednička mehanika
```

### Registar

```ts
// modals/ModalRoot/ModalRoot.constants.ts
export const OVERLAY_MODALS: Partial<Record<ModalName, ComponentType<OverlayModalProps>>> = {
  mobileNav: lazy(() => import('../MobileNav')),
  confirmDialog: lazy(() => import('../ConfirmDialog')) as ComponentType<OverlayModalProps>,
  adminTechnologyForm: lazy(() => import('../TechnologyFormModal')) as ComponentType<OverlayModalProps>,
  // …
}
```

Novi modal se dodaje na tri mesta: ime u `MODALS`, vrsta u `MODAL_KIND` i red u
`OVERLAY_MODALS`. TypeScript traži prva dva.

## Dve vrste dijaloga

### Potvrda: vraća odgovor

```ts
const confirm = useConfirm()
if (await confirm({ message: t('deleteConfirm', { name }), danger: true })) await deleteItem(id)
```

`useConfirm` otvara `confirmDialog` sa `requestId`. Funkcija `resolve` čeka u Map-i u
`hooks/useConfirm.ts`, ključena tim ID-jem, a `ConfirmDialog` je razrešava kroz `settleConfirm`.
Zatvaranje bez izbora (Esc ili klik na pozadinu) znači „ne". Admin brisanje ide kroz
`useAdminAction().remove(message, action)`, koji prvo pita, pa briše, pa pokazuje toast.

### Forma: čuva sama

Dijalog za dodavanje i izmenu (tehnologija, utisak, član tima, link) dobija samo `{ id? }`.
Zapis čita iz RTKQ keša svog domenskog hook-a (`useTechnologyForm(id, onClose)`). Čuva kroz
taj hook i na uspeh se zatvara. Modal ne zna za store: sva logika je u hook-u, a komponenta
samo raspoređuje polja u `FormDialog`.

```ts
const tech = useTechnologies()
<Button onClick={() => tech.add()} />          // open()
<RowActions onEdit={() => tech.edit(item)} />  // open({ id: item.id })
```

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `const [isOpen, setIsOpen] = useState(false)` za brisanje | `await confirm(...)` / `useAdminAction().remove` |
| `window.confirm(...)` | `useConfirm` (blokira pregledač i ne prati temu ni jezik) |
| `useEffect(() => { if (result) … }, [result])` | `const ok = await confirm(...)` |
| funkcija ili ceo zapis u props-ima modala | `{ id }` + čitanje iz RTKQ keša |
| modal uvezen direktno u komponentu | `OVERLAY_MODALS` + `lazy` |
| ručni Esc, fokus i zaključavanje skrola | `Overlay` |

## Checklist

- [ ] Ime u `MODALS` i `MODAL_KIND`, `lazy` red u `OVERLAY_MODALS`
- [ ] Props-i su serijalizabilni; zapis se čita iz keša po `id`
- [ ] Logika (čuvanje, brisanje) je u domenskom hook-u, ne u modalu
- [ ] Tekst kroz `t()`, ključevi u `en.ts` **i** `sr.ts`
- [ ] Nema novog `useState(false)` za dijalog
