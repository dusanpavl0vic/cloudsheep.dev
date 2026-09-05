/**
 * Naslov i opis po ruti.
 *
 * Do sada je ceo sajt imao JEDAN `<title>` i jedan opis — isti na početnoj, u radovima, na
 * kontaktu i na svakoj studiji slučaja. Za pretraživač to znači četiri stranice koje izgledaju
 * kao ista stranica, a za pregled linka u Slack-u ili WhatsApp-u jednu te istu karticu.
 *
 * Ključevi, a ne gotov tekst: naslov i opis su sadržaj kao i svaki drugi i idu kroz `t()`.
 * Isti spisak koristi i `scripts/build-seo-pages.mjs`, koji pri buildu piše statični HTML po
 * ruti — otud izvoz, a ne privatna konstanta u hooku.
 */
export const SEO_BY_ROUTE: Record<string, { titleKey: string; descriptionKey: string }> = {
  '/': { titleKey: 'seo.home.title', descriptionKey: 'seo.home.description' },
  '/projects': { titleKey: 'seo.projects.title', descriptionKey: 'seo.projects.description' },
  '/contact': { titleKey: 'seo.contact.title', descriptionKey: 'seo.contact.description' },
  '/uses': { titleKey: 'seo.uses.title', descriptionKey: 'seo.uses.description' },
}

/**
 * Studija slučaja nema unapred poznat naslov — on dolazi iz baze, pa ga postavlja sama
 * stranica (`ProjectPage`), a ne zajednički hook u `MainLayout`-u.
 *
 * Zašto ovako, a ne kroz kontekst: efekti DECE se u Reactu izvršavaju pre efekata roditelja,
 * pa bi `MainLayout` pregazio naslov koji je stranica upravo postavila. Ovo razdvajanje je
 * jedina varijanta koja nema tu trku.
 */
export const isProjectDetail = (pathname: string) => /^\/projects\/[^/]+$/.test(pathname)
