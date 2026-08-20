import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'
import pinoHttp from 'pino-http'

import { env, isProd, isTest } from './env.ts'
import { errorHandler, notFound } from './middleware/error.ts'
import { authRouter } from './routes/auth.ts'
import { contactRouter } from './routes/contact.ts'
import { healthRouter } from './routes/health.ts'
import { profileRouter } from './routes/profile.ts'
import { projectsRouter } from './routes/projects.ts'
import { teamRouter } from './routes/team.ts'
import { technologiesRouter } from './routes/technologies.ts'
import { uploadsRouter } from './routes/uploads.ts'

/**
 * Express aplikacija, odvojena od pokretanja servera.
 *
 * Razlog je testabilnost: `supertest` uzima ovaj objekat i ne otvara pravi port, pa testovi
 * mogu da rade paralelno bez sudara. `main.ts` je jedini koji zove `listen`.
 */
export function createApp(): Express {
  const app = express()

  /*
   * Iza Traefika smo. Bez ovoga `req.ip` je adresa proxy-ja, pa rate limit broji sve
   * korisnike kao jednog, a `secure` cookie se ne postavlja jer Express misli da je veza
   * običan http.
   *
   * Vrednost je `1`, ne `true`: „veruj tačno jednom proxy-ju ispred sebe". `true` veruje
   * `X-Forwarded-For` zaglavlju u celosti, pa ga klijent može falsifikovati i zaobići limit.
   */
  app.set('trust proxy', 1)

  // `silent` u testovima: supertest bi inače ispisao ceo JSON zapis po zahtevu i zatrpao
  // izlaz vitest-a do neupotrebljivosti.
  app.use(pinoHttp({ level: isTest ? 'silent' : isProd ? 'info' : 'debug' }))
  app.use(helmet())
  app.use(compression())

  /*
   * CORS je allowlist iz env-a, bez zvezdice.
   *
   * `credentials: true` uz `origin: '*'` pretraživač ionako odbija, pa je nabrajanje jedini
   * put. Zahtev bez `Origin` (curl, health check, server-to-server) se propušta — CORS je
   * zaštita pretraživača, ne autorizacija.
   */
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.CORS_ORIGINS.includes(origin)) callback(null, true)
        else callback(new Error('CORS: nedozvoljen origin'))
      },
      credentials: true,
    }),
  )

  app.use(express.json({ limit: '100kb' }))
  app.use(cookieParser())

  app.use(healthRouter)
  app.use(authRouter)
  app.use(projectsRouter)
  app.use(profileRouter)
  app.use(technologiesRouter)
  app.use(teamRouter)
  app.use(contactRouter)
  app.use(uploadsRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
