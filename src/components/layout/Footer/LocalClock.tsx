'use client'

import { useTranslations } from 'next-intl'

import { BOOKING_TIME_ZONE } from '@/constants/booking'
import { useNow } from '@/hooks/useNow'

const MINUTE = 60_000

/** „Niš 14:32 CET" — lokalno vreme studija, osveženo svakog minuta. Na serveru se ne renderuje. */
const LocalClock = () => {
  const t = useTranslations('footer')
  const tick = useNow(MINUTE)
  if (tick === null) return null

  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: BOOKING_TIME_ZONE }).format(
    tick * MINUTE,
  )
  return <span>{t('localTime', { time })}</span>
}

export default LocalClock
