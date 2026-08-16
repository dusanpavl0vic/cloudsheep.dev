import { useEffect } from 'react'
import { useLocation } from 'react-router'

/** Kanonski domen. Sve apsolutne adrese u `<head>`-u polaze odavde. */
const SITE = 'https://cloudsheep.dev'

/** Upiše ili osveži `<link rel="...">`, bez dupliranja pri svakoj promeni rute. */
const setLink = (rel: string, href: string) => {
  const existing = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  const link = existing ?? document.head.appendChild(document.createElement('link'))
  link.rel = rel
  link.href = href
}

/** Isto za `<meta property="...">` — OG oznake se adresiraju preko `property`, ne `name`. */
const setMeta = (property: string, content: string) => {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  const meta = existing ?? document.head.appendChild(document.createElement('meta'))
  meta.setAttribute('property', property)
  meta.content = content
}

/**
 * Održava `canonical` i `og:url` u koraku sa trenutnom rutom.
 *
 * **Zašto ne statično u `index.html`.** Jedna vrednost bi važila za sve rute i rekla
 * pretraživaču da su `/projects`, `/contact` i `/uses` duplikati početne — dakle izbacila ih
 * iz indeksa. Pogrešan `canonical` je gori od nikakvog: bez njega pretraživač bar sam
 * pogodi, a sa njim mu je rečeno da greši.
 *
 * Ostale OG oznake (slika, `site_name`, `type`) su iste na celom sajtu i zato stoje statično
 * u `index.html`, gde ih vide i alati koji ne izvršavaju JavaScript.
 *
 * **Granica koju vredi znati:** ovo je SPA bez SSR-a, pa oznake postoje tek pošto se JS
 * izvrši. Googlebot renderuje, ali pregled linka u Slack-u ili WhatsApp-u ne — njima vredi
 * samo statični deo iz `index.html`. Ako per-ruta pregled ikad postane bitan, rešenje je
 * prerender pri buildu, ne veći hook.
 */
export const useDocumentHead = () => {
  const { pathname } = useLocation()

  // effect: sinhronizacija sa `document.head` — spoljni sistem van React stabla.
  useEffect(() => {
    const url = `${SITE}${pathname}`
    setLink('canonical', url)
    setMeta('og:url', url)
  }, [pathname])
}
