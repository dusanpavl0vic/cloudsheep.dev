import { z } from 'zod'

/**
 * Klijentska validacija CV-a.
 *
 * Namerno duplira `apps/api/src/schemas/cv.schema.ts`: imena polja i granice MORAJU biti
 * iste, poruke ne moraju — ovde su i18n ključevi, tamo ih niko ne čita. `docs/10` traži
 * validaciju na obe strane, a server ionako ne sme da veruje klijentu.
 */
const text = (max: number) => z.string().trim().max(max, { message: 'cv.errors.tooLong' })

const year = () =>
  z
    .number({ message: 'cv.errors.year' })
    .int()
    .min(1950, { message: 'cv.errors.year' })
    .max(new Date().getFullYear() + 1, { message: 'cv.errors.year' })

const month = () =>
  z.number().int().min(1, { message: 'cv.errors.month' }).max(12, { message: 'cv.errors.month' })

/**
 * Prazan broj iz `<input type="number">`.
 *
 * Pretvaranje „prazno → null" NE ide u šemu. `z.preprocess` (kao ni `z.coerce`) menja ULAZNI
 * tip u `unknown`, pa se `zodResolver` više ne poklapa sa `useForm<CvFormInput>` i TypeScript
 * prijavljuje dva nepovezana `Resolver` tipa. Isti razlog iz kog `project.schema.ts` ne
 * koristi `z.coerce.number()`.
 *
 * Umesto toga, pretvaranje radi `NUMBER_FIELD` na `register`-u — vidi `cv.fields.ts`.
 */
const optionalYear = () => year().nullable()
const optionalMonth = () => month().nullable()

/**
 * Buleti i tehnologije se u formi UNOSE KAO TEKST, a čuvaju kao niz.
 *
 * Buleti: jedan po redu. Tehnologije: odvojene zarezom. Alternativa je ugnežđeni
 * `useFieldArray`, koji je najkrhkiji deo RHF-a — dugme „dodaj bulet" po svakom poslu, uz
 * brisanje i redosled, za podatak koji se prirodno kuca kao lista.
 *
 * Pretvaranje u niz radi `toPayload` u `useCv`.
 */
const linesText = () => z.string().max(2000, { message: 'cv.errors.tooLong' })

export const cvExperienceSchema = z.object({
  company: z.string().trim().min(1, { message: 'cv.errors.required' }).max(120, {
    message: 'cv.errors.tooLong',
  }),
  positionSr: text(120),
  positionEn: text(120),
  locationSr: text(80),
  locationEn: text(80),
  startYear: year(),
  startMonth: optionalMonth(),
  /** Prazno = posao i dalje traje. U CV-u se ispisuje kao „danas" / „present". */
  endYear: optionalYear(),
  endMonth: optionalMonth(),
  summarySr: text(600),
  summaryEn: text(600),
  bulletsSr: linesText(),
  bulletsEn: linesText(),
  technologies: text(600),
})

export const cvProjectSchema = z.object({
  name: z.string().trim().min(1, { message: 'cv.errors.required' }).max(120, {
    message: 'cv.errors.tooLong',
  }),
  summarySr: text(600),
  summaryEn: text(600),
  bulletsSr: linesText(),
  bulletsEn: linesText(),
  technologies: text(600),
  noteSr: text(160),
  noteEn: text(160),
  year: optionalYear(),
  repoUrl: text(300),
  liveUrl: text(300),
})

export const cvSkillSchema = z.object({
  name: z.string().trim().min(1, { message: 'cv.errors.required' }).max(60, {
    message: 'cv.errors.tooLong',
  }),
  groupSr: text(60),
  groupEn: text(60),
  years: z.number().min(0).max(60, { message: 'cv.errors.years' }).nullable(),
})

export const cvLanguageSchema = z.object({
  nameSr: z.string().trim().min(1, { message: 'cv.errors.required' }).max(60),
  nameEn: z.string().trim().min(1, { message: 'cv.errors.required' }).max(60),
  levelSr: text(40),
  levelEn: text(40),
})

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
  educationStatusSr: text(120),
  educationStatusEn: text(120),
  gpa: text(20),
  educationStartYear: optionalYear(),
  educationEndYear: optionalYear(),

  experiences: z.array(cvExperienceSchema).max(20),
  projects: z.array(cvProjectSchema).max(40),
  skills: z.array(cvSkillSchema).max(60),
  languages: z.array(cvLanguageSchema).max(10),
})

export type CvFormInput = z.infer<typeof cvSchema>
export type CvExperienceInput = z.infer<typeof cvExperienceSchema>
export type CvProjectInput = z.infer<typeof cvProjectSchema>
export type CvSkillInput = z.infer<typeof cvSkillSchema>
export type CvLanguageInput = z.infer<typeof cvLanguageSchema>
