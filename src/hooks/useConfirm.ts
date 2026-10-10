'use client'

import { MODALS } from '@/constants/modals'

import { useModal } from './useModal'

/**
 * Odgovori na otvorene dijaloge potvrde. Modal props-i žive u Redux-u i moraju biti
 * serijalizabilni (docs/06 §3), pa funkcija za odgovor stoji ovde, ključena ID-jem zahteva.
 */
const pending = new Map<string, (confirmed: boolean) => void>()

/** Odgovor iz `ConfirmDialog`-a; zatvaranje bez izbora je „ne". */
export const settleConfirm = (id: string, confirmed: boolean) => {
  pending.get(id)?.(confirmed)
  pending.delete(id)
}

interface ConfirmOptions {
  message: string
  confirmLabel?: string
  danger?: boolean
}

/** `if (await confirm({ message })) …` — dijalog kroz `useModal`, bez `window.confirm` (docs/06). */
export const useConfirm = () => {
  const modal = useModal(MODALS.CONFIRM_DIALOG)

  return (options: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      const requestId = crypto.randomUUID()
      pending.set(requestId, resolve)
      modal.open({ requestId, ...options })
    })
}
