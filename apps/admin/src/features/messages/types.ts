export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  /** `false` znači da SMTP nije prošao — poruka je i dalje sačuvana. */
  wasEmailed: boolean
  emailError: string | null
  createdAt: string
}

export interface MessageListResponse {
  items: ContactMessage[]
  unread: number
}
