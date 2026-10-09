import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from 'react'

interface BaseProps {
  /** `id` polja — `aria-describedby` greške i opisa se grade od njega. */
  id: string
  label: string
  /** Već prevedena poruka greške. */
  error?: string | null
  /** Opis ispod polja (ili akcija uz grešku, npr. predlog ispravke). */
  hint?: ReactNode
  className?: string
}

export type TextFieldProps = BaseProps &
  (
    | ({ multiline?: false; ref?: Ref<HTMLInputElement> } & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>)
    | ({ multiline: true; ref?: Ref<HTMLTextAreaElement> } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'>)
  )
