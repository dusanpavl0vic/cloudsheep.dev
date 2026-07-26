const APP_ENV: AppEnv = import.meta.env.VITE_APP_ENV ?? 'development'

export const APP_CONFIG = {
  name: 'CloudSheep',
  appEnv: APP_ENV,
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  isDevelopment: APP_ENV === 'development',
  isTest: APP_ENV === 'test',
  isProduction: APP_ENV === 'production',
} as const
