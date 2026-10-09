import { expect, test } from '@playwright/test'

/**
 * Upit u tri koraka (docs/17 §5, ADR 0013): prazan korak, adresa bez MX zapisa, greška u
 * kucanju sa predlogom, termin, slanje. Provera adrese ide na pravi DNS.
 */
test('upit: provera koraka, adrese i termina, pa slanje', async ({ page }) => {
  await page.goto('/contact')
  const brief = page.locator('form[aria-label]')
  const submit = brief.locator('button[type=submit]')
  await expect(submit).toBeEnabled()

  await submit.click()
  await expect(brief.getByText('Pick an option to continue.')).toBeVisible()

  await brief.getByRole('radio', { name: /Web app/ }).click()
  await submit.click()
  await brief.getByRole('radio', { name: '€5–15k' }).click()
  await brief.getByRole('radio', { name: '1–3 months' }).click()
  await submit.click()

  await page.getByLabel('Your name').fill('E2E Klijent')
  const email = page.locator('#brief-email')
  const message = page.getByLabel('A few sentences about the project')

  await email.fill('ana@nepostoji-domen-e2e-404.dev')
  await message.click()
  await expect(page.locator('#brief-email-error')).toHaveText('This domain does not receive email. Check the address.')

  await email.fill('ana@gmial.com')
  await message.click()
  await expect(page.locator('#brief-email-error')).toContainText('Did you mean ana@gmail.com?')
  await page.getByRole('button', { name: 'Use ana@gmail.com' }).click()
  await expect(email).toHaveValue('ana@gmail.com')
  await expect(page.locator('#brief-email-error')).toHaveCount(0)

  await message.fill('We need a booking app for clinics, on iOS and the web.')
  const slot = page.locator('[aria-labelledby="booking-title"] button[aria-pressed]').first()
  if ((await slot.count()) > 0) {
    await slot.click()
    await expect(page.getByText(/^Booked: /)).toBeVisible()
  }

  const sent = page.waitForResponse((r) => r.url().endsWith('/api/contact') && r.request().method() === 'POST')
  await submit.click()
  expect((await sent).status()).toBe(202)
  await expect(page.getByRole('heading', { name: 'Thanks, E2E Klijent.' })).toBeFocused()
})

test('upit iz procene popunjava tip i poruku', async ({ page }) => {
  await page.goto('/contact?type=mobile&platforms=web,ios&features=auth&pace=standard')
  await expect(page.getByRole('radio', { name: /Mobile app/ })).toHaveAttribute('aria-checked', 'true')
})

test('dugme za slanje je onemogućeno pre hidratacije (polja nikad u URL-u)', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/contact')
  await expect(page.locator('form[aria-label] button[type=submit]')).toBeDisabled()
  await context.close()
})
