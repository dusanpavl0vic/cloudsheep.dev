import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/App'
import { store } from '@/store'
import { applyTheme } from '@/store/slices/themeSlice'

import '@/i18n'
import '@/styles/global.css'

// Inicijalna tema se primenjuje pre prvog rendera — module-level, bez useEffect-a
applyTheme(store.getState().theme.theme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
