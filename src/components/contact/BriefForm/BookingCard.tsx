'use client'

import { useTranslations } from 'next-intl'

import type { BookingDay } from '@/helpers/booking'

import { Card, CardTitle, Day, DayDate, DayName, Days, FieldError, LinkButton, Muted, Picked, Slot } from './BriefForm.styles'

interface BookingCardProps {
  days: BookingDay[]
  /** Spisak termina nije mogao da se pročita — upit i dalje prolazi. */
  unavailable: boolean
  selected: string | null
  selectedLabel: string | null
  error: string | null
  onPick: (id: string | null) => void
}

/** Termini uvodnog poziva (dizajn: dani u kolonama). Izbor je opcion — upit prolazi i bez njega. */
const BookingCard = ({ days, unavailable, selected, selectedLabel, error, onPick }: BookingCardProps) => {
  const t = useTranslations('contact.booking')

  return (
    <Card role="group" aria-labelledby="booking-title">
      <div>
        <CardTitle id="booking-title">{t('title')}</CardTitle>
        <Muted>{t('subtitle')}</Muted>
      </div>
      {unavailable && <Muted>{t('unavailable')}</Muted>}
      {!unavailable && days.length === 0 && <Muted>{t('none')}</Muted>}
      {days.length > 0 && (
        <Days>
          {days.map((day) => (
            <Day key={day.key}>
              <DayName>{day.weekday}</DayName>
              <DayDate>{day.date}</DayDate>
              {day.slots.map((slot) => (
                <Slot
                  key={slot.id}
                  type="button"
                  $selected={slot.id === selected}
                  aria-pressed={slot.id === selected}
                  aria-label={t('pick', { time: slot.label })}
                  onClick={() => {
                    onPick(slot.id === selected ? null : slot.id)
                  }}
                >
                  {slot.time}
                </Slot>
              ))}
            </Day>
          ))}
        </Days>
      )}
      {selectedLabel ? (
        <Picked aria-live="polite">
          {t('picked', { time: selectedLabel })}
          <LinkButton
            type="button"
            onClick={() => {
              onPick(null)
            }}
          >
            {t('clear')}
          </LinkButton>
        </Picked>
      ) : (
        days.length > 0 && <Muted>{t('optional')}</Muted>
      )}
      {error && <FieldError role="alert">{error}</FieldError>}
    </Card>
  )
}

export default BookingCard
