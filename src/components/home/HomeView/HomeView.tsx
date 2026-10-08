import { useTranslations } from 'next-intl'

/** `/` — početna. Sekcije stižu u fazi F4; ovo je kostur koji proverava ljusku. */
const HomeView = () => {
  const t = useTranslations('meta.home')

  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
  )
}

export default HomeView
