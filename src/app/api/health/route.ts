import { json } from '@/server/http'

/**
 * Liveness — „proces je živ". Namerno NE dodiruje bazu: da pada sa Postgres-om, orkestrator bi
 * restartovao aplikaciju zbog tuđeg kvara, u petlji.
 */
export const GET = () => json({ status: 'ok' })
