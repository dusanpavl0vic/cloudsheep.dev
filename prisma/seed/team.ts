import type { PrismaClient } from '@prisma/client'
import { readFile } from 'node:fs/promises'

import { storeUpload } from '@/server/uploads/storage'

/**
 * Prvi član tima, iz podataka koji su do sada bili hardkodovani.
 *
 * Sekcija „Studio" je čitala `studio.credential.*` iz i18n fajlova i `/edu/elfak.webp` iz
 * `public/`. Oboje se ovde prenosi u bazu — bez toga bi ta sekcija posle deploya bila prazna.
 */
const MEMBER = {
  fullName: 'Dušan Pavlović',
  roleSr: 'Dizajn i razvoj',
  roleEn: 'Design and development',
  hasDiploma: true,
  universitySr: 'Univerzitet u Nišu',
  universityEn: 'University of Niš',
  degreeSr: 'Diplomirani inženjer elektrotehnike i računarstva',
  degreeEn: 'Graduate Engineer of Electrical and Computer Engineering',
  programmeSr: 'Računarstvo i informatika',
  programmeEn: 'Computer Science and Engineering',
  facultySr: 'Elektronski fakultet',
  facultyEn: 'Faculty of Electronic Engineering',
  city: 'Niš, Srbija',
}

export const seedTeam = async (prisma: PrismaClient, sealPath: string): Promise<void> => {
  const existing = await prisma.teamMember.count()
  // Postojeći tim se NE dira — seed je početni sadržaj, ne izvor istine
  if (existing > 0) {
    console.log('seed: tim već postoji — preskačem')
    return
  }

  let sealId: string | null = null
  try {
    const buffer = await readFile(sealPath)
    const stored = await storeUpload({ buffer, name: 'elfak.webp' })
    const asset = await prisma.asset.create({ data: stored })
    sealId = asset.id
  } catch {
    // Bez pečata član i dalje ima diplomu; kartica se prikazuje, samo bez grba
    console.warn('seed: grb fakulteta nije nađen — član ide bez pečata')
  }

  await prisma.teamMember.create({ data: { ...MEMBER, sealId, sortOrder: 0 } })

  console.log('seed: tim spreman')
}
