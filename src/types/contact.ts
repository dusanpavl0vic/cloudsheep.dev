import type { EmailRejectReason } from '@/constants/email'

/** Odgovor na proveru adrese dok se kuca (`POST /api/email/check`). */
export type EmailCheckResult =
  { ok: true } | { ok: false; reason: EmailRejectReason; suggestion: string | null }

export interface AdminMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  projectType: string
  budget: string
  timeline: string
  locale: string
  /** Izabran termin poziva, ISO. */
  bookedAt: string | null
  isRead: boolean
  /** `false` znači da SMTP nije prošao — poruka je i dalje tu. */
  wasEmailed: boolean
  emailError: string | null
  createdAt: string
}

export interface AdminMessageList {
  items: AdminMessage[]
  unread: number
}
