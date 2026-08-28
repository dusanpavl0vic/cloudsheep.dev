import { useCallback } from 'react'

import { downloadBlob } from '@/lib/download'
import type { AppError } from '@app/core'

import { useCvPdfMutation, useCvQuery, useSaveCvMutation } from '../api/teamApi'
import type { CvFormInput } from '../schemas/cv.schema'
import type { Cv, CvLang } from '../types'

/**
 * Prazan CV — modul-level konstanta, ne novi objekat po renderu.
 *
 * `values` u `useForm` poredi reference; nov objekat pri svakom renderu bi resetovao formu
 * dok korisnik kuca (docs/07 §2).
 */
export const EMPTY_CV: CvFormInput = {
  email: '',
  phone: '',
  githubUrl: '',
  linkedinUrl: '',
  websiteUrl: '',
  locationSr: '',
  locationEn: '',
  summarySr: '',
  summaryEn: '',
  educationStatusSr: '',
  educationStatusEn: '',
  gpa: '',
  educationStartYear: null,
  educationEndYear: null,
  experiences: [],
  projects: [],
  skills: [],
  languages: [],
}

/** Niz → tekst, jedan po redu. Prazan niz daje prazno polje, ne „[]". */
const toLines = (items: string[]) => items.join('\n')
const fromLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

/** Niz → tekst odvojen zarezom, i nazad. Razmaci oko zareza se gutaju. */
const toCsv = (items: string[]) => items.join(', ')
const fromCsv = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

/**
 * Serverski oblik → oblik forme.
 *
 * Jedina razlika su nizovi, koji u formi žive kao tekst. Sve ostalo prolazi netaknuto —
 * zato imena polja na obe strane MORAJU biti ista.
 */
const toFormValues = (cv: Cv): CvFormInput => ({
  email: cv.email,
  phone: cv.phone,
  githubUrl: cv.githubUrl,
  linkedinUrl: cv.linkedinUrl,
  websiteUrl: cv.websiteUrl,
  locationSr: cv.locationSr,
  locationEn: cv.locationEn,
  summarySr: cv.summarySr,
  summaryEn: cv.summaryEn,
  educationStatusSr: cv.educationStatusSr,
  educationStatusEn: cv.educationStatusEn,
  gpa: cv.gpa,
  educationStartYear: cv.educationStartYear,
  educationEndYear: cv.educationEndYear,

  experiences: cv.experiences.map((e) => ({
    ...e,
    bulletsSr: toLines(e.bulletsSr),
    bulletsEn: toLines(e.bulletsEn),
    technologies: toCsv(e.technologies),
  })),
  projects: cv.projects.map((p) => ({
    ...p,
    bulletsSr: toLines(p.bulletsSr),
    bulletsEn: toLines(p.bulletsEn),
    technologies: toCsv(p.technologies),
  })),
  skills: cv.skills,
  languages: cv.languages,
})

/** Oblik forme → telo zahteva. */
const toPayload = (values: CvFormInput) => ({
  ...values,
  experiences: values.experiences.map((e) => ({
    ...e,
    bulletsSr: fromLines(e.bulletsSr),
    bulletsEn: fromLines(e.bulletsEn),
    technologies: fromCsv(e.technologies),
  })),
  projects: values.projects.map((p) => ({
    ...p,
    bulletsSr: fromLines(p.bulletsSr),
    bulletsEn: fromLines(p.bulletsEn),
    technologies: fromCsv(p.technologies),
  })),
})

type SaveResult = { ok: true } | { ok: false; error: AppError }

/**
 * Učitavanje, čuvanje i preuzimanje CV-a.
 *
 * `save` i `download` vraćaju REZULTAT, ne bacaju — isti dogovor kao `useProjectForm` i
 * `useTechnologyMutations`. Komponenta tako bira šta da prikaže, umesto da svaki poziv
 * pakuje u `try`.
 */
export const useCv = (memberId: string) => {
  const { data, isLoading } = useCvQuery(memberId)
  // Izvučeno iz `data` PRE `useCallback`-a: React Compiler ne ume da sačuva memoizaciju kad
  // je zavisnost specifičnija (`data?.fullName`) od one koju sam zaključi (`data`).
  const fullName = data?.fullName ?? ''
  const [saveCv, { isLoading: isSaving }] = useSaveCvMutation()
  const [cvPdf, { isLoading: isDownloading }] = useCvPdfMutation()

  // memo: referencijalna stabilnost — `save` ide u `onSubmit` propse forme
  const save = useCallback(
    async (values: CvFormInput): Promise<SaveResult> => {
      try {
        await saveCv({ id: memberId, body: toPayload(values) }).unwrap()
        return { ok: true }
      } catch (error) {
        return { ok: false, error: error as AppError }
      }
    },
    [memberId, saveCv],
  )

  // memo: isti razlog — prosleđuje se dugmadima za oba jezika
  const download = useCallback(
    async (lang: CvLang): Promise<SaveResult> => {
      try {
        const blob = await cvPdf({ id: memberId, lang }).unwrap()
        /*
         * Ime datoteke se sklapa OVDE, ne čita iz `Content-Disposition`.
         *
         * `fetch` kroz RTKQ ne izlaže zaglavlja odgovora, a i da izlaže — zaglavlje je
         * latin-1, pa bi dijakritika u imenu bila izgubljena. Server šalje isto ime kad se
         * ruta otvori direktno; ovde je dovoljno da bude prepoznatljivo.
         */
        const name = (fullName || 'cv')
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-zA-Z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        downloadBlob(blob, `${name}-CV-${lang}.pdf`)
        return { ok: true }
      } catch (error) {
        return { ok: false, error: error as AppError }
      }
    },
    [cvPdf, fullName, memberId],
  )

  return {
    cv: data,
    values: data ? toFormValues(data) : EMPTY_CV,
    save,
    download,
    isLoading,
    isSaving,
    isDownloading,
  }
}
