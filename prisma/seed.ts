import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import path from 'node:path'

import { seedProfile } from './seed/profile'
import { seedProjects } from './seed/projects'
import { seedSamples } from './seed/samples'
import { seedTeam } from './seed/team'
import { seedTechnologies } from './seed/technologies'

/**
 * Admin nalog i početni sadržaj. U produkciji ga pokreće Coolify pre-deployment komanda
 * (`node seed.mjs`, bundle iz Dockerfile-a — runtime image nema `tsx`).
 *
 * Lozinka dolazi iz env-a i NIGDE se ne loguje. `upsert` čini ponovno pokretanje bezopasnim,
 * ali NE menja postojeću lozinku — seed ne sme da resetuje nalog u produkciji.
 *
 * Pokretanje: `pnpm db:seed` (tsx sa `--conditions=react-server`, jer serverski moduli nose
 * `server-only` zaštitu).
 */
const prisma = new PrismaClient()

const seedAdmin = async () => {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME ?? 'Admin'

  // Bez env-a TIHO izlazi: seed ide posle svake migracije, a nalog se pravi tačno jednom.
  if (!email || !password) {
    console.log('seed: SEED_ADMIN_EMAIL/PASSWORD nisu postavljeni — preskačem nalog')
    return
  }
  if (password.length < 12) throw new Error('SEED_ADMIN_PASSWORD mora imati bar 12 znakova')

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, role: 'admin', passwordHash: await bcrypt.hash(password, 12) },
  })
  console.log(`seed: admin ${user.email} spreman`)
}

const main = async () => {
  await seedAdmin()

  // Redosled je bitan: projekti vezuju tehnologije po slugu.
  const root = process.cwd()
  await seedTechnologies(prisma, path.join(root, 'public/tech'))
  await seedProjects(prisma)
  await seedProfile(prisma)
  await seedTeam(prisma, path.join(root, 'public/edu/elfak.webp'))

  if (process.env.NODE_ENV !== 'production') await seedSamples(prisma)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    void prisma.$disconnect()
  })
