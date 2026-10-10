import type { PrismaClient } from '@prisma/client'

import { BOOKING_TIME_ZONE } from '@/constants/booking'
import { daysBetween, isoWeekday, zonedTimeToUtc } from '@/helpers/date'

/**
 * Uzorci SAMO za razvoj — beleške, utisci i termini iz dizajna („sample content").
 *
 * U produkciji se nikad ne pokreću: utisci iz dizajna su izmišljeni („Client name"), a lažan
 * utisak na pravom sajtu obmanjuje posetioce. Sekcija se na sajtu sakrije dok admin ne unese
 * prave (docs/17-backend.md §7).
 */
const NOTES = [
  {
    slug: 'working-build-every-friday',
    tag: 'Process',
    titleEn: 'Why we ship a working build every Friday',
    titleSr: 'Zašto svakog petka isporučujemo radnu verziju',
    excerptEn:
      'Weekly proof beats monthly status reports. How we structure builds so clients always see progress.',
    excerptSr:
      'Nedeljni dokaz je bolji od mesečnih izveštaja. Kako organizujemo razvoj da klijent uvek vidi napredak.',
  },
  {
    slug: 'flutter-or-react-native-2026',
    tag: 'Mobile',
    titleEn: 'Flutter or React Native in 2026',
    titleSr: 'Flutter ili React Native u 2026.',
    excerptEn: 'A practical comparison from apps we have shipped and maintained.',
    excerptSr: 'Praktično poređenje na osnovu aplikacija koje smo isporučili i održavamo.',
  },
  {
    slug: 'scope-an-mvp-that-survives-launch',
    tag: 'Business',
    titleEn: 'How to scope an MVP that survives launch',
    titleSr: 'Kako definisati MVP koji preživi lansiranje',
    excerptEn: 'Three questions we ask before writing a single line of code.',
    excerptSr: 'Tri pitanja koja postavljamo pre prve linije koda.',
  },
]

const sampleBody = (title: string, excerpt: string) =>
  `${excerpt}\n\n## ${title}\n\nUzorak teksta za razvoj — prava beleška se piše u admin panelu.\n\n- prvi korak\n- drugi korak\n- treći korak\n`

export const seedSamples = async (prisma: PrismaClient) => {
  if ((await prisma.note.count()) === 0) {
    for (const [index, note] of NOTES.entries()) {
      await prisma.note.create({
        data: {
          slug: note.slug,
          titleEn: note.titleEn,
          titleSr: note.titleSr,
          excerptEn: note.excerptEn,
          excerptSr: note.excerptSr,
          bodyEn: sampleBody(note.titleEn, note.excerptEn),
          bodySr: sampleBody(note.titleSr, note.excerptSr),
          tags: [note.tag],
          isPublished: true,
          publishedAt: new Date(Date.now() - (index + 1) * 30 * 24 * 3600 * 1000),
        },
      })
    }
    console.log('seed (razvoj): beleške')
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.create({
      data: {
        quoteEn:
          'We white-label CloudSheep for our hardest builds. Quality is consistent and our clients never notice a seam.',
        quoteSr:
          'CloudSheep angažujemo pod našim brendom za najzahtevnije projekte. Kvalitet je stalan i klijenti ne primećuju razliku.',
        authorName: 'Client name',
        authorRoleEn: 'Agency partner',
        authorRoleSr: 'Partnerska agencija',
      },
    })
    console.log('seed (razvoj): utisak')
  }

  if ((await prisma.bookingSlot.count()) === 0) {
    const today = new Date().toISOString().slice(0, 10)
    const inTwoWeeks = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10)
    const starts = daysBetween(today, inTwoWeeks)
      .filter((day) => isoWeekday(day) <= 5)
      .flatMap((day) =>
        ['10:00', '13:00', '16:00'].map((time) => zonedTimeToUtc(day, time, BOOKING_TIME_ZONE)),
      )
      .filter((startsAt) => startsAt > new Date())
    await prisma.bookingSlot.createMany({
      data: starts.map((startsAt) => ({ startsAt })),
      skipDuplicates: true,
    })
    console.log(`seed (razvoj): ${String(starts.length)} termina`)
  }
}
