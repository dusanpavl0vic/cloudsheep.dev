import { HTTP_STATUS } from '@/constants/http'
import { prisma } from '@/server/db'
import { json } from '@/server/http'

/** Readiness — „mogu da primam saobraćaj", što uključuje bazu. */
export const GET = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return json({ status: 'ok', database: 'up' })
  } catch {
    return json({ status: 'degraded', database: 'down' }, HTTP_STATUS.SERVICE_UNAVAILABLE)
  }
}
