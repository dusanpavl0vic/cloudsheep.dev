# 06 — Modali i dijalozi

> Status: active | Last review: 2026-08-15
> ⚠ Izbor engine-a (sopstveni vs `@ebay/nice-modal-react`) se finalizuje u F4 —
> [`adr/0006-modal-engine.md`](adr/0006-modal-engine.md). Dole je opisan sopstveni engine.

**Svi dijalozi se otvaraju preko Redux-a, ne preko lokalnog `isOpen` state-a.**

## Pravila

1. **`useState(false)` za dijalog koji nosi domensku akciju je zabranjen.**
   Dozvoljen je samo za prezentacione popovere, tooltipove i dropdown-ove.
2. **Stack, ne jedan modal** — mora da radi confirm preko otvorene forme.
3. **Rezultat se dobija kroz `await`**, ne kroz `useEffect` koji sluša state.
4. **Modal komponenta je lazy** — nikad u initial bundle-u.
5. **Radix `Dialog` je mehanika** — focus trap, `aria-modal`, ESC, scroll lock. Ne pisati ručno.
6. **`ModalRoot` se renderuje jednom**, u `providers/`, ispod router-a.

## Dizajn

```
packages/core/src/modals/
├── modal.slice.ts      # stack — samo serializable podaci
├── modal.types.ts      # ModalId union, ModalPropsMap
├── resolvers.ts        # Map<key, resolve> — funkcije žive VAN Redux-a
├── useModal.ts         # javni hook API
└── ModalRoot.tsx       # jedini renderer
```

### `modal.types.ts`

```ts
export interface ModalPropsMap {}                      // app proširuje kroz declare module
export type ModalId = keyof ModalPropsMap;

export type ModalEntry<K extends ModalId = ModalId> = {
  key: string;
  id: K;
  props: ModalPropsMap[K];
  meta?: { dismissible?: boolean; size?: 'sm' | 'md' | 'lg' | 'full' };
};

export type ModalState = { stack: ModalEntry[] };
```

### `modal.slice.ts`

```ts
const initialState: ModalState = { stack: [] };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    modalOpened: {
      reducer(state, action: PayloadAction<ModalEntry>) {
        state.stack.push(action.payload);
      },
      prepare(id: ModalId, props: unknown, meta?: ModalEntry['meta']) {
        return { payload: { key: nanoid(), id, props, meta } as ModalEntry };
      },
    },
    modalClosed(state, action: PayloadAction<string>) {
      state.stack = state.stack.filter((m) => m.key !== action.payload);
    },
    allModalsClosed(state) {
      state.stack = [];
    },
  },
});
```

### `resolvers.ts` — zašto postoji

Funkcije nisu serializable, pa `resolve` ne sme u Redux. Živi u `Map` van store-a;
slice drži samo podatke.

```ts
const resolvers = new Map<string, (value: unknown) => void>();

export const registerResolver = (key: string, resolve: (value: unknown) => void) =>
  resolvers.set(key, resolve);

export function settleResolver(key: string, value: unknown) {
  resolvers.get(key)?.(value);
  resolvers.delete(key);
}
```

### `useModal.ts` — javni API

```ts
export function useModal() {
  const dispatch = useAppDispatch();
  const stack = useAppSelector(selectModalStack);

  const open = useCallback(
    <K extends ModalId, R = unknown>(id: K, props: ModalPropsMap[K], meta?: ModalEntry['meta']) => {
      const action = modalOpened(id, props, meta);
      dispatch(action);
      return new Promise<R | undefined>((resolve) => {
        registerResolver(action.payload.key, resolve as (v: unknown) => void);
      });
    },
    [dispatch],
  );

  const close = useCallback(
    (key: string, result?: unknown) => {
      settleResolver(key, result);
      dispatch(modalClosed(key));
    },
    [dispatch],
  );

  const closeAll = useCallback(() => {
    stack.forEach((m) => settleResolver(m.key, undefined));
    dispatch(allModalsClosed());
  }, [dispatch, stack]);

  return { open, close, closeAll, isOpen: (id: ModalId) => stack.some((m) => m.id === id) };
}
```

### Registry (per-app, type-safe)

```tsx
// apps/admin/src/providers/modalRegistry.ts
export const modalRegistry = {
  'confirm-delete': lazy(() => import('@/features/projects/modals/ConfirmDelete')),
  'auth.login':     lazy(() => import('@/features/auth/modals/LoginModal')),
} satisfies Record<ModalId, LazyExoticComponent<ComponentType<never>>>;

declare module '@app/core' {
  interface ModalPropsMap {
    'confirm-delete': { entityId: string; entityName: string };
    'auth.login': { redirectTo?: string };
  }
}
```

Dodavanje modala = jedan red u registry + jedan red u `ModalPropsMap`. TypeScript odmah
traži oba — nemoguće je registrovati modal bez tipa propsa.

### `ModalRoot.tsx`

```tsx
export function ModalRoot({ registry }: { registry: Record<ModalId, LazyExoticComponent<never>> }) {
  const stack = useAppSelector(selectModalStack);
  const { close, closeAll } = useModal();
  const { pathname } = useLocation();

  // effect: router — modali se ne smeju preneti preko navigacije
  useEffect(() => { closeAll(); }, [pathname]);

  return stack.map((entry) => {
    const Component = registry[entry.id];
    return (
      <Dialog key={entry.key} open onOpenChange={(o) => !o && close(entry.key)}>
        <Suspense fallback={<ModalSkeleton size={entry.meta?.size} />}>
          <Component {...entry.props} onClose={(r: unknown) => close(entry.key, r)} />
        </Suspense>
      </Dialog>
    );
  });
}
```

Ovo je **jedini dokumentovan `useEffect`** u modal sistemu.

## Upotreba

```ts
const { open } = useModal();

const confirmed = await open<'confirm-delete', boolean>('confirm-delete', {
  entityId: project.id,
  entityName: project.name,
});

if (confirmed) await deleteProject(project.id);
```

Jedan `await` zamenjuje: `useState(false)` + `useState(pendingId)` + `useEffect` koji sluša
rezultat + callback prop kroz tri nivoa.

## Varijante

Drawer, Sheet i AlertDialog su **isti sistem** sa drugom Radix primitivom u `ModalRoot`-u —
ne paralelni engine. `meta.size` kontroliše širinu, `meta.dismissible: false` blokira ESC i
klik van za destruktivne potvrde.

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `const [isOpen, setIsOpen] = useState(false)` za brisanje entiteta | `await open('confirm-delete', …)` |
| `useEffect(() => { if (result) doThing() }, [result])` | `const result = await open(...)` |
| `<ConfirmDialog>` importovan direktno u komponentu | registry + lazy |
| modal koji sam zove `dispatch(deleteProject())` | modal vraća rezultat, pozivalac odlučuje |
| ručni `onKeyDown` za ESC, ručni focus trap | Radix `Dialog` |
| dva `ModalRoot`-a | tačno jedan, u `providers/` |

## Checklist

- [ ] Modal je u `features/<x>/modals/`, lazy, bez `default export`-a osim za `lazy()`
- [ ] Upisan u `modalRegistry` **i** u `ModalPropsMap`
- [ ] Ne dispatch-uje domensku akciju — vraća rezultat kroz `onClose`
- [ ] i18n ključevi `<feature>.modals.<name>.*` u `sr.json` i `en.json`
- [ ] Test: open → prikazan, confirm → promise resolve `true`, ESC → `undefined`
- [ ] Destruktivna akcija ima `meta.dismissible: false`
- [ ] Nema novog `useState(false)` za dijalog
