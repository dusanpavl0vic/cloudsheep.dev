'use client'

import { useTranslations } from 'next-intl'

import Chip from '@/components/buttons/Chip'
import TextField from '@/components/inputs/TextField'
import { BRIEF_BUDGETS, BRIEF_TIMELINES, BRIEF_TYPES } from '@/constants/contact'
import type { useBriefForm } from '@/hooks/contact'
import { useKeyTranslator } from '@/hooks/useApiErrorMessage'

import { Cards, FieldError, Group, GroupTitle, Honeypot, LinkButton, Muted, Options, Step, StepTitle } from './BriefForm.styles'

type Brief = ReturnType<typeof useBriefForm>

/** 1 — Šta gradimo: kartice sa podnaslovom. */
export const TypeStep = ({ brief }: { brief: Brief }) => {
  const t = useTranslations('contact')
  const translate = useKeyTranslator()
  const error = brief.errors.projectType?.message

  return (
    <Step>
      <StepTitle>{t('steps.need')}</StepTitle>
      <Cards role="radiogroup" aria-label={t('steps.need')}>
        {BRIEF_TYPES.map((type) => (
          <Chip key={type} selected={brief.values.projectType === type} hint={t(`types.${type}.hint`)} onClick={() => { brief.choose('projectType', type) }}>
            {t(`types.${type}.label`)}
          </Chip>
        ))}
      </Cards>
      {error && <FieldError role="alert">{translate(error)}</FieldError>}
    </Step>
  )
}

/** 2 — Budžet i rok: čipovi. */
export const ScopeStep = ({ brief }: { brief: Brief }) => {
  const t = useTranslations('contact')
  const translate = useKeyTranslator()
  const { errors } = brief

  return (
    <Step>
      <StepTitle>{t('steps.budget')}</StepTitle>
      <Group>
        <Options role="radiogroup" aria-label={t('steps.budget')}>
          {BRIEF_BUDGETS.map((budget) => (
            <Chip key={budget} selected={brief.values.budget === budget} onClick={() => { brief.choose('budget', budget) }}>
              {t(`budgets.${budget}`)}
            </Chip>
          ))}
        </Options>
        {errors.budget?.message && <FieldError role="alert">{translate(errors.budget.message)}</FieldError>}
      </Group>
      <Group>
        <GroupTitle id="when-title">{t('steps.when')}</GroupTitle>
        <Options role="radiogroup" aria-labelledby="when-title">
          {BRIEF_TIMELINES.map((timeline) => (
            <Chip key={timeline} selected={brief.values.timeline === timeline} onClick={() => { brief.choose('timeline', timeline) }}>
              {t(`timelines.${timeline}`)}
            </Chip>
          ))}
        </Options>
        {errors.timeline?.message && <FieldError role="alert">{translate(errors.timeline.message)}</FieldError>}
      </Group>
    </Step>
  )
}

/** 3 — Podaci: ime, adresa (proverava se na blur, ADR 0013), poruka; honeypot za botove. */
export const DetailsStep = ({ brief }: { brief: Brief }) => {
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
