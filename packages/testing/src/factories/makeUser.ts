/**
 * Factory funkcije za test podatke.
 *
 * Zašto ne JSON fixture: `makeUser({ role: 'admin' })` se čita u jednom redu i kaže
 * **šta je u ovom testu bitno**. JSON blob od 40 linija ne kaže ništa, a menja se
 * svaki put kad se tip promeni (docs/12-testing.md).
 */

export interface TestUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'member' | 'viewer'
  createdAt: string
}

let sequence = 0

/** Resetuje brojač — pozvati u `beforeEach` kad test zavisi od konkretnih id-jeva. */
export function resetFactorySequence(): void {
  sequence = 0
}

export function makeUser(overrides: Partial<TestUser> = {}): TestUser {
  sequence += 1
  return {
    id: `usr_${String(sequence)}`,
    email: `korisnik${String(sequence)}@cloudsheep.dev`,
    name: `Test Korisnik ${String(sequence)}`,
    role: 'member',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

export function makeUsers(count: number, overrides: Partial<TestUser> = {}): TestUser[] {
  return Array.from({ length: count }, () => makeUser(overrides))
}
