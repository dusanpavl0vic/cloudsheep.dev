'use client'

import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import { BRIEF_STEPS, useBriefForm, useFreeSlots } from '@/hooks/contact'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'
import { useHydrated } from '@/hooks/useHydrated'

import BookingCard from './BookingCard'
import BriefDone from './BriefDone'
import { Aside, Bar, Bars, Brief, FieldError, Layout, LinkButton, Nav } from './BriefForm.styles'
import type { BriefFormProps } from './BriefForm.types'
import { DetailsStep, ScopeStep, TypeStep } from './BriefSteps'

const STEPS = [TypeStep, ScopeStep, DetailsStep] as const

/** Kontakt: termini (levo) i upit u tri koraka (desno) dele jednu formu — `slotId` ide uz upit. */
const BriefForm = ({ intro, defaults }: BriefFormProps) => {
  const t = useTranslations('contact')
  const translate = useKeyTranslator()
  const brief = useBriefForm(defaults)
  const slots = useFreeSlots()
  const hydrated = useHydrated()
  const { errors } = brief
  const CurrentStep = STEPS[brief.step]
  const slotId = brief.values.slotId ?? null

  return (
    <Layout>
      <Aside>
        {intro}
        {!brief.isDone && (
          <BookingCard
            days={slots.days}
            status={slots.isLoading ? 'loading' : slots.isError ? 'error' : 'ready'}
            selected={slotId}
            selectedLabel={slots.labelOf(slotId)}
            error={translate(errors.slotId?.message)}
            onPick={(id) => {
              brief.choose('slotId', id)
            }}
          />
        )}
      </Aside>

      <Brief
        noValidate
        aria-label={t('progress', { step: Math.min(brief.step + 1, BRIEF_STEPS), total: BRIEF_STEPS })}
        onSubmit={(event) => {
          event.preventDefault()
          if (brief.isLast) void brief.submit(event)
          else void brief.next()
        }}
      >
        <Bars aria-hidden="true">
          {Array.from({ length: BRIEF_STEPS }, (_, index) => (
            <Bar key={index} $done={index <= brief.step} />
          ))}
        </Bars>

        {brief.isDone ? <BriefDone values={brief.values} slotLabel={slots.labelOf(slotId)} /> : CurrentStep && <CurrentStep brief={brief} />}

        {errors.root?.message && <FieldError role="alert">{translate(errors.root.message)}</FieldError>}

        {!brief.isDone && (
          <Nav>
            {brief.step > 0 ? (
              <LinkButton type="button" onClick={brief.back}>
                {t('actions.back')}
              </LinkButton>
            ) : (
              <span />
            )}
            <Button type="submit" size="l" loading={brief.isSending} disabled={!hydrated} {...(brief.isLast ? { iconRight: 'arrowRight' as const } : {})}>
              {brief.isLast ? t('actions.send') : t('actions.next')}
            </Button>
          </Nav>
        )}
      </Brief>
    </Layout>
  )
}

export default BriefForm
