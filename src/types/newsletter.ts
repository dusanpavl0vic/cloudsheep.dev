export interface AdminSubscriber {
  id: string
  email: string
  locale: string
  createdAt: string
  /** `null` — prijava čeka potvrdu adrese (ADR 0016). */
  confirmedAt: string | null
  unsubscribedAt: string | null
}
