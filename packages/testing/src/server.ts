import type { RequestHandler } from 'msw'
import { setupServer } from 'msw/node'

/**
 * MSW server za integracione testove.
 *
 * Presreće se na **mrežnom nivou**, ne mokovanjem RTK Query modula — tako test prolazi
 * kroz pravi baseQuery, prave tagove i pravu normalizaciju grešaka (docs/12-testing.md).
 *
 * `onUnhandledRequest: 'error'` je namerno strogo: nepokriven zahtev je rupa u testu,
 * ne šum koji treba ignorisati.
 */
export function createTestServer(handlers: RequestHandler[] = []) {
  const server = setupServer(...handlers)

  return {
    server,
    /** Pozvati u setup fajlu paketa koji testira. */
    listen: () => { server.listen({ onUnhandledRequest: 'error' }) },
    reset: () => { server.resetHandlers() },
    close: () => { server.close() },
  }
}
