import { expect, test } from '@playwright/test'

/** Prijava u podnožju: adresa bez MX zapisa se odbija na polju, ispravna prolazi (ADR 0013). */
test('newsletter: loš domen se odbija, ispravna adresa prolazi', async ({ page }) => {
  await page.goto('/')
  const field = page.getByLabel('Email for the newsletter')
  const form = page.locator('form', { has: field })
  await expect(form.locator('button[type=submit]')).toBeEnabled()

  await field.fill('pera@nepostoji-domen-e2e-404.dev')
  await form.locator('button[type=submit]').click()
  await expect(form.getByText('This domain does not receive email. Check the address.')).toBeVisible()

  const sent = page.waitForResponse((r) => r.url().endsWith('/api/newsletter') && r.request().method() === 'POST')
  await field.fill(`e2e.${String(Date.now())}@gmail.com`)
  await form.locator('button[type=submit]').click()
  expect((await sent).status()).toBeLessThan(300)
})
