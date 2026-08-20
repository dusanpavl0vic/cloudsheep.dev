import type { PrismaClient } from '@prisma/client'

/**
 * Pet projekata koji su do sada bili hardkodovani.
 *
 * Prepisano iz `apps/web/src/features/projects/projects.constants.ts` (struktura) i
 * `apps/web/src/features/projects/locales/{sr,en}.json` (tekst) — dva sloja koja su
 * opisivala isti sadržaj, a sada su jedan red u bazi.
 *
 * Bez ovoga bi sajt posle deploya bio prazan: baza je prazna, a konstante su obrisane.
 */
const PROJECTS = [
  {
    slug: 'atlas-analytics',
    category: 'fullStack',
    year: 2025,
    titleSr: 'Atlas Analytics',
    titleEn: 'Atlas Analytics',
    catSr: 'full-stack',
    catEn: 'full-stack',
    descSr:
      'Analitički dashboard za fintech tim — 40k događaja u minuti, upiti ispod sekunde, isporučen za 14 nedelja.',
    descEn:
      'Analytics dashboard for a fintech team — 40k events/min, sub-second queries, shipped in 14 weeks.',
    captionSr: 'Atlas Analytics — snimak dashboarda',
    captionEn: 'Atlas Analytics — dashboard screenshot',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    slug: 'nis-transit',
    category: 'frontend',
    year: 2024,
    titleSr: 'Niš Transit',
    titleEn: 'Niš Transit',
    catSr: 'frontend · mobilne',
    catEn: 'frontend · mobile',
    descSr:
      'Praćenje autobusa u realnom vremenu za grad Niš — 12k mesečnih korisnika na iOS-u i Androidu.',
    descEn: 'Real-time bus tracking for the city of Niš — 12k monthly riders on iOS and Android.',
    captionSr: 'Niš Transit — ekrani aplikacije',
    captionEn: 'Niš Transit — app screens',
    tech: ['React Native', 'Node.js', 'GTFS'],
  },
  {
    slug: 'forge-cms',
    category: 'openSource',
    year: 2024,
    titleSr: 'Forge CMS',
    titleEn: 'Forge CMS',
    catSr: 'otvoreni kod',
    catEn: 'open source',
    descSr:
      'Headless CMS zasnovan na blokovima sa drag-and-drop graditeljem stranica — 1.2k zvezdica na GitHub-u.',
    descEn: 'Block-based headless CMS with a drag-and-drop page builder — 1.2k GitHub stars.',
    captionSr: 'Forge CMS — snimak editora',
    captionEn: 'Forge CMS — editor screenshot',
    tech: ['React', 'MongoDB', 'Docker'],
  },
  {
    slug: 'pulse-api',
    category: 'backend',
    year: 2023,
    titleSr: 'Pulse API',
    titleEn: 'Pulse API',
    catSr: 'backend',
    catEn: 'backend',
    descSr: 'API za prikupljanje zdravstvenih metrika — 99.98% uptime kroz dve godine produkcije.',
    descEn: 'Health-metrics ingestion API — 99.98% uptime across two years of production traffic.',
    captionSr: 'Pulse API — dokumentacija / dashboard',
    captionEn: 'Pulse API — docs / dashboard',
    tech: ['Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'meridian',
    category: 'fullStack',
    year: 2023,
    titleSr: 'Meridian',
    titleEn: 'Meridian',
    catSr: 'full-stack',
    catEn: 'full-stack',
    descSr:
      'Platforma za rezervacije za berlinski studio — sinhronizacija kalendara, plaćanja, višejezični UI.',
    descEn: 'Booking platform for a Berlin studio — calendar sync, payments, multilingual UI.',
    captionSr: 'Meridian — tok rezervacije',
    captionEn: 'Meridian — booking flow',
    tech: ['Next.js', 'Stripe', 'PostgreSQL'],
  },
] as const

/**
 * Ista normalizacija koju je koristio `techIconFor` na frontendu i migracija u bazi:
 * `Node.js` → `nodejs`. Tako se naziv poklapa i sa slugom tehnologije i sa imenom
 * postojećeg SVG fajla.
 */
const toSlug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]/g, '')

/**
 * `upsert` po slugu, kao i kod admin naloga: ponovno pokretanje je bezopasno.
 *
 * `update` je namerno prazan — seed ne sme da pregazi izmene napravljene u admin panelu.
 * Ovo je početni sadržaj, ne izvor istine.
 *
 * Pokreće se POSLE `seedTechnologies`, jer vezuje već postojeće tehnologije po slugu.
 */
export async function seedProjects(prisma: PrismaClient): Promise<void> {
  for (const [index, { tech, ...fields }] of PROJECTS.entries()) {
    const technologies = await prisma.technology.findMany({
      where: { slug: { in: tech.map(toSlug) } },
    })

    const existing = await prisma.project.findUnique({ where: { slug: fields.slug } })
    if (existing) continue

    await prisma.project.create({
      data: {
        ...fields,
        sortOrder: index,
        // Prva tri su bila `PROJECTS.slice(0, 3)` na landing strani.
        isFeatured: index < 3,
        isPublished: true,
        technologies: {
          create: tech
            .map((label, order) => ({
              technologyId: technologies.find((t) => t.slug === toSlug(label))?.id,
              sortOrder: order,
            }))
            // Tehnologija bez logotipa u repou ne postoji u bazi — projekat je dobija
            // kad je ručno dodaš u adminu, umesto da seed pukne.
            .filter((link): link is { technologyId: string; sortOrder: number } =>
              Boolean(link.technologyId),
            ),
        },
      },
    })
  }

  console.log(`seed: ${String(PROJECTS.length)} projekata spremno`)
}
