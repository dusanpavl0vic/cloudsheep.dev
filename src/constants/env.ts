/**
 * Javne promenljive okruženja — JEDINO mesto gde se klijentski kod obraća `process.env`.
 *
 * Next ugrađuje `NEXT_PUBLIC_*` u bundle pri BUILD-u; promena traži nov build. Tajne nikad
 * ovde — serverske promenljive su u `src/server/env.ts`, validirane zod-om.
 */
export const APP_ENVS = ['local', 'test', 'production'] as const
export type AppEnv = (typeof APP_ENVS)[number]

const readAppEnv = (value: string | undefined): AppEnv =>
  APP_ENVS.includes(value as AppEnv) ? (value as AppEnv) : 'local'

export const APP_ENV = readAppEnv(process.env.NEXT_PUBLIC_APP_ENV)
export const IS_PRODUCTION_ENV = APP_ENV === 'production'

/** Kanonski domen. Sve apsolutne adrese (canonical, OG, sitemap, mejl) polaze odavde. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cloudsheep.dev').replace(
  /\/$/,
  '',
)
