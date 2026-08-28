import type { PrismaClient } from '@prisma/client'

/**
 * Stvarni radovi, sa `github.com/dusanpavl0vic`.
 *
 * Do sada je ovde stajalo pet IZMIŠLJENIH projekata prepisanih iz starih konstanti —
 * „Atlas Analytics" sa 40k događaja u minuti, „Forge CMS" sa 1.2k zvezdica. Portfolio sa
 * netačnim brojkama je gori od praznog: prvo pitanje na razgovoru je „pokaži", a pokazati
 * se nema šta.
 *
 * **Opisi nose ARHITEKTURU, ne spisak alata.** Tagovi ispod kartice pokrivaju stek; ono
 * što se iz njega ne vidi — kako su servisi podeljeni, čime komuniciraju, koji sloj gde
 * stoji — stoji u tekstu. To je jedino što razlikuje projekat od `package.json`-a.
 *
 * Tagovi koriste SAMO tehnologije koje već postoje u katalogu, dakle one sa logotipom.
 * `TechTile` bez logotipa pada na inicijal, pa bi MQTT, gRPC i NATS mrežu na početnoj
 * pretvorili u niz slova u kvadratićima. Te tehnologije su zato imenovane u opisu.
 */
const PROJECTS = [
  {
    slug: 'f1-race-iot-platform',
    category: 'fullStack',
    year: 2026,
    titleSr: 'F1 Race IoT Platform',
    titleEn: 'F1 Race IoT Platform',
    catSr: 'mikroservisi · IoT',
    catEn: 'microservices · IoT',
    descSr:
      'Platforma koja reprodukuje telemetriju Formule 1 i obrađuje je u realnom vremenu. Tri nezavisna servisa — reprodukcija zapisa, normalizacija događaja i stanje trke — razmenjuju poruke preko MQTT-a, a svaki je iznutra podeljen na Domain, Application i API sloj. Dashboard prati trku uživo. Ceo sistem se diže jednom `docker compose` komandom.',
    descEn:
      'A platform that replays Formula 1 telemetry and processes it in real time. Three independent services — feed replay, event normalization and race state — exchange messages over MQTT, and each is split internally into Domain, Application and API layers. A dashboard follows the race live. The whole system comes up with one `docker compose` command.',
    captionSr: 'F1 Race IoT Platform — dashboard trke',
    captionEn: 'F1 Race IoT Platform — race dashboard',
    repoUrl: 'https://github.com/dusanpavl0vic/F1RaceIoTSimulationPlatform',
    tech: ['csharp', 'dotnet', 'TypeScript', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'health-monitoring',
    category: 'fullStack',
    year: 2025,
    titleSr: 'HealthMonitoring',
    titleEn: 'HealthMonitoring',
    catSr: 'mikroservisi · IoT',
    catEn: 'microservices · IoT',
    descSr:
      'IoT sistem za praćenje zdravstvenih parametara, napisan u četiri jezika jer svaki servis rešava drugačiji problem: C# nosi upis i migracije, TypeScript obradu događaja, Python analitiku i modele, Go generator senzora. Komunikacija ide kroz gateway, MQTT i NATS, a između servisa gRPC-om preko deljenih `.proto` ugovora.',
    descEn:
      'An IoT system for health monitoring, written in four languages because each service solves a different problem: C# handles persistence and migrations, TypeScript event processing, Python analytics and models, Go the sensor generator. Traffic goes through a gateway, MQTT and NATS, and between services over gRPC with shared `.proto` contracts.',
    captionSr: 'HealthMonitoring — pregled servisa',
    captionEn: 'HealthMonitoring — service overview',
    repoUrl: 'https://github.com/dusanpavl0vic/HealthMonitoring',
    tech: ['csharp', 'TypeScript', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'booksphere',
    category: 'fullStack',
    year: 2026,
    titleSr: 'BookSphere',
    titleEn: 'BookSphere',
    catSr: 'full-stack · tri baze',
    catEn: 'full-stack · three databases',
    descSr:
      'Društvena platforma za čitaoce — preporuke knjiga, klubovi i razgovor uživo. Rađen i backend i frontend: Express sa slojevima kontrolera, servisa i repozitorijuma, React klijent na Tailwind-u, a Socket.IO nosi poruke u realnom vremenu. Tri baze iza istog `drivers` sloja — Neo4j za veze između čitalaca i naslova, MongoDB za sadržaj, Redis za keš i sesije.',
    descEn:
      'A social platform for readers — book recommendations, clubs and live conversation. Both backend and frontend: Express with layered controllers, services and repositories, a React client on Tailwind, and Socket.IO carrying real-time messages. Three databases behind one `drivers` layer — Neo4j for relationships between readers and titles, MongoDB for content, Redis for cache and sessions.',
    captionSr: 'BookSphere — pregled aplikacije',
    captionEn: 'BookSphere — application overview',
    repoUrl: 'https://github.com/Aarass/BookSphere',
    tech: ['TypeScript', 'Node.js', 'React', 'MongoDB', 'Redis'],
  },
  {
    slug: 'sporthub',
    category: 'fullStack',
    year: 2026,
    titleSr: 'SportHub',
    titleEn: 'SportHub',
    catSr: 'full-stack',
    catEn: 'full-stack',
    descSr:
      'Full-stack aplikacija za sportske sadržaje, podeljena na API i klijent u istom repou. Backend je NestJS sa Prisma ORM-om nad PostgreSQL-om, prijava ide kroz JWT i Passport.js, a klijent je Angular. Oba dela se pokreću iz jednog `docker compose` fajla.',
    descEn:
      'A full-stack sports application, split into API and client in one repository. The backend is NestJS with Prisma ORM over PostgreSQL, authentication goes through JWT and Passport.js, and the client is Angular. Both parts run from a single `docker compose` file.',
    captionSr: 'SportHub — ekrani aplikacije',
    captionEn: 'SportHub — app screens',
    repoUrl: 'https://github.com/dusanpavl0vic/SportHub',
    tech: ['TypeScript', 'PostgreSQL', 'Node.js', 'Docker'],
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
