import { useId, type ReactNode } from 'react'

import {
  formFieldDescriptionVariants,
  formFieldErrorVariants,
  formFieldVariants,
} from './FormField.variants'
import { cn } from '../../lib/cn'
import { Label } from '../../ui/label'

/**
 * Atributi koje `FormField` daje kontroli. Prosleđuju se u celosti:
 * `{(field) => <Input {...field} {...register('email')} />}`.
 */
export interface FormFieldControlProps {
  id: string
  'aria-invalid'?: true
  'aria-describedby'?: string
}

interface FormFieldProps {
  /** Tekst labele. `ReactNode`, jer prevod stiže iz app-e kroz `t()`. */
  label: ReactNode
  /** Pomoćni tekst ispod kontrole. Vezuje se kroz `aria-describedby`. */
  description?: ReactNode
  /** Već prevedena poruka. Njeno PRISUSTVO označava polje neispravnim. */
  error?: ReactNode
  className?: string
  children: (field: FormFieldControlProps) => ReactNode
}

/**
 * Labela, kontrola, opis i greška — sa povezivanjem koje pristupačnost traži.
 *
 * **Polja se nikad ne pišu ručno u app-i.** Ovde živi jedini `useId` i jedino mesto gde se
 * `htmlFor`, `aria-invalid` i `aria-describedby` slažu. Ranije je svaka forma to ponavljala
 * po polju, pa je greška u jednom od tri atributa bila nevidljiva dok je neko ne pročita
 * screen readerom.
 *
 * `children` je funkcija, ne element: `cloneElement` bi radio samo za kontrole čije propse
 * unapred znamo, a ovuda prolaze i `Input`, i `Textarea`, i `Select`, i `Checkbox`, i polja
 * koja `react-hook-form` registruje sam.
 *
 * Poruka greške ide kroz `role="alert"` — screen reader je pročita čim se pojavi, bez
 * pomeranja fokusa (docs/15-accessibility.md).
 */
export const FormField = ({ label, description, error, className, children }: FormFieldProps) => {
  const id = useId()
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`

  /*
   * Kad postoje i opis i greška, kontrola upućuje na oba — redosled je namerno takav da se
   * greška pročita poslednja, jer je ona akcija koju korisnik treba da preduzme.
   */
  const describedBy = [description ? descriptionId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  // `exactOptionalPropertyTypes` je uključen: `{ 'aria-invalid': undefined }` nije isto što
  // i izostavljen ključ, pa se atributi dodaju uslovno umesto da nose `undefined`.
  const field: FormFieldControlProps = {
    id,
    ...(error ? { 'aria-invalid': true as const } : {}),
    ...(describedBy ? { 'aria-describedby': describedBy } : {}),
  }

  return (
    <div className={cn(formFieldVariants(), className)}>
      <Label htmlFor={id}>{label}</Label>

      {children(field)}

      {description && (
        <p id={descriptionId} className={formFieldDescriptionVariants()}>
          {description}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className={formFieldErrorVariants()}>
          {error}
        </p>
      )}
    </div>
  )
}
