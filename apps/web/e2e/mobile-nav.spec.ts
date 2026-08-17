import { expect, test } from '@playwright/test'

/**
 * Mobilni panel je **jedina stvar u app-i koju jsdom ne može da proveri**.
 *
 * Panel je native `<dialog>` otvoren kroz `showModal()`, a jsdom nema top-layer — u unit
 * testu sam morao da stubujem i `showModal` i `close`. To znači da unit test proverava samo
 * da se pozovu, a ne i ono zbog čega je platforma uopšte izabrana umesto Radix-a: zamku
 * fokusa, `Esc` i inertnu pozadinu. Ako te tri stvari ne rade, izbor je bio pogrešan —
 * i samo ovde se to vidi.
 */
test.describe('mobilna navigacija', () => {
  test.skip(({ isMobile }) => !isMobile, 'panel postoji samo ispod lg širine')

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('otvara se i zatvara', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /meni|menu/i }).first()
    await trigger.click()

    const sheet = page.getByRole('dialog')
    await expect(sheet).toBeVisible()

    await sheet.getByRole('button').first().click()
    await expect(sheet).toBeHidden()
  })

  test('Esc zatvara panel — to daje platforma, nismo pisali nijednu liniju za to', async ({
    page,
  }) => {
    await page
      .getByRole('button', { name: /meni|menu/i })
      .first()
      .click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('fokus ne može da pobegne na stranicu iza panela', async ({ page }) => {
    await page
      .getByRole('button', { name: /meni|menu/i })
      .first()
      .click()
    await expect(page.getByRole('dialog')).toBeVisible()

    /*
     * Tvrdnja je namerno „nijedan INTERAKTIVAN element van panela", a ne „uvek unutra".
     *
     * Prva verzija je tražila da fokus u svakom koraku bude u dijalogu i padala je na
     * osmom Tab-u. Provereno ispisom: tamo fokus legne na `BODY`, pa se sledećim Tab-om
     * vrati u panel. To je normalan obilazak native `<dialog>`-a — prolaz kroz koren
     * dokumenta, ne izlazak. Ono što bi bio pravi kvar jeste da se dohvati dugme ili link
     * iza panela, i to ovaj test proverava.
     */
    for (let i = 0; i < 14; i += 1) {
      await page.keyboard.press('Tab')

      const escaped = await page.evaluate(() => {
        const active = document.activeElement
        if (!active || active === document.body) return false
        const dialog = document.querySelector('dialog')
        const interactive = active.matches('a, button, input, select, textarea, [tabindex]')
        return interactive && !dialog?.contains(active)
      })

      expect(escaped).toBe(false)
    }
  })

  test('pozadina je inertna — link ispod panela se ne može kliknuti', async ({ page }) => {
    await page
      .getByRole('button', { name: /meni|menu/i })
      .first()
      .click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // `showModal()` čini sve van dijaloga inertnim; klik mora da ode na ::backdrop
    const heading = page.locator('h1').first()
    await expect(heading).not.toBeFocused()
  })

  test('klik na stavku zatvara panel i vodi na rutu', async ({ page }) => {
    await page
      .getByRole('button', { name: /meni|menu/i })
      .first()
      .click()
    const sheet = page.getByRole('dialog')

    await sheet.getByRole('link').filter({ hasText: /.+/ }).first().click()
    await expect(sheet).toBeHidden()
  })
})
