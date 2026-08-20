import { Prisma } from '@prisma/client'

import { HttpError } from '../middleware/error.ts'

/**
 * Prevodi Prisma greške u `HttpError`.
 *
 * Bez ovoga svaka greška baze pada u generički `500 errors.unexpected`: pokušaj upisa
 * postojećeg sluga izgleda korisniku kao pad servera, a ne kao „taj slug je zauzet".
 *
 * Prevode se samo one koje ZAISTA znače nešto klijentu. Sve ostalo se namerno propušta
 * dalje — greška u upitu ili u vezi sa bazom jeste 500 i treba da se vidi u logu.
 */
export function toHttpError(error: unknown): unknown {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return error

  switch (error.code) {
    /**
     * Prekršen unique constraint. `meta.target` nosi imena kolona; uzima se prva, jer
     * složeni unique nad dve kolone i dalje pokazuje na jednu formu.
     */
    case 'P2002': {
      const target = error.meta?.target
      const field = Array.isArray(target) ? String(target[0]) : undefined

      return new HttpError(409, 'errors.conflict', field ? { field } : undefined)
    }

    /** Zapis za izmenu ili brisanje ne postoji. */
    case 'P2025':
      return new HttpError(404, 'errors.notFound')

    /** Strani ključ pokazuje na nepostojeći red — klijent je poslao tuđi ili stari id. */
    case 'P2003':
      return new HttpError(400, 'errors.badRequest')

    default:
      return error
  }
}

/**
 * Omotač za async handlere koji diraju bazu.
 *
 * Express 5 prosleđuje odbijeno obećanje `errorHandler`-u sam, ali prosleđuje SIROVU Prisma
 * grešku. Ovaj omotač je presreće između, pa `errorHandler` dobija već preveden `HttpError`.
 */
export async function withPrismaErrors<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (error) {
    throw toHttpError(error)
  }
}
