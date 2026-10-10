'use client'

import { useTranslations } from 'next-intl'

import TextField from '@/components/inputs/TextField'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import { Honeypot, LinkButton, Muted, Step, StepTitle } from './BriefForm.styles'
import type { Brief } from './BriefSteps'

/**
 * 3 — Podaci: ime, adresa (proverava se na blur, ADR 0013), poruka; honeypot za botove.
 * Učitava se lenjo (BriefForm): polja i provera adrese ne trebaju dok posetilac ne stigne
 * do trećeg koraka, a `/contact` je najbliži JS budžetu (ADR 0014).
 */
const DetailsStep = ({ brief }: { brief: Brief }) => {
  const t = useTranslations()
  const translate = useKeyTranslator()
  const { errors } = brief
  const { register } = brief.form
  const { email } = brief
  const emailField = register('email', {
    onBlur: (event: { target: { value: string } }) => {
      void email.check(event.target.value)
    },
  })

  const emailHint = email.suggestion ? (
    <Muted>
      <LinkButton type="button" onClick={email.applySuggestion}>
        {t('email.useSuggestion', { suggestion: email.suggestion })}
      </LinkButton>
      {' · '}
      <LinkButton type="button" onClick={email.keepAsTyped}>
        {t('email.keepAsTyped')}
      </LinkButton>
    </Muted>
  ) : (
    email.isChecking && <Muted aria-live="polite">{t('email.checking')}</Muted>
  )

  return (
    <Step>
      <StepTitle>{t('contact.steps.details')}</StepTitle>
      <TextField id="brief-name" label={t('contact.fields.name')} autoComplete="name" error={translate(errors.name?.message)} {...register('name')} />
      <TextField
        id="brief-email"
        type="email"
        label={t('contact.fields.email')}
        autoComplete="email"
        inputMode="email"
        error={translate(errors.email?.message, email.suggestion ? { suggestion: email.suggestion } : undefined)}
        hint={emailHint || null}
        {...emailField}
      />
      <TextField id="brief-message" multiline rows={5} label={t('contact.fields.message')} error={translate(errors.message?.message)} {...register('message')} />
      <Honeypot aria-hidden="true">
        <label htmlFor="brief-website">{t('contact.fields.website')}</label>
        <input id="brief-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </Honeypot>
    </Step>
  )
}

export default DetailsStep
