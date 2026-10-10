export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
}

export interface SessionResponse {
  user: SessionUser
  accessToken: string
}
