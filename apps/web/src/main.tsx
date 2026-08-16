import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/App'
import { store } from '@/store'
import { applyTheme } from '@/store/slices/themeSlice'

import '@/styles/global.css'

// Inicijalna tema se primenjuje pre prvog rendera — module-level, bez useEffect-a
applyTheme(store.getState().theme.theme)

const container = document.getElementById('root')

if (!container) {
  // Bolje glasan pad nego prazna stranica bez objašnjenja
  throw new Error('Nedostaje #root element — proveri index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
