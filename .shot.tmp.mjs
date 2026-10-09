import { chromium } from '@playwright/test'

// node shot.mjs <url> <out> [width] [height] [fullPage] [selector]
const [url, out, w = '1440', h = '900', full = '0', selector = ''] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) } })
const logs = []
page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 300)) })
page.on('pageerror', (e) => logs.push('PAGEERROR ' + e.message.slice(0, 300)))
await page.goto(url, { waitUntil: 'load', timeout: 60000 })
await page.waitForTimeout(2500)
if (selector) {
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), selector)
  await page.waitForTimeout(1800)
}
await page.screenshot({ path: `${out}.png`, fullPage: full === '1' })
console.log(logs.length ? logs.join('\n') : 'console clean')
await browser.close()
