/**
 * JS budžet javnih ruta (docs/07-performance.md §6, ADR 0014): zbir gzip veličina SVIH
 * skripti koje pregledač preuzme pri prvom otvaranju stranice mora biti ≤ 200 KB.
 *
 * Meri se u PRAVOM pregledaču (Playwright/Chromium), jer App Router deo chunk-ova učitava iz
 * runtime-a, ne kroz `<script>` u HTML-u — brojanje tagova ih ne vidi. Prefetch susednih ruta
 * (`?_rsc=`, posle hidratacije) se blokira: to nije početni JS. `noModule` polyfill-e moderan
 * pregledač ni ne preuzima.
 *
 *   pnpm build && pnpm size                          # podiže `next start` sama
 *   SIZE_BASE_URL=http://localhost:3000 pnpm size    # meri već pokrenut server
 */
import { spawn } from 'node:child_process'
import { gzipSync } from 'node:zlib'

import { chromium } from '@playwright/test'

const BUDGET_KB = 200
const PORT = 3311
const ROUTES = ['/', '/sr', '/projects', '/notes', '/contact', '/sr/contact']
const VERBOSE = process.argv.includes('--verbose')

const external = process.env.SIZE_BASE_URL
const base = external ?? `http://localhost:${PORT}`

const isUp = async () => {
  try {
    return (await fetch(`${base}/api/health`)).ok
  } catch {
    return false
  }
}

// Zaostali server sa istog porta bi merio STARI build — bolje odbiti nego tiho lagati.
if (!external && (await isUp())) {
  console.error(`Port ${PORT} je zauzet (stari server?). Ugasi ga ili zadaj SIZE_BASE_URL.`)
  process.exit(1)
}

// `next` direktno (bez pnpm-a) i u sopstvenoj grupi procesa — gasi se cela grupa.
const server = external
  ? null
  : spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT)], {
      stdio: 'ignore',
      // `.env` za lokalni razvoj može da nosi NODE_ENV=development — produkcioni server ga ne sme naslediti.
      env: { ...process.env, NODE_ENV: 'production' },
      detached: true,
    })

const waitForServer = async () => {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await isUp()) return
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Server na ${base} se nije podigao za 60 s.`)
}

const measure = async (browser, route) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.route(/[?&]_rsc=/, (request) => request.abort())
  const scripts = new Map()
  page.on('response', async (response) => {
    if (response.request().resourceType() !== 'script') return
    try {
      scripts.set(response.url(), gzipSync(await response.body()).length / 1024)
    } catch {
      // odgovor bez tela (preusmerenje) — nije skripta
    }
  })
  const response = await page.goto(new URL(route, base).href, { waitUntil: 'load' })
  await page.waitForTimeout(500)
  await page.close()
  return { status: response?.status() ?? 0, scripts }
}

let failed = false
let browser
try {
  await waitForServer()
  browser = await chromium.launch()
  console.log(`JS budžet: ${BUDGET_KB} KB gzip po ruti\n`)
  for (const route of ROUTES) {
    const { status, scripts } = await measure(browser, route)
    if (status !== 200) {
      console.log(`✗ ${route.padEnd(16)} HTTP ${status}`)
      failed = true
      continue
    }
    const total = [...scripts.values()].reduce((sum, kb) => sum + kb, 0)
    const ok = total <= BUDGET_KB
    if (!ok) failed = true
    console.log(`${ok ? '✓' : '✗'} ${route.padEnd(16)} ${total.toFixed(1).padStart(7)} KB  (${scripts.size} skripti)`)
    if (VERBOSE) {
      for (const [url, kb] of [...scripts].sort((a, b) => b[1] - a[1])) {
        console.log(`      ${kb.toFixed(1).padStart(6)} KB  ${decodeURIComponent(url.split('/_next/static/chunks/')[1] ?? url)}`)
      }
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  failed = true
} finally {
  await browser?.close()
  if (server?.pid) process.kill(-server.pid, 'SIGTERM')
}

process.exit(failed ? 1 : 0)
