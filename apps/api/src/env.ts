import { z } from 'zod'

/**
 * Env se validira pri učitavanju modula i puca glasno ako nešto fali.
 *
 * Isti obrazac kao `apps/admin/src/lib/env.ts`, ali BEZ `createEnv` iz `@app/utils`:
 * tamošnja verzija čita `import.meta.env` (Vite), a ovde je izvor `process.env`.
 *
 * Za razliku od frontenda, ove vrednosti su **tajne** — nema `VITE_` prefiksa i ništa
 * od ovoga ne sme završiti u bundle-u koji ide pretraživaču.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL je obavezan'),

  /** Potpisuje access tokene. Dužina je minimum, ne preporuka — kraći ključ je slabiji potpis. */
  JWT_SECRET: z.string().min(32, 'JWT_SECRET mora imati bar 32 znaka'),

  /**
   * Odakle se sme zvati API. Comma-separated, bez zvezdice.
   * `credentials: true` uz `origin: *` browser ionako odbija — allowlist je jedini put.
   */
  CORS_ORIGINS: z
    .string()
    .default('')
    .transform((value) =>
      value
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean),
    ),

  /** Prazan znači „bez Domain atributa" — tako radi na localhost-u. */
  COOKIE_DOMAIN: z.string().default(''),

  /** Gde se čuvaju otpremljene datoteke. U kontejneru je to montiran volumen. */
  UPLOAD_DIR: z.string().default('./uploads'),
  /**
   * Puna adresa sa koje se serviraju otpremljene datoteke, SA shemom i portom.
   *
   * **Mora biti apsolutna.** Prazna vrednost daje relativne putanje (`/uploads/x.svg`), a
   * one rade samo ako su sajt i API na istom poreklu — što nisu ni lokalno (`:5173` naspram
   * `:3000`) ni u produkciji (`cloudsheep.dev` naspram `api.cloudsheep.dev`).
   *
   * Kad je pogrešna, greška je NEVIDLJIVA: sajt traži sliku od sebe, SPA fallback vrati
   * `index.html` sa statusom 200, i `<img>` prikaže prazno bez ijedne poruke u mrežnom tabu.
   * Zato je u produkciji obavezna — vidi `superRefine` ispod.
   */
  PUBLIC_UPLOAD_BASE: z.string().default(''),
  MAX_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(5 * 1024 * 1024),

  /*
   * SMTP za kontakt formu. Sve je OPCIONO namerno.
   *
   * Bez ovih vrednosti `pnpm dev` mora da radi — inače nijedan lokalni razvoj ne prolazi
   * bez Google App Password-a. Kad su prazne, poruka se upiše u bazu i ISPIŠE u log
   * umesto da se pošalje; to je vidljivo ponašanje, ne tiho gutanje.
   */
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_USER: z.string().default(''),
  /** Google App Password (traži 2FA na nalogu). Nikad obična lozinka naloga. */
  SMTP_PASS: z.string().default(''),
  /** Gde stižu poruke sa forme. */
  CONTACT_TO: z.string().default(''),

  ACCESS_TOKEN_TTL: z.string().default('15m'),
  /** „Zapamti me" produžava refresh; bez njega sesija traje jedan dan. */
  REFRESH_TTL_DAYS: z.coerce.number().int().positive().default(1),
  REFRESH_TTL_DAYS_REMEMBERED: z.coerce.number().int().positive().default(30),
})

/*
 * Produkcija ne sme da krene bez adrese za slike.
 *
 * Podrazumevana prazna vrednost postoji zbog testova i skripti; u produkciji bi značila
 * da nijedna otpremljena slika ne radi, a da ništa ne prijavi grešku.
 */
const checked = schema.superRefine((value, ctx) => {
  if (value.NODE_ENV === 'production' && !value.PUBLIC_UPLOAD_BASE) {
    ctx.addIssue({
      code: 'custom',
      path: ['PUBLIC_UPLOAD_BASE'],
      message: 'obavezna u produkciji — bez nje otpremljene slike ne mogu da se učitaju',
    })
  }
})

const parsed = checked.safeParse(process.env)

if (!parsed.success) {
  const problems = parsed.error.issues
    .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
    .join('\n')
  throw new Error(
    `Neispravna konfiguracija okruženja:\n${problems}\n\n` +
      `Proveri .env prema .env.example. Vidi infra/COOLIFY.md za produkciju.`,
  )
}

export const env = parsed.data
export const isProd = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
