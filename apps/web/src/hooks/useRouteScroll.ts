import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Skroluje na sidro (#hash) kad ruta ima hash, inače na vrh pri promeni stranice.
 * Radi na promenu location-a — legitiman useEffect (subscribe na router/DOM, PROJECT_GUIDE 2.1).
 */
export const useRouteScroll = () => {
  const { pathname, hash } = useLocation()

  // effect: window.scrollTo — imperativni DOM rad na promenu rute
  useEffect(() => {
    if (hash) {
      // Odloži za jedan frame da sekcija bude izmerena pre skrolovanja (posle mount-a)
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(hash.slice(1))
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else window.scrollTo({ top: 0 })
      })
      return () => { cancelAnimationFrame(raf); }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
}
