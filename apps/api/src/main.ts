import { createApp } from './app.ts'
import { prisma } from './db.ts'
import { env } from './env.ts'

const app = createApp()

/**
 * `0.0.0.0`, ne `localhost`.
 *
 * U kontejneru `localhost` znači „samo unutar ovog kontejnera", pa bi servis bio nevidljiv
 * i Docker-u i Traefiku — port bi bio mapiran, a veza odbijena.
 */
const server = app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`api sluša na :${String(env.PORT)} (${env.NODE_ENV})`)
})

/**
 * Docker pri zaustavljanju šalje `SIGTERM` pa čeka 10 s do `SIGKILL`.
 *
 * Bez ovoga se zahtevi u letu prekidaju usred obrade, a Postgres konekcije ostaju otvorene
 * dok ih server sam ne odbaci. Redosled je bitan: prvo prestani da primaš, pa zatvori bazu.
 */
const shutdown = (signal: string) => {
  console.log(`${signal} — gasim se`)

  server.close(() => {
    void prisma.$disconnect().finally(() => {
      process.exit(0)
    })
  })

  // Osigurač: ako se neka veza ne zatvori, ne visi zauvek
  setTimeout(() => {
    console.error('gašenje predugo traje — izlazim na silu')
    process.exit(1)
  }, 10_000).unref()
}

process.on('SIGTERM', () => {
  shutdown('SIGTERM')
})
process.on('SIGINT', () => {
  shutdown('SIGINT')
})
