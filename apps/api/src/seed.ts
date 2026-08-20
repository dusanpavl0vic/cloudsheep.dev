import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { seedProfile } from './seed/profile.seed.ts'
import { seedProjects } from './seed/projects.seed.ts'
import { seedTeam } from './seed/team.seed.ts'
import { seedTechnologies } from './seed/technologies.seed.ts'

/**
 * Pravi admin nalog i početni sadržaj. Pokreće se kao Coolify pre-deployment komanda.
 *
 * Stoji u `src/`, a ne u `prisma/`, da bi se kompajlirao u `dist/seed.js`. U produkcionom
 * image-u nema `tsx`-a (devDependency), pa `.ts` verzija tamo ne bi mogla da se pokrene —
 * a prvi admin nalog se pravi upravo tamo, na praznoj bazi.
 *
 * Lozinka dolazi iz env-a i **nigde se ne loguje**. `upsert` znači da je ponovno pokretanje
 * bezopasno — ali NE menja postojeću lozinku, da seed slučajno ne resetuje nalog u produkciji.
 */
const prisma = new PrismaClient()

async function main() {
  await seedAdmin()

  /*
   * Redosled je bitan: projekti vezuju tehnologije po slugu, pa tehnologije moraju
   * postojati pre njih.
   *
   * Putanja se vezuje za lokaciju modula, ne za cwd — seed se pokreće i iz `apps/api`
   * i iz korena kontejnera.
   */
  const iconDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../web/public/tech',
  )
  await seedTechnologies(prisma, iconDir)
  await seedProjects(prisma)
  await seedProfile(prisma)
  await seedTeam(
    prisma,
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../web/public/edu/elfak.webp'),
  )
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME ?? 'Admin'

  /*
   * Bez env varijabli seed TIHO IZLAZI, ne puca.
   *
   * Razlog: ovo se pokreće kao Coolify pre-deployment komanda posle svake migracije.
   * Da baca grešku, svaki deploy na okruženju bez `SEED_ADMIN_*` bi pao — a nalog treba
   * napraviti tačno jednom, na praznoj bazi.
   *
   * Napomena za lokalno testiranje ove grane: `@prisma/client` pri uvozu SAM učitava
   * `.env` iz foldera app-e, pa se lokalno vrednosti nađu i bez `--env-file`. U
   * kontejneru `.env` ne postoji i grana se stvarno izvršava.
   */
  if (!email || !password) {
    console.log('seed: SEED_ADMIN_EMAIL/PASSWORD nisu postavljeni — preskačem')
    return
  }
  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD mora imati bar 12 znakova')
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, role: 'admin', passwordHash: await bcrypt.hash(password, 12) },
  })

  console.log(`seed: admin ${user.email} spreman`)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    void prisma.$disconnect()
  })
