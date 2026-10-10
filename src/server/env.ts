import 'server-only'

import { z } from 'zod'

/**
 * Serverske promenljive — TAJNE, nikad u bundle-u (docs/17-backend.md §2).
 *
 * Validiraju se LENJO, pri prvom pozivu `env()`, a ne pri uvozu modula: `next build` uvozi
 * route handlere da bi ih analizirao, a CI build nema (i ne sme da ima) produkcione tajne.
 * Na serveru prvi zahtev ili pada glasno sa spiskom problema, ili sve radi.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL je obavezan'),

  /** Potpisuje access tokene. Dužina je minimum, ne preporuka. */
  JWT_SECRET: z.string().min(32, 'JWT_SECRET mora imati bar 32 znaka'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  /** „Zapamti me" produžava refresh; bez njega sesija traje jedan dan. */
  REFRESH_TTL_DAYS: z.coerce.number().int().positive().default(1),
  REFRESH_TTL_DAYS_REMEMBERED: z.coerce.number().int().positive().default(30),

  /** Gde se čuvaju otpremljene datoteke. U kontejneru je to montiran volumen. */
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(5 * 1024 * 1024),
  /**
   * Prefiks javnog URL-a otpremljenih slika. PRAZNO = isto poreklo (`/uploads/x.png`), što je
   * ispravno sada kad je API deo sajta (ADR 0009). Stari zapisi sa `api.cloudsheep.dev` i
   * dalje rade — taj domen pokazuje na isti kontejner.
   */
  PUBLIC_UPLOAD_BASE: z.string().default(''),

  /*
   * SMTP — OPCIONO. Bez vrednosti se poruka upiše u bazu i ispiše u log umesto da se
   * pošalje; to je vidljivo ponašanje, ne tiho gutanje.
   */
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_USER: z.string().default(''),
  /** Google App Password (traži 2FA). Nikad obična lozinka naloga. */
  SMTP_PASS: z.string().default(''),
  /** Gde stižu poruke sa forme. */
  CONTACT_TO: z.string().default(''),
})

export type ServerEnv = z.infer<typeof schema>

let cached: ServerEnv | null = null

export const env = (): ServerEnv => {
  if (cached) return cached

  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(
      `Neispravna konfiguracija okruženja:\n${problems}\n\nProveri .env prema .env.example; produkcija: infra/COOLIFY.md.`,
    )
  }

  cached = parsed.data
  return cached
}

export const isProduction = () => env().NODE_ENV === 'production'
export const isTest = () => process.env.NODE_ENV === 'test'
