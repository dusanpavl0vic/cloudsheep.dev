import type { PrismaClient } from '@prisma/client'

/**
 * Početni profil i kontakt linkovi.
 *
 * Ovo je jedini izvor početnih vrednosti. Ranije su stajale i u
 * `apps/web/src/lib/navigation.ts` (`CONTACT_EMAIL`, `SOCIAL_LINKS`), ali su te konstante
 * obrisane — ostale su bez ijednog korisnika i držale su zastarele adrese, pa su bile zamka
 * za sledeću izmenu. Bez ovog seed-a bi podnožje posle deploya ostalo bez ijednog linka.
 */
const PROFILE = {
  fullName: 'Dušan Pavlović',
  location: 'Niš, Srbija · CET',
  isAvailable: true,
  headlineSr: 'Jednočlani produktni studio',
  headlineEn: 'A one-person product studio',
  bioSr: 'Dizajn, web i mobilne aplikacije iz jednog para ruku.',
  bioEn: 'Design, web and mobile apps from a single pair of hands.',
  universitySr: 'Univerzitet u Nišu',
  universityEn: 'University of Niš',
  degreeSr: 'Elektrotehnički fakultet',
  degreeEn: 'Faculty of Electronic Engineering',
}

const LINKS = [
  { platform: 'github', url: 'https://github.com/dusanpavl0vic', label: 'GitHub' },
  {
    platform: 'linkedin',
    url: 'https://www.linkedin.com/in/dusan-pavlovic-41b905194',
    label: 'LinkedIn',
  },
  { platform: 'email', url: 'mailto:cloudsheep.dev016@gmail.com', label: 'E-mail' },
]

export async function seedProfile(prisma: PrismaClient): Promise<void> {
  // `update: {}` — seed ne pregazi izmene iz admin panela
  await prisma.profile.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton', ...PROFILE },
  })

  const existing = await prisma.socialLink.count()
  if (existing === 0) {
    await prisma.socialLink.createMany({
      data: LINKS.map((link, index) => ({ ...link, sortOrder: index })),
    })
  }

  console.log('seed: profil i kontakt linkovi spremni')
}
