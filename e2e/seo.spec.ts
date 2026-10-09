import { expect, test } from '@playwright/test'

/**
 * Indeksiranje (razlog redizajna, docs/05 §4): pravi status kodovi, jedna adresa po stranici,
 * canonical + hreflang, sitemap iz baze, admin i API van indeksa, JSON-LD.
 */
const slugsFrom = (xml: string, section: 'projects' | 'notes') =>
  [...xml.matchAll(new RegExp(`<loc>[^<]*/${section}/([a-z0-9-]+)</loc>`, 'g'))].map((m) => m[1]).filter(Boolean)

test('javne stranice su 200 na oba jezika', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const project = slugsFrom(xml, 'projects')[0]
  const note = slugsFrom(xml, 'notes')[0]
  const paths = ['/', '/sr', '/projects', '/sr/projects', '/notes', '/sr/notes', '/contact', '/sr/contact']
  if (project) paths.push(`/projects/${project}`, `/sr/projects/${project}`)
  if (note) paths.push(`/notes/${note}`, `/sr/notes/${note}`)
  for (const path of paths) expect((await request.get(path)).status(), path).toBe(200)
})

test('nepostojeće adrese su pravi 404 (ne 200 sa porukom)', async ({ request }) => {
  for (const path of ['/projects/ne-postoji-e2e', '/notes/ne-postoji-e2e', '/nema-ove-stranice', '/sr/nema-ove-stranice']) {
    expect((await request.get(path)).status(), path).toBe(404)
  }
})

test('kosa crta na kraju i stara /uses adresa preusmeravaju trajno', async ({ request }) => {
  const slash = await request.get('/contact/', { maxRedirects: 0 })
  expect(slash.status()).toBe(308)
  expect(slash.headers().location).toMatch(/\/contact$/)
  const uses = await request.get('/uses', { maxRedirects: 0 })
  expect(uses.status()).toBe(308)
  expect(uses.headers().location).toMatch(/\/#stack$/)
})

test('u pretrazi je samo engleski: /sr je noindex i bez hreflang-a (ADR 0012)', async ({ page, request }) => {
  await page.goto('/sr/projects?category=fullStack')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /\/sr\/projects$/)
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/)
  await expect(page.locator('link[rel=alternate][hreflang]')).toHaveCount(0)
  await expect(page.locator('html')).toHaveAttribute('lang', 'sr-Latn')
  expect((await request.get('/sr/projects')).headers()['x-robots-tag']).toBe('noindex, follow')

  await page.goto('/projects')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /\/projects$/)
  await expect(page.locator('meta[name=robots]')).toHaveCount(0)
  expect((await request.get('/projects')).headers()['x-robots-tag']).toBeUndefined()
})

test('podrazumevani jezik je engleski — i za posetioca iz Srbije (bez preusmeravanja)', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'sr-RS', extraHTTPHeaders: { 'Accept-Language': 'sr-RS,sr;q=0.9' } })
  const page = await context.newPage()
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  expect(new URL(page.url()).pathname).toBe('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await context.close()
})

test('admin i API nisu za indeks', async ({ request }) => {
  expect((await request.get('/api/health')).headers()['x-robots-tag']).toBe('noindex, nofollow')
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Disallow: /admin')
  expect(robots).toContain('Sitemap:')
})

test('sitemap ima samo engleske adrese', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/projects', '/notes', '/contact']) expect(xml).toContain(`${path}</loc>`)
  expect(xml).not.toContain('/sr')
  expect(xml).not.toContain('hreflang')
})

test('JSON-LD: studio na početnoj, delo na studiji slučaja', async ({ page, request }) => {
  await page.goto('/')
  const home = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(home.some((json) => json.includes('"ProfessionalService"'))).toBe(true)

  const slug = slugsFrom(await (await request.get('/sitemap.xml')).text(), 'projects')[0]
  test.skip(!slug, 'nema objavljenih projekata')
  await page.goto(`/projects/${String(slug)}`)
  const project = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(project.some((json) => json.includes('"CreativeWork"'))).toBe(true)
  expect(project.some((json) => json.includes('"BreadcrumbList"'))).toBe(true)
})
