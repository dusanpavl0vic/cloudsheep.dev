export const ROUTES = {
  HOME: '/',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
