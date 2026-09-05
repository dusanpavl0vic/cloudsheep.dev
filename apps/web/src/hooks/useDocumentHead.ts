import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { SEO_BY_ROUTE, isProjectDetail } from '@/lib/seo'

/** Kanonski domen. Sve apsolutne adrese u `<head>`-u polaze odavde. */
const SITE = 'https://cloudsheep.dev'

/** Upiše ili osveži `<link rel="...">`, bez dupliranja pri svakoj promeni rute. */
const setLink = (rel: string, href: string) => {
  const existing = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  const link = existing ?? document.head.appendChild(document.createElement('link'))
  link.rel = rel
  link.href = href
}

/** OG oznake se adresiraju preko `property`, ne `name` — otud dva pomoćna zapisa. */
const setMetaProperty = (property: string, content: string) => {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  const meta = existing ?? document.head.appendChild(document.createElement('meta'))
  meta.setAttribute('property', property)
  meta.content = content
}

const setMetaName = (name: string, content: string) => {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  const meta = existing ?? document.head.appendChild(document.createElement('meta'))
  meta.name = name
  meta.content = content
}

/** Naslov, opis i njihovi OG parnjaci — uvek zajedno, da se ne raziđu. */
const applyTitleAndDescription = (title: string, description: string) => {
  document.title = title
  setMetaName('description', description)
  setMetaProperty('og:title', title)
  setMetaProperty('og:description', description)
}

/**
 * Održava `canonical`, `og:url`, naslov i opis u koraku sa trenutnom rutom.
 *
 * **Zašto ne statično u `index.html`.** Jedna vrednost bi važila za sve rute i rekla
 * pretraživaču da su `/projects`, `/contact` i `/uses` duplikati početne — dakle izbacila ih
 * iz indeksa. Pogrešan `canonical` je gori od nikakvog: bez njega pretraživač bar sam
 * pogodi, a sa njim mu je rečeno da greši.
 *
 * **Studija slučaja se preskače**, jer njen naslov dolazi iz baze i postavlja ga
 * `ProjectPage` kroz `useDocumentTitle`. Efekti dece se izvršavaju pre efekata roditelja, pa
 * bi ovaj hook inače pregazio naslov koji je stranica upravo upisala.
 *
 * **Granica koju vredi znati:** ovo je SPA bez SSR-a, pa oznake postoje tek pošto se JS
 * izvrši. Googlebot renderuje, ali pregled linka u Slack-u ili WhatsApp-u ne. Zbog njih
 * `scripts/build-seo-pages.mjs` pri buildu piše statični HTML po ruti — ovaj hook i ta
 * skripta čitaju **isti** spisak iz `lib/seo.ts`, da se ne raziđu.
 */
export const useDocumentHead = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation('common')

  // effect: sinhronizacija sa `document.head` — spoljni sistem van React stabla.
  useEffect(() => {
    const url = `${SITE}${pathname}`
    setLink('canonical', url)
    setMetaProperty('og:url', url)

    if (isProjectDetail(pathname)) return

    const seo = SEO_BY_ROUTE[pathname]
    if (seo) applyTitleAndDescription(t(seo.titleKey), t(seo.descriptionKey))
  }, [pathname, t])
}

/**
 * Naslov i opis za stranicu čiji sadržaj dolazi iz podataka, ne iz spiska ruta.
 *
 * Koristi ga `ProjectPage`: naslov studije slučaja je naziv projekta iz baze, pa se zna tek
 * posle učitavanja.
 */
export const useDocumentTitle = (title: string, description: string) => {
  // effect: sinhronizacija sa `document.head` — spoljni sistem van React stabla.
  useEffect(() => {
    if (!title) return
    applyTitleAndDescription(title, description)
  }, [title, description])
}
