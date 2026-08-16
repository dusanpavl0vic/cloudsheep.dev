import type { z } from 'zod'

/**
 * Validira env promenljive zod šemom i **obara build ako fali obavezna**.
 *
 * Razlog: `import.meta.env.VITE_API_URL` koji je `undefined` u produkciji ne javi ništa —
 * app tiho šalje zahteve na `undefined/projects`. Bolje je da build padne.
 *
 * Nikad ne čitaj `import.meta.env` direktno; samo kroz objekat koji ovo vrati.
 * `VITE_` prefiks znači da je vrednost **javno vidljiva** u bundle-u — nikad tajne
 * (docs/20-security.md).
 */
export function createEnv<T>(schema: z.ZodType<T>, source: unknown): T {
  const parsed = schema.safeParse(source)

  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `  • ${issue.path.join('.') || '(koren)'}: ${issue.message}`)
      .join('\n')

    throw new Error(
      `Neispravna konfiguracija okruženja:\n${problems}\n\n` +
        `Proveri .env prema .env.example. Vidi docs/16-tooling-ci.md §4.`,
    )
  }

  return parsed.data
}
