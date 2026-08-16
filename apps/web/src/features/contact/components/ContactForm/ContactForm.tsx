import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'

const schema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10),
})

type ContactValues = z.infer<typeof schema>

export const ContactForm = () => {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(schema) })

  // Slanje forme = event handler, ne useEffect. (Bez backenda: prikaz potvrde.)
  const onSubmit = handleSubmit(() => { setSent(true); })

  const sendAnother = () => {
    reset()
    setSent(false)
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-card p-9 text-center shadow-sm">
        <div className="mx-auto mb-4.5 flex size-[58px] items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          ✓
        </div>
        <h2 className="mb-2.5 font-heading text-2xl font-semibold text-foreground">
          {t('contact.form.sentTitle')}
        </h2>
        <p className="mb-5.5 text-[15.5px] leading-relaxed text-muted-foreground">
          {t('contact.form.sentBody')}
        </p>
        <Button variant="outline" shape="pill" size="sm" onClick={sendAnother}>
          {t('contact.form.sendAnother')}
        </Button>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col gap-4.5 rounded-xl border border-border bg-card p-9 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-name">{t('contact.form.name')}</Label>
          <Input
            id="c-name"
            placeholder={t('contact.form.namePh')}
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          {errors.name && (
            <span className="text-[12.5px] text-destructive">{t('contact.form.nameError')}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-email">{t('contact.form.email')}</Label>
          <Input
            id="c-email"
            type="email"
            placeholder={t('contact.form.emailPh')}
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email && (
            <span className="text-[12.5px] text-destructive">{t('contact.form.emailError')}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="c-subject">{t('contact.form.subject')}</Label>
        <Input id="c-subject" placeholder={t('contact.form.subjectPh')} {...register('subject')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="c-message">{t('contact.form.message')}</Label>
        <Textarea
          id="c-message"
          rows={6}
          placeholder={t('contact.form.messagePh')}
          aria-invalid={Boolean(errors.message)}
          {...register('message')}
        />
        {errors.message && (
          <span className="text-[12.5px] text-destructive">{t('contact.form.messageError')}</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11.5px] text-faint">{t('contact.form.note')}</span>
        <Button type="submit" shape="pill">
          {t('contact.form.submit')} →
        </Button>
      </div>
    </form>
  )
}
