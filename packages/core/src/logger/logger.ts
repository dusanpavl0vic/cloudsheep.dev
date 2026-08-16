/**
 * Apstrakcija nad izlazom za greške.
 *
 * Postoji da bi zamena console → Sentry bila izmena na jednom mestu, i da bi testovi
 * mogli da potvrde da je greška prijavljena bez šuma u izlazu (docs/16-tooling-ci.md).
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogTransport {
  log: (level: LogLevel, message: string, context?: Record<string, unknown>) => void
}

export interface Logger {
  debug: (message: string, context?: Record<string, unknown>) => void
  info: (message: string, context?: Record<string, unknown>) => void
  warn: (message: string, context?: Record<string, unknown>) => void
  error: (message: string, context?: Record<string, unknown>) => void
}

const LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }

export const consoleTransport: LogTransport = {
  log(level, message, context) {
    // Ovo JE console transport — jedino mesto u repou gde je direktan console opravdan
    console[level === 'debug' ? 'log' : level](message, context ?? '')
  },
}

export function createLogger(
  transport: LogTransport = consoleTransport,
  minLevel: LogLevel = 'debug',
): Logger {
  const emit = (level: LogLevel) => (message: string, context?: Record<string, unknown>) => {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[minLevel]) return
    transport.log(level, message, context)
  }

  return {
    debug: emit('debug'),
    info: emit('info'),
    warn: emit('warn'),
    error: emit('error'),
  }
}
