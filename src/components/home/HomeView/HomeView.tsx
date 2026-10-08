import Hero from '../Hero'
import Insight from '../Insight'
import Process from '../Process'
import Services from '../Services'
import Studio from '../Studio'
import TechRibbon from '../TechRibbon'
import type { HomeViewProps } from './HomeView.types'

/** `/` — početna: redosled sekcija iz dizajna. Podatke čita `page.tsx` na serveru. */
const HomeView = ({ technologies, profile, team }: HomeViewProps) => (
  <>
    <Hero technologies={technologies} />
    <TechRibbon technologies={technologies} />
    <Insight />
    <Studio profile={profile} team={team} />
    <Services />
    <Process />
  </>
)

export default HomeView
