/** Brojke studija (dizajn `CS2.stats`). Labela je u `home.insight.stats.<key>`. */
export const INSIGHT_STATS = [
  { key: 'uptime', value: 99.95, decimals: 2, suffix: '%' },
  { key: 'response', value: 48, decimals: 0, suffix: 'h' },
  { key: 'shipped', value: 12, decimals: 0, suffix: '+' },
  { key: 'years', value: 6, decimals: 0, suffix: '' },
] as const

/** 90 dana uptime-a; dva dana sa padom (dizajn: indeksi 37 i 61). Deterministično — isto na serveru i klijentu. */
export const UPTIME_DAYS = Array.from({ length: 90 }, (_, index) => ([37, 61].includes(index) ? 55 : 82 + ((index * 37) % 18)))

/** Ispod ovoga je „dan sa padom" (svetlija boja). */
export const UPTIME_DEGRADED = 60
