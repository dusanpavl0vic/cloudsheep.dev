import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('sajt', () => {
  test('početna se učita i naslov je vidljiv', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toBeVisible()
    await expect(page).toHaveTitle(/CloudSheep/)
  })

  test('navigacija do radova radi i menja rutu', async ({ page }) => {
    await page.goto('/projects')

    await expect(page).toHaveURL(/\/projects$/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('studija slučaja se otvara sa liste', async ({ page }) => {
    await page.goto('/projects')

    // Ciljano link KA studiji, ne bilo koji link na stranici — prva verzija je uzimala
    // `.last()` i hvatala footer, pa je test padao na početnoj umesto na studiji
    await page.locator('a[href^="/projects/"]').first().click()

    await expect(page).toHaveURL(/\/projects\/.+/)
  })

  test('nepoznata ruta daje 404, ne prazan ekran', async ({ page }) => {
    await page.goto('/ovo-ne-postoji')

    await expect(page.locator('h1')).toBeVisible()
  })

  /**
   * Ovo pokriva bug koji je jedan pun ciklus prošao neprimećen: `<html lang>` je ostajao
   * `sr` i kad je sajt na engleskom. Unit test to sad hvata, ali samo na nivou i18next
   * instance — ovde se proverava atribut na stvarnom dokumentu, što je ono što screen
   * reader i pretraživač zapravo čitaju.
   */
  test('promena jezika menja <html lang>', async ({ page, isMobile }) => {
    await page.goto('/')

    // Atribut mora biti postavljen već pri učitavanju — to je bio bug: stajala je
    // vrednost iz index.html, jer se listener kačio posle init-a
    // Mora biti RAZREŠEN kod (`en`), ne ono što pretraživač javi (`en-US`) — E2E je
    // upravo to i uhvatio, pa je `createI18n` prešao na `resolvedLanguage`
    await expect(page.locator('html')).toHaveAttribute('lang', /^(sr|en)$/)
    const before = await page.locator('html').getAttribute('lang')

    // Na mobilnom prebacivač nije u zaglavlju nego u panelu — to je namerno, sve osim
    // logotipa je tamo. Test mora da prati dizajn, ne obrnuto.
    if (isMobile) {
      await page
        .getByRole('button', { name: /meni|menu/i })
        .first()
        .click()
      await expect(page.getByRole('dialog')).toBeVisible()
    }

    const switcher = page.getByRole('button', { name: /jezik|language/i }).first()
    await switcher.click()

    const other = page.getByRole('option', { selected: false }).first()
    await other.click()

    await expect(page.locator('html')).not.toHaveAttribute('lang', before ?? '')
  })

  test('statični SEO fajlovi se serviraju kao fajlovi, ne kao SPA stranica', async ({
    request,
  }) => {
    // Ovo je tačno ono što je palo na Lighthouse-u: catch-all rewrite je vraćao index.html
    const robots = await request.get('/robots.txt')
    expect(robots.headers()['content-type']).toContain('text/plain')

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.headers()['content-type']).toContain('xml')
  })
})

test.describe('pristupačnost', () => {
  for (const path of ['/', '/projects', '/contact', '/uses']) {
    test(`bez axe povreda na ${path}`, async ({ page }) => {
      /*
       * `reducedMotion` nije udobnost nego uslov za tačno merenje.
       *
       * `.reveal` animira `opacity` od 0 do 1 pri skrolu. Axe uhvati element usred toga,
       * pomeša mu boju sa pozadinom i prijavi `color-contrast` — što je izgledalo kao tri
       * prave WCAG greške. Provereno: sa ugašenim animacijama nula povreda, sa uključenim
       * pada svaki put. WCAG i ne meri prelazna stanja, nego mirno.
       *
       * Uz to, `prefers-reduced-motion` je i stvarna korisnička postavka, pa je ovo
       * istovremeno i provera da je i ta verzija stranice ispravna.
       */
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(path)
      await page.locator('h1').waitFor()

      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
    })
  }
})
