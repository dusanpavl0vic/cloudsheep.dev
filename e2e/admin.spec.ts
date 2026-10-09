import { expect, test, type Page } from '@playwright/test'

/**
 * Admin: prijava, CRUD kroz dijalog i delimična izmena (PATCH) koja ne briše ostala polja.
 * Nalog pravi seed iz SEED_ADMIN_EMAIL/PASSWORD (CI ih postavlja); bez njih se preskače.
 */
const email = process.env.SEED_ADMIN_EMAIL
const password = process.env.SEED_ADMIN_PASSWORD

test.skip(!email || !password, 'SEED_ADMIN_EMAIL/PASSWORD nisu postavljeni')

const signIn = async (page: Page) => {
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill(email ?? '')
  await page.getByLabel('Password').fill(password ?? '')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

test.beforeEach(async ({ context, baseURL }) => {
  await context.addCookies([{ name: 'cs-admin-locale', value: 'en', url: baseURL ?? '' }])
})

test('bez sesije admin vodi na prijavu; pogrešna lozinka se javlja na formi', async ({ page }) => {
  await page.goto('/admin/messages')
  await expect(page).toHaveURL(/\/admin\/login\?expired=1$/)
  await page.getByLabel('Email').fill(email ?? '')
  await page.getByLabel('Password').fill('wrong-password-123')
  await page.locator('button[type=submit]').click()
  await expect(page.getByRole('alert')).toBeVisible()
})

test('tehnologija: dodaj kroz dijalog, izmena grupe čuva naziv, obriši', async ({ page }) => {
  await signIn(page)

  const label = `E2E Tech ${String(Date.now())}`
  await page.goto('/admin/technologies')
  await page.getByRole('button', { name: 'Add technology' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Name').fill(label)
  await dialog.getByLabel('Slug').fill(`e2e${String(Date.now())}`)
  await dialog.getByLabel('Group').selectOption('design')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog).toBeHidden()
  const row = page.locator('tbody tr', { hasText: label })
  await expect(row).toContainText('Design')

  // Izmena samo grupe (PATCH) — naziv mora da ostane.
  await row.getByRole('button', { name: `Edit: ${label}` }).click()
  await page.getByRole('dialog').getByLabel('Group').selectOption('backend')
  await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click()
  await expect(row).toContainText('Backend')
  await expect(row).toContainText(label)

  await row.getByRole('button', { name: `Delete: ${label}` }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
  await expect(page.locator('tbody tr', { hasText: label })).toHaveCount(0)
})

test('utisak: objava jednim klikom ne briše firmu i ulogu', async ({ page }) => {
  await signIn(page)

  const author = `E2E Author ${String(Date.now())}`
  await page.goto('/admin/testimonials')
  await page.getByRole('button', { name: 'Add testimonial' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Quote (English)').fill('Great work.')
  await dialog.getByLabel('Quote (Serbian)').fill('Odličan posao.')
  await dialog.getByLabel('Name').fill(author)
  await dialog.getByLabel('Company').fill('Acme')
  await dialog.getByLabel('Role (English)').fill('CTO')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog).toBeHidden()

  const row = page.locator('tbody tr', { hasText: author })
  await row.getByRole('button', { name: 'Draft' }).click()
  await expect(row.getByRole('button', { name: 'Published' })).toBeVisible()
  await page.reload()
  await expect(page.locator('tbody tr', { hasText: author })).toContainText('CTO · Acme')

  await page.locator('tbody tr', { hasText: author }).getByRole('button', { name: `Delete: ${author}` }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
  await expect(page.locator('tbody tr', { hasText: author })).toHaveCount(0)
})
