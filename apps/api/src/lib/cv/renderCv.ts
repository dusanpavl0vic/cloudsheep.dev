import { createRequire } from 'node:module'
import path from 'node:path'
import PDFDocument from 'pdfkit'

import { label, type CvLang } from './labels.ts'
import { BULLET, COLOR, FONT, GAP, GUTTER, LABEL_WIDTH, PAGE, SIZE } from './layout.ts'
import type { CvDoc } from './localize.ts'

/**
 * Putanja do fontova, razrešena u odnosu na OVAJ modul, ne na radni direktorijum.
 *
 * `process.cwd()` bi radio lokalno (`pnpm dev` se pokreće iz `apps/api`) i pukao u
 * kontejneru, gde je radni direktorijum `/app`, a build izlaz `/app/dist`. Razrešavanje od
 * modula daje istu putanju u oba slučaja.
 *
 * `assets/` mora biti u `files` polju `package.json`-a, inače ga `pnpm deploy` izostavi iz
 * runtime image-a i PDF se ruši tek na serveru.
 */
const require_ = createRequire(import.meta.url)
const FONT_DIR = path.resolve(
  path.dirname(require_.resolve('../../../package.json')),
  'assets/fonts',
)

/**
 * CV kao PDF.
 *
 * Raspored je dvokolonski: naslov sekcije levo, sadržaj desno, tanka linija iznad svake
 * sekcije. Isti skelet koji nosi svaki čitljiv CV — oko koji skenira četrdeset dokumenata
 * traži naslove uvek na istom mestu.
 *
 * **Prazne sekcije se ne crtaju.** CV bez radnog iskustva ne sme da ostavi naslov iznad
 * praznine; to izgleda kao da se nešto nije učitalo.
 */
