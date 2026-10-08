export interface CountUpProps {
  /** Broj (`99.95`) ili tekst sa brojem (`"40%"`, `"$1,200"`). */
  value: number | string
  /** Broj decimala za brojčanu vrednost (tekst ih nosi sam). */
  decimals?: number
  /** Sufiks u boji akcenta (`%`, `h`, `+`). */
  suffix?: string
  durationMs?: number
  className?: string
}
