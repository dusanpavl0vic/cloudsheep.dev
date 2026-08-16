/**
 * Registar `resolve` funkcija otvorenih modala.
 *
 * Zašto van Redux-a: funkcije nisu serializable, a `serializableCheck` bi ih s pravom
 * prijavio. Slice drži samo podatke; ovde žive callback-ovi (docs/06-modals.md).
 *
 * Ovo je najsuptilniji deo engine-a — ADR 0006 ga navodi kao glavnu cenu sopstvenog
 * rešenja. Ako se `settle` propusti, `await open(...)` visi zauvek i curi memorija.
 * Zato `closeAll` prolazi kroz ceo stack umesto da samo isprazni niz.
 */
type Resolver = (value: unknown) => void

const resolvers = new Map<string, Resolver>()

export function registerResolver(key: string, resolve: Resolver): void {
  resolvers.set(key, resolve)
}

/** Razrešava i uklanja; poziv za nepoznat ključ je bezopasan (modal zatvoren dvaput). */
export function settleResolver(key: string, value: unknown): void {
  const resolve = resolvers.get(key)
  resolvers.delete(key)
  resolve?.(value)
}

/** Broj nerazrešenih — samo za testove i dijagnostiku curenja. */
export function pendingResolverCount(): number {
  return resolvers.size
}

/** Čisti sve bez razrešavanja — samo za testove. */
export function resetResolvers(): void {
  resolvers.clear()
}
