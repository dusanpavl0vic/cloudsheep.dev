import 'server-only'

/**
 * Strukturisan log na stdout (Coolify ga hvata). JSON red po događaju — pretraživ i bez
 * zavisnosti od biblioteke za logovanje.
 */
const write = (
  level: 'info' | 'warn' | 'error',
  message: string,
  extra?: Record<string, unknown>,
) => {
  if (process.env.NODE_ENV === 'test') return
  const line = JSON.stringify({ level, time: new Date().toISOString(), message, ...extra })
  if (level === 'error') console.error(line)
  else console.log(line)
}

const describe = (error: unknown) =>
  error instanceof Error ? { error: error.message, stack: error.stack } : { error: String(error) }

export const log = {
  info: (message: string, extra?: Record<string, unknown>) => {
    write('info', message, extra)
  },
  warn: (message: string, error?: unknown) => {
    write('warn', message, error === undefined ? undefined : describe(error))
  },
  error: (message: string, error?: unknown) => {
    write('error', message, error === undefined ? undefined : describe(error))
  },
}
