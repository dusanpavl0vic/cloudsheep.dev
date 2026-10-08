import 'server-only'

import { PrismaClient } from '@prisma/client'

/**
 * Jedan klijent po procesu.
 *
 * `globalThis` keš postoji zbog `next dev`: svaki hot reload bi inače napravio nov pool i za
 * par izmena iscrpeo konekcije na Postgres-u. Konekcija se otvara tek pri prvom upitu, pa uvoz
 * ovog modula tokom `next build` ne traži bazu.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
