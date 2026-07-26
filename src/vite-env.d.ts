/// <reference types="vite/client" />

type AppEnv = 'development' | 'test' | 'production'

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: AppEnv
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
