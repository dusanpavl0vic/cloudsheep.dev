import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { sendMessage } from '../api/sendMessage'
import { contactSchema, type ContactInput } from '../schemas/contact.schema'

const EMPTY: ContactInput = { name: '', email: '', subject: '', message: '', website: '' }

/**
 * Kontakt forma — bez ijednog `useState`.
 *
 * Uspeh se čita iz `formState.isSubmitSuccessful`, greška servera ide u `root` grešku
 * react-hook-form-a. Ranije je komponenta držala `useState(sent)` i prikazivala potvrdu
 * koja **nije bila istinita** — ništa se nije slalo.
 */
export function useContactForm() {
  const { i18n } = useTranslation()

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: EMPTY,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await sendMessage(values, i18n.language)

    // Greška bez polja ide u `root` — nema smisla je vezati za jedno polje (docs/10 §6)
    if (!result.ok) form.setError('root', { message: result.messageKey })
  })

  const sendAnother = () => {
    form.reset(EMPTY)
  }

  return { form, onSubmit, sendAnother }
}
