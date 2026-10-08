'use client'

import { useTranslations } from 'next-intl'
import { useRef, type SubmitEvent } from 'react'

import Icon from '@/components/foundations/Icon'
import { useNewsletterSignup } from '@/hooks/newsletter'
import { useApiErrorMessage } from '@/hooks/useApiErrorMessage'

import { Badge, Done, Error, Field, Fine, Form, Input, Intro, Root, Submit, Subtitle, Title, TextAction, Trap } from './NewsletterForm.styles'

/**
 * Prijava na newsletter u podnožju. Adresa se proverava na serveru (MX, ADR 0013); za grešku u
 * kucanju nudi se ispravka i „zadrži kako sam napisao".
 */
const NewsletterForm = () => {
  const t = useTranslations()
  const errorMessage = useApiErrorMessage()
  const { submit, isSubmitting, isDone, error } = useNewsletterSignup()
  const email = useRef<HTMLInputElement>(null)
  const trap = useRef<HTMLInputElement>(null)

  const send = (allowTypo = false) => {
    void submit({ email: email.current?.value ?? '', website: trap.current?.value ?? '', allowTypo })
  }

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    send()
  }

  const applySuggestion = () => {
    if (email.current && error?.suggestion) email.current.value = error.suggestion
    send()
  }

  return (
    <Root>
      <Intro>
        <Badge aria-hidden="true">
          <Icon name="mail" size={22} />
        </Badge>
        <div>
          <Title>{t('newsletter.title')}</Title>
          <Subtitle>{t('newsletter.subtitle')}</Subtitle>
        </div>
      </Intro>

      {isDone ? (
        <Done role="status">{t('newsletter.success')}</Done>
      ) : (
        <Form onSubmit={onSubmit} noValidate>
          <Field>
            <Input
              ref={email}
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder={t('newsletter.placeholder')}
              aria-label={t('newsletter.label')}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'newsletter-error' : undefined}
            />
            <Trap ref={trap} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <Submit type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              {t('newsletter.submit')}
              <Icon name="arrowRight" size="s" />
            </Submit>
          </Field>
          {error && (
            <Error id="newsletter-error" role="alert">
              {errorMessage(error)}
              {error.suggestion && (
                <>
                  <TextAction type="button" onClick={() => { applySuggestion(); }}>
                    {t('email.useSuggestion', { suggestion: error.suggestion })}
                  </TextAction>
                  <TextAction type="button" onClick={() => { send(true); }}>
                    {t('email.keepAsTyped')}
                  </TextAction>
                </>
              )}
            </Error>
          )}
          <Fine>{t('newsletter.fine')}</Fine>
        </Form>
      )}
    </Root>
  )
}

export default NewsletterForm
