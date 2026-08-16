import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, type UserConfig } from 'vite'

interface CreateViteConfigOptions {
  /** Koren aplikacije — prosledi `import.meta.url` iz app-ovog vite.config.ts */
  appDir: string
  /** Dodatna podešavanja koja se plitko spajaju preko preseta */
  overrides?: UserConfig
}

/** Paketi koji idu u zajednički vendor chunk (docs/07 §6 — ne previše granularno). */
const VENDOR_CHUNKS: [chunk: string, matches: string[]][] = [
  ['react-vendor', ['/react/', '/react-dom/', '/react-router/', '/scheduler/']],
  ['redux-vendor', ['/@reduxjs/toolkit/', '/react-redux/', '/immer/', '/redux/']],
]

/**
 * Deljeni Vite preset za sve app-e i packages/ui.
 *
 * React Compiler je uključen (ADR 0001). Vite 8 koristi rolldown i `@vitejs/plugin-react` v6
 * više NEMA `babel` opciju — JSX transform radi oxc. Babel, koji compiler zahteva, ulazi kao
 * zaseban plugin kroz `@rolldown/plugin-babel`. Namera iz SPEC §2 ("Babel, ne SWC") je
 * očuvana; menja se samo mehanika. Vidi docs/16-tooling-ci.md §1.1.
 */
export function createViteConfig({ appDir, overrides = {} }: CreateViteConfigOptions) {
  const srcPath = fileURLToPath(new URL('./src', appDir))

  return defineConfig({
    plugins: [
      react(),
      babel({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      }),
      tailwindcss(),
    ],

    resolve: {
      alias: { '@': srcPath },
    },

    build: {
      /**
       * `hidden` — mape se generišu, ali bez `//# sourceMappingURL` komentara u bundle-u.
       *
       * Bilo je `true`, što znači 24 `.map` fajla u produkciji i ceo izvorni kod čitljiv
       * iz DevTools-a svakom posetiocu. `false` bi to rešilo, ali bi oborilo i
       * `scripts/check-size.mjs` i svaku analizu sastava bundle-a — a budžet je tesan i
       * meri se iz mapa.
       *
       * Granica poštenja: fajlovi i dalje stoje na serveru i mogu se povući ako se pogodi
       * ime. Ovo skriva izvor od slučajnog pogleda, ne od nekoga ko ga traži.
       */
      sourcemap: 'hidden',
      rollupOptions: {
        output: {
          // rolldown prihvata samo funkciju, ne objekat-mapu kao rollup
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined
            const hit = VENDOR_CHUNKS.find(([, matches]) => matches.some((m) => id.includes(m)))
            return hit?.[0]
          },
        },
      },
    },

    ...overrides,
  })
}
