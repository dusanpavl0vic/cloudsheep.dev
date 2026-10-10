'use client'

import { useWatch, type Control, type FieldValues, type Path, type PathValue, type UseFormSetValue } from 'react-hook-form'

interface FormListOptions<T extends FieldValues, Out> {
  control: Control<T, unknown, Out>
  setValue: UseFormSetValue<T>
  name: Path<T>
}

/**
 * Ponavljajuća grupa polja u admin formi (pozicije u CV-u, rezultati projekta…), bez RHF
 * `useFieldArray`: on bi ostao u JS-u javnih stranica, jer RHF dele sa formom upita
 * (ADR 0014, docs/07). Niz se čita kroz `useWatch`, a menja ceo kroz `setValue` — RHF tada
 * upisuje vrednosti i u registrovana polja, pa posle uklanjanja stavke polja pokazuju
 * pomerene vrednosti. Ključ stavke je indeks (DOM prati poziciju, vrednosti prati `setValue`).
 */
export const useFormList = <T extends FieldValues, Out, Item>({ control, setValue, name }: FormListOptions<T, Out>) => {
  const items = (useWatch({ control, name }) as Item[] | undefined) ?? []
  const replace = (next: Item[]) => {
    setValue(name, next as PathValue<T, Path<T>>, { shouldDirty: true })
  }

  return {
    items: items.map((value, index) => ({ ...(value as object), id: String(index) }) as Item & { id: string }),
    add: (empty: Item) => {
      replace([...items, empty])
    },
    remove: (index: number) => {
      replace(items.filter((_, i) => i !== index))
    },
  }
}
