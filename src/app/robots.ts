import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/helpers/seo'

/** Sve javno se indeksira; admin i API nikad (uz `X-Robots-Tag` zaglavlje, docs/20 §2). */
const robots = (): MetadataRoute.Robots => ({
  rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
  sitemap: absoluteUrl('/sitemap.xml'),
  host: absoluteUrl(''),
})

export default robots
