import { useRestoreSessionQuery } from '../api/authApi'

/**
 * Pokušava da povrati sesiju iz refresh cookie-ja, jednom po učitavanju app-e.
 *
 * Vraća `isRestoring` — dok traje, NIJE poznato da li je korisnik prijavljen. To je treće
 * stanje koje `useAuth` nema: on zna samo „ima sesije" i „nema sesije", a između njih stoji
 * „još se proverava". Bez tog razlikovanja guard vidi prazan Redux i odmah preusmeri na
 * prijavu, iako važeći cookie postoji.
 *
 * Poziva se na tačno jednom mestu — `routes/SessionGate.tsx`. RTKQ deduplikuje pretplate,
 * pa bi i više poziva dalo jedan zahtev, ali jedno mesto čini redosled očiglednim.
 */
export function useSessionBootstrap() {
  const { isLoading } = useRestoreSessionQuery(undefined)

  return { isRestoring: isLoading }
}
