/** Pomak vremenske zone (ms) u datom trenutku: lokalno vreme u zoni minus UTC. */
const zoneOffset = (instant: Date, timeZone: string) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(instant)
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )
  return asUtc - instant.getTime()
}

/**
 * „2026-10-14 13:00 u Beogradu" → trenutak u UTC. Bez biblioteke za zone: pomak se čita iz
 * `Intl` za taj datum, pa letnje/zimsko vreme dolazi samo od sebe.
 */
export const zonedTimeToUtc = (day: string, time: string, timeZone: string) => {
  const [year, month, date] = day.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const guess = Date.UTC(year ?? 0, (month ?? 1) - 1, date ?? 1, hour ?? 0, minute ?? 0)
  // Dva koraka: pomak u blizini prelaza na letnje vreme zavisi od samog rezultata.
  const first = guess - zoneOffset(new Date(guess), timeZone)
  return new Date(guess - zoneOffset(new Date(first), timeZone))
}

/** ISO dan (1 = ponedeljak … 7 = nedelja) za datum zadat kao `YYYY-MM-DD`. */
export const isoWeekday = (day: string) => {
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay()
  return weekday === 0 ? 7 : weekday
}

/** Svi dani od–do, uključivo, kao `YYYY-MM-DD`. */
export const daysBetween = (from: string, to: string) => {
  const days: string[] = []
  for (let current = new Date(`${from}T12:00:00Z`); current <= new Date(`${to}T12:00:00Z`);) {
    days.push(current.toISOString().slice(0, 10))
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000)
  }
  return days
}

/** Isti dan za `months` meseci (procena: „najraniji početak" je za mesec dana). */
export const addMonths = (months: number, from: Date = new Date()) => {
  const date = new Date(from)
  date.setMonth(date.getMonth() + months)
  return date
}
