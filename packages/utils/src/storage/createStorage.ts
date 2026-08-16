import type { z } from 'zod'

/**
 * Tipizirani omotač nad `localStorage`.
 *
 * Postoji zbog tri stvarna problema koje sirovi `localStorage` ima:
 *  1. `getItem` vraća `string | null` — svaka upotreba traži ručni `JSON.parse` u try/catch
 *  2. Zastareo ili pokvaren unos obara app umesto da se ponaša kao „nema vrednosti"
 *  3. U Safari private modu `setItem` baca — čitanje teme ne sme da sruši stranicu
 *
 * Zod šema je ugovor: sve što joj ne odgovara tretira se kao odsutno.
 *
 * NAPOMENA: nikad za tokene. Vidi docs/20-security.md.
 */
/** Minimalni deo Storage API-ja koji nam treba — olakšava test dubl. */
export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

/** Storage iz browsera, ili `null` van njega (SSR, test bez jsdom-a). */
export const browserStorage = (): StorageLike | null =>
  typeof globalThis.localStorage === 'undefined' ? null : globalThis.localStorage

export interface TypedStorage<T> {
  get: () => T | null
  set: (value: T) => void
  remove: () => void
}

export function createStorage<T>(
  key: string,
  schema: z.ZodType<T>,
  storage: StorageLike | null,
): TypedStorage<T> {
  return {
    get() {
      if (!storage) return null
      try {
        const raw = storage.getItem(key)
        if (raw === null) return null
        const parsed = schema.safeParse(JSON.parse(raw))
        return parsed.success ? parsed.data : null
      } catch {
        // Pokvaren JSON ili nedostupan storage — ponašaj se kao da vrednosti nema
        return null
      }
    },

    set(value) {
      if (!storage) return
      try {
        storage.setItem(key, JSON.stringify(value))
      } catch {
        // Popunjena kvota ili private mod — čuvanje preference ne sme da obori app
      }
    },

    remove() {
      if (!storage) return
      try {
        storage.removeItem(key)
      } catch {
        // isto
      }
    },
  }
}
