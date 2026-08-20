import { Router } from 'express'

import { prisma } from '../db.ts'

export const healthRouter: Router = Router()

/**
 * Liveness — „proces je živ".
 *
 * **Namerno ne dodiruje bazu.** Ovo gleda Docker HEALTHCHECK i Coolify: da pada kad padne
 * Postgres, orkestrator bi restartovao API zbog tuđeg kvara, i to u petlji.
 */
healthRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

/** Readiness — „mogu da primam saobraćaj", što uključuje i bazu. */
healthRouter.get('/health/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', database: 'up' })
  } catch {
    res.status(503).json({ status: 'degraded', database: 'down' })
  }
})
