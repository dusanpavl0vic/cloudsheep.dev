import { z } from 'zod'

/**
 * Validacija CV podataka člana tima.
 *
 * Isti dogovor kao u `team.schema.ts`: prazan string je podrazumevana vrednost, ne greška.
 * CV se popunjava u više navrata, pa server ne sme da traži sve odjednom.
 *
 * Ograničenja moraju da se poklope sa klijentskim (`apps/admin/src/features/team/schemas/
 * cv.schema.ts`) — `docs/10` traži isto pravilo na obe strane, a poruke se razlikuju: ovde
 * ih niko ne čita, tamo su i18n ključevi.
 */
const text = (max: number) => z.string().trim().max(max).default('')

/**
 * Godina se ne pušta kao bilo koji `Int`.
 *
 * Donja granica je 1950 (niko u timu nije počeo da radi ranije), gornja je „sledeća godina"
 * zbog planiranog kraja studija. Bez granica `Int` prima i 12, i 20250 — a to su tipfleri
 * koji u PDF-u izgledaju kao greška u podacima, ne kao greška u unosu.
 */
const year = () =>
  z
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear() + 1)

const month = () => z.number().int().min(1).max(12)

/** Buleti i tehnologije: kratke stavke, ograničen broj. Duga proza ide u `summary`. */
const bullets = () => z.array(z.string().trim().min(1).max(300)).max(12).default([])
const technologies = () => z.array(z.string().trim().min(1).max(40)).max(24).default([])

export const cvExperienceSchema = z.object({
  company: z.string().trim().min(1).max(120),
  positionSr: text(120),
  positionEn: text(120),
  locationSr: text(80),
  locationEn: text(80),

  startYear: year(),
  startMonth: month().nullable().default(null),
  /** `null` znači „i dalje traje" — u PDF-u se ispisuje kao „danas" / „present". */
  endYear: year().nullable().default(null),
  endMonth: month().nullable().default(null),

  summarySr: text(600),
  summaryEn: text(600),
  bulletsSr: bullets(),
  bulletsEn: bullets(),
  technologies: technologies(),
})

export const cvLanguageSchema = z.object({
  nameSr: z.string().trim().min(1).max(60),
  nameEn: z.string().trim().min(1).max(60),
  levelSr: text(40),
  levelEn: text(40),
})

/** Projekat sa sajta uvršten u CV: samo veza i napomena, nikad kopija sadržaja. */
export const cvSiteProjectSchema = z.object({
  projectId: z.uuid(),
  noteSr: text(160),
  noteEn: text(160),
})

/**
 * Ceo CV u jednom telu.
 *
 * Kolekcije se šalju u celini i u celini se zamenjuju — nema id-jeva po stavci i nema
 * zasebnih ruta po redu. Isti obrazac koji `projects.ts` već koristi za tehnologije
 * projekta (`deleteMany` + `createMany` u transakciji), i razlog je isti: redosled je deo
 * podatka, pa je zamena celine jednostavnija i tačnija od šesnaest ruta koje ga održavaju.
 *
 * Gornje granice postoje da jedan zahtev ne može da unese hiljadu redova.
 */
export const cvSchema = z.object({
  email: text(120),
  phone: text(40),
  githubUrl: text(300),
  linkedinUrl: text(300),
  websiteUrl: text(300),
  locationSr: text(80),
  locationEn: text(80),
  summarySr: text(900),
  summaryEn: text(900),
  /* Polja diplome — ista kolona koju piše i `teamMemberSchema`, drugi ulaz. */
  hasDiploma: z.boolean().default(false),
  universitySr: text(120),
  universityEn: text(120),
  degreeSr: text(160),
  degreeEn: text(160),
  programmeSr: text(160),
  programmeEn: text(160),
  facultySr: text(120),
  facultyEn: text(120),
  city: text(80),

  educationStatusSr: text(120),
  educationStatusEn: text(120),
  gpa: text(20),
  educationStartYear: year().nullable().default(null),
  educationEndYear: year().nullable().default(null),

  siteProjects: z.array(cvSiteProjectSchema).max(40).default([]),
  experiences: z.array(cvExperienceSchema).max(20).default([]),
  languages: z.array(cvLanguageSchema).max(10).default([]),
})

export type CvInput = z.infer<typeof cvSchema>
