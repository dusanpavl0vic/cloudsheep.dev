export const APP_CONFIG = {
  name: 'CloudSheep',
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
} as const
