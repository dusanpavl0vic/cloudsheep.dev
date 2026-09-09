import { Outlet, useLoaderData } from 'react-router'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { useDocumentHead } from '@/hooks/useDocumentHead'
import { useRouteScroll } from '@/hooks/useRouteScroll'
import type { SiteProfile } from '@/lib/site'
import { auroraVariants } from '@app/ui'

import { appBackdropVariants, appFrameVariants } from './MainLayout.variants'

interface MainLayoutProps {
  /** Landing koristi puni footer; podstranice tanki. */
  footer?: 'full' | 'slim'
}

export const MainLayout = ({ footer = 'full' }: MainLayoutProps) => {
  useRouteScroll()
  useDocumentHead()

  /*
   * Profil i kontakt linkovi stižu sa LAYOUT loader-a.
   *
   * `useLoaderData()` u layout komponenti čita loader te iste rute, pa podnožje ne mora da
   * ih prosleđuje kroz svaku stranicu. Nema `useEffect`-a i nema stanja učitavanja: router
   * je razrešio podatke pre nego što je layout renderovan (ADR 0009).
   */
  const site = useLoaderData<SiteProfile>()

  return (
    <div className={appBackdropVariants()}>
      {/*
        Ambijentalno svetlo iza stakla (docs/22 §3a). Bez njega `backdrop-blur` na karticama
        nema šta da zamuti — zamućena ravna boja je ta ista boja.

        `aria-hidden` jer je čisto dekorativan sloj; čitač ekrana nema šta da mu kaže.
      */}
      <div aria-hidden className={auroraVariants()} />
      <div className={appFrameVariants()}>
        <SiteHeader />
        {/*
          `flex flex-col` na `main`-u, ne samo `flex-1`.

          `flex-1` daje `main`-u visinu, ali `height: 100%` na detetu se protiv nje ne
          razrešava — ljuska je `min-h-dvh`, dakle visina je neodređena do posle layout-a.
          Ugnježdeni fleks to rešava: `main` sad ima svoj kontekst, pa stranica koja želi da
          popuni ekran traži `flex-1` (404 to koristi da stane u jedan ekran bez skrola).

          Za stranice sa više sekcija ništa se ne menja: blok deca u koloni se i dalje slažu
          jedno pod drugo i visinu uzimaju od sadržaja.
        */}
        <main id="main" className="flex flex-1 flex-col">
          <Outlet />
        </main>
        <SiteFooter variant={footer} site={site} />
      </div>
    </div>
  )
}
