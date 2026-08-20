import { useTranslation } from 'react-i18next'

import { Button, FormField, Input, Textarea } from '@app/ui'

import { useContactForm } from '../../hooks/useContactForm'

/**
 * Kontakt forma koja ZAISTA šalje.
 *
 * Ranije je `onSubmit` odbacivao vrednosti i prikazivao potvrdu „stiglo je u studio inbox" —
 * poruka koja nije bila tačna. Sada ide na `POST /contact`, gde se prvo upiše u bazu, pa
 * pošalje mejl.
 *
 * **Nula `useState`.** Uspeh je `isSubmitSuccessful`, greška servera je `root` greška —
 * oboje već drži react-hook-form (docs/10).
 */
export const ContactForm = () => {
  const { t } = useTranslation(['contact', 'common'])
  const { form, onSubmit, sendAnother } = useContactForm()

  const {
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = form

  if (isSubmitSuccessful) {
    return (
      <div
        role="status"
        className="border-border bg-card flex flex-col items-start gap-4 rounded-xl border p-8"
      >
        <p className="font-heading text-foreground text-[19px] font-semibold">
          {t('contact.form.sentTitle')}
        </p>
        <p className="text-muted-foreground text-[15.5px] leading-relaxed">
          {t('contact.form.sentBody')}
        </p>
        <Button variant="outline" size="sm" onClick={sendAnother}>
          {t('contact.form.sendAnother')}
        </Button>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void onSubmit(event)}
      className="border-border bg-card flex flex-col gap-5 rounded-xl border p-8"
      aria-busy={isSubmitting}
    >
      <FormField
        label={t('contact.form.name')}
        {...(errors.name && { error: t(errors.name.message ?? '') })}
      >
        {(field) => <Input {...field} autoComplete="name" {...register('name')} />}
      </FormField>

      <FormField
        label={t('contact.form.email')}
        {...(errors.email && { error: t(errors.email.message ?? '') })}
      >
        {(field) => <Input {...field} type="email" autoComplete="email" {...register('email')} />}
      </FormField>

      <FormField
        label={t('contact.form.subject')}
        {...(errors.subject && { error: t(errors.subject.message ?? '') })}
      >
        {(field) => <Input {...field} {...register('subject')} />}
      </FormField>

      <FormField
        label={t('contact.form.message')}
        {...(errors.message && { error: t(errors.message.message ?? '') })}
      >
        {(field) => <Textarea {...field} rows={6} {...register('message')} />}
      </FormField>

      {/*
        Honeypot: skriven od ljudi (`sr-only` + `tabIndex={-1}`), vidljiv botovima koji
        popunjavaju svako polje. `aria-hidden` da ga screen reader ne pročita kao pravo polje.
      */}
      <input
        {...register('website')}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="sr-only"
      />

      {/* Greška servera bez polja — ne toast, jer toast sistem u `web` ne postoji */}
      {errors.root && (
        <p role="alert" className="text-destructive text-sm">
          {t(errors.root.message ?? '')}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('common:common.sending') : t('contact.form.submit')}
      </Button>
    </form>
  )
}
