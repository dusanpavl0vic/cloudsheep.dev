import type { PrismaClient } from '@prisma/client'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { storeUpload } from '../lib/uploads.ts'

/**
 * Prenosi postojeće logotipe iz `apps/web/public/tech/*.svg` u bazu.
 *
 * Do sada su logotipi bili fajlovi u repou, a spisak tehnologija niz u kodu; skripta
 * `check-tech-icons.mjs` je proveravala da se to dvoje poklapa. Otkad su tehnologije
 * zapisi, logotip je otpremljena datoteka kao i svaka druga — a ovih šesnaest treba
 * preneti jednom, da migrirani projekti ne ostanu bez ikonica.
 *
 * Ime fajla je slug (`nodejs.svg` → `nodejs`), što je tačno ono što je migracija upisala
 * u `Technology.slug`. Zato se poklapanje traži po slugu, ne po nazivu.
 */

/** Grupe su preslikane iz starog `lib/tech.ts`; nove tehnologije dobijaju `tooling`. */
const GROUPS: Record<string, string> = {
  react: 'frontend',
  nextjs: 'frontend',
  typescript: 'frontend',
  javascript: 'frontend',
  reactnative: 'mobile',
  nodejs: 'backend',
  postgresql: 'backend',
  mongodb: 'backend',
  redis: 'backend',
  graphql: 'backend',
  csharp: 'backend',
  dotnet: 'backend',
  docker: 'tooling',
  github: 'tooling',
  chrome: 'tooling',
  figma: 'design',
}

export async function seedTechnologies(prisma: PrismaClient, iconDir: string): Promise<void> {
  let files: string[]
  try {
    files = (await readdir(iconDir)).filter((f) => f.endsWith('.svg'))
  } catch {
    console.log('seed: nema foldera sa logotipima — preskačem')
    return
  }

  let imported = 0

  for (const file of files) {
    const slug = file.replace(/\.svg$/, '')

    const existing = await prisma.technology.findUnique({ where: { slug } })
    // Postojeća tehnologija sa logotipom se NE dira — seed ne pregazi izmene iz admina
    if (existing?.logoId) continue

    const buffer = await readFile(path.join(iconDir, file))
    const stored = await storeUpload({ buffer, originalname: file, size: buffer.byteLength })
    const asset = await prisma.asset.create({ data: stored })

    await prisma.technology.upsert({
      where: { slug },
      update: { logoId: asset.id },
      create: {
        slug,
        // Bez unosa u `Technology` (npr. `redis`, koji nijedan projekat ne koristi)
        // naziv se izvodi iz sluga — ispravlja se u adminu.
        label: slug,
        group: GROUPS[slug] ?? 'tooling',
        logoId: asset.id,
      },
    })

    imported += 1
  }

  console.log(`seed: ${String(imported)} logotipa tehnologija preneto`)
}