export const renderCv = (cv: CvDoc, lang: CvLang): Promise<Buffer> => {
  const doc = new PDFDocument({
    size: PAGE.size,
    margin: PAGE.margin,
    info: {
      Title: `${cv.fullName} — CV`,
      Author: cv.fullName,
      // Bez `Creator`/`Producer` sa imenom alata: CV nosi ime kandidata, ne našeg servera.
    },
  })

  doc.registerFont(FONT.regular, path.join(FONT_DIR, 'DMSans-Regular.ttf'))
  doc.registerFont(FONT.bold, path.join(FONT_DIR, 'DMSans-Bold.ttf'))

  const left = doc.page.margins.left
  const contentX = left + LABEL_WIDTH + GUTTER
  const contentWidth = doc.page.width - contentX - doc.page.margins.right
  const bottom = () => doc.page.height - doc.page.margins.bottom

  /** Visina teksta u kolonskoj širini, bez crtanja — za proveru da li stavka staje. */
  const measure = (text: string, size: number, width = contentWidth) => {
    doc.fontSize(size)
    return doc.heightOfString(text, { width })
  }

  /**
   * Stavke se crtaju ATOMSKI: ako cela ne staje, ide na novu stranu.
   *
   * Bez ovoga pdfkit prelama gde stigne, pa naslov posla ostane na dnu jedne strane a
   * njegovi buleti na vrhu druge — što se čita kao dve različite stavke.
   */
  const needSpace = (height: number) => {
    if (doc.y + height > bottom()) doc.addPage()
  }

  const text = (
    value: string,
    opts: {
      size?: number
      bold?: boolean
      color?: string
      x?: number
      width?: number
      link?: string
    } = {},
  ) => {
    doc
      .font(opts.bold === true ? FONT.bold : FONT.regular)
      .fontSize(opts.size ?? SIZE.body)
      .fillColor(opts.color ?? COLOR.ink)
      .text(value, opts.x ?? contentX, doc.y, {
        width: opts.width ?? contentWidth,
        ...(opts.link !== undefined && { link: opts.link, underline: false }),
      })
  }

  const bullets = (items: readonly string[]) => {
    for (const item of items) {
      const width = contentWidth - BULLET.indent - BULLET.gap
      needSpace(measure(item, SIZE.body, width))

      const y = doc.y
      doc.font(FONT.regular).fontSize(SIZE.body).fillColor(COLOR.muted)
      doc.text('•', contentX + BULLET.indent, y, { width: BULLET.gap, continued: false })
      doc.fillColor(COLOR.ink)
      doc.text(item, contentX + BULLET.indent + BULLET.gap, y, { width })
      doc.y += GAP.bullet
    }
  }

  /**
   * Naslov sekcije u levoj koloni + linija preko cele širine.
   *
   * Naslov se crta na istoj visini na kojoj počinje sadržaj, pa se `doc.y` posle vraća —
   * inače bi sadržaj krenuo ISPOD naslova umesto pored njega.
   */
  const section = (key: Parameters<typeof label>[0], draw: () => void) => {
    needSpace(60)
    doc.y += GAP.section

    doc
      .moveTo(left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .lineWidth(0.75)
      .strokeColor(COLOR.rule)
      .stroke()

    doc.y += GAP.section * 0.6
    const top = doc.y

    doc
      .font(FONT.bold)
      .fontSize(SIZE.sectionLabel)
      .fillColor(COLOR.ink)
      .text(label(key, lang), left, top, { width: LABEL_WIDTH, characterSpacing: 0.6 })

    doc.y = top
    draw()
  }

  // ── zaglavlje ────────────────────────────────────────────────────────────────
  doc.font(FONT.bold).fontSize(SIZE.name).fillColor(COLOR.ink)
  doc.text(cv.fullName, left, doc.y, { width: doc.page.width - left * 2 })

  if (cv.role) {
    doc.y += GAP.line
    doc.font(FONT.regular).fontSize(SIZE.role).fillColor(COLOR.muted)
    doc.text(cv.role, left, doc.y, { width: doc.page.width - left * 2 })
  }

  // ── kontakt ──────────────────────────────────────────────────────────────────
  if (cv.contact.length > 0) {
    section('contact', () => {
      for (const item of cv.contact) {
        const prefix = item.label === '' ? '' : `${label(item.label as 'phone', lang)}: `
        const y = doc.y

        doc.font(FONT.bold).fontSize(SIZE.body).fillColor(COLOR.ink)
        const prefixWidth = prefix === '' ? 0 : doc.widthOfString(prefix)
        if (prefix !== '') doc.text(prefix, contentX, y, { width: prefixWidth, lineBreak: false })

        doc.font(FONT.regular).fillColor(item.link === undefined ? COLOR.ink : COLOR.link)
        doc.text(item.value, contentX + prefixWidth, y, {
          width: contentWidth - prefixWidth,
          ...(item.link !== undefined && { link: item.link }),
        })
        doc.y += GAP.line
      }
    })
  }

  // ── o meni ───────────────────────────────────────────────────────────────────
  if (cv.summary) {
    section('summary', () => {
      text(cv.summary, { color: COLOR.muted })
    })
  }

  // ── iskustvo ─────────────────────────────────────────────────────────────────
  if (cv.experiences.length > 0) {
    section('experience', () => {
      cv.experiences.forEach((exp, index) => {
        if (index > 0) doc.y += GAP.entry

        const title = exp.position === '' ? exp.company : `${exp.position} — ${exp.company}`
        needSpace(measure(title, SIZE.heading) + 30)

        text(title, { size: SIZE.heading, bold: true })
        doc.y += GAP.line

        const meta = [exp.range, exp.location].filter(Boolean).join(' · ')
        if (meta) {
          text(meta, { size: SIZE.meta, color: COLOR.muted })
          doc.y += GAP.line
        }

        if (exp.summary) {
          text(exp.summary, { color: COLOR.muted })
          doc.y += GAP.line
        }

        bullets(exp.bullets)

        if (exp.technologies.length > 0) {
          doc.y += GAP.line
          text(`${label('technologies', lang)}: ${exp.technologies.join(', ')}`, {
            size: SIZE.meta,
            color: COLOR.muted,
          })
        }
      })
    })
  }

  // ── obrazovanje ──────────────────────────────────────────────────────────────
  if (cv.education) {
    const edu = cv.education
    section('education', () => {
      const lines = [edu.status, edu.degree, edu.programme].filter(Boolean)
      const place = [edu.faculty, edu.university].filter(Boolean).join(', ')
      const tail = [place, edu.city].filter(Boolean).join(' · ')

      for (const line of lines) {
        text(line, { bold: line === lines[0] })
        doc.y += GAP.line
      }
      if (tail) {
        text(tail, { size: SIZE.meta, color: COLOR.muted })
        doc.y += GAP.line
      }

      const meta = [edu.years, edu.gpa === '' ? '' : `${label('gpa', lang)} ${edu.gpa}`]
        .filter(Boolean)
        .join(' · ')
      if (meta) text(meta, { size: SIZE.meta, color: COLOR.muted })
    })
  }

  // ── projekti ─────────────────────────────────────────────────────────────────
  if (cv.projects.length > 0) {
    section('projects', () => {
      cv.projects.forEach((project, index) => {
        if (index > 0) doc.y += GAP.entry

        const heading =
          project.year === null ? project.name : `${project.name} · ${String(project.year)}`
        needSpace(measure(heading, SIZE.heading) + 30)

        text(heading, { size: SIZE.heading, bold: true })
        doc.y += GAP.line

        if (project.summary) {
          text(project.summary, { color: COLOR.muted })
          doc.y += GAP.line
        }

        bullets(project.bullets)

        if (project.technologies.length > 0) {
          doc.y += GAP.line
          text(`${label('technologies', lang)}: ${project.technologies.join(', ')}`, {
            size: SIZE.meta,
            color: COLOR.muted,
          })
        }

        for (const link of project.links) {
          doc.y += GAP.line
          text(link.replace(/^https?:\/\//, ''), {
            size: SIZE.meta,
            color: COLOR.link,
            link,
          })
        }

        if (project.note) {
          doc.y += GAP.line
          text(project.note, { size: SIZE.meta, color: COLOR.muted })
        }
      })
    })
  }

  // ── veštine ──────────────────────────────────────────────────────────────────
  if (cv.skillGroups.length > 0) {
    section('skills', () => {
      cv.skillGroups.forEach((group, index) => {
        if (index > 0) doc.y += GAP.line * 2

        const items = group.items
          .map((s) =>
            s.years === null
              ? s.name
              : `${s.name} (${String(s.years)} ${label('yearsShort', lang)})`,
          )
          .join(' · ')

        if (group.group !== '') {
          text(group.group, { size: SIZE.meta, bold: true })
          doc.y += GAP.bullet
        }
        text(items, { color: COLOR.muted })
      })
    })
  }

  // ── jezici ───────────────────────────────────────────────────────────────────
  if (cv.languages.length > 0) {
    section('languages', () => {
      const line = cv.languages
        .map((l) => (l.level === '' ? l.name : `${l.name} — ${l.level}`))
        .join(' · ')
      text(line, { color: COLOR.muted })
    })
  }

  /*
   * Buffer, ne stream ka `res`.
   *
   * Ruta tako može da postavi `Content-Length` i da na grešku u renderovanju vrati JSON
   * umesto polovičnog PDF-a — kad se piše pravo u odgovor, zaglavlja su već poslata i
   * greška stiže kao pokvarena datoteka.
   */
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    doc.on('error', reject)
    doc.end()
  })
}
