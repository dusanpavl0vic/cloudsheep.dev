import { PrismaClient } from '@prisma/client'

/**
 * Jedan klijent po procesu.
 *
 * `globalThis` keš postoji zbog `tsx watch` u razvoju: svaki reload bi inače napravio nov
 * pool i za par izmena iscrpeo konekcije na Postgres-u.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
