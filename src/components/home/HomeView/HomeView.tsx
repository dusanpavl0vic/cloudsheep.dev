import Faq from '../Faq'
import Hero from '../Hero'
import Insight from '../Insight'
import Pricing from '../Pricing'
import Process from '../Process'
import Services from '../Services'
import Stack from '../Stack'
import Studio from '../Studio'
import TechRibbon from '../TechRibbon'
import Testimonials from '../Testimonials'
import Work from '../Work'
import type { HomeViewProps } from './HomeView.types'

/** `/` — početna: redosled sekcija iz dizajna. Podatke čita `page.tsx` na serveru. */
const HomeView = ({ technologies, profile, team, projects, testimonials }: HomeViewProps) => (
  <>
    <Hero technologies={technologies} />
    <TechRibbon technologies={technologies} />
    <Insight />
    <Studio profile={profile} team={team} />
    <Services />
    <Process />
    <Work projects={projects} />
    <Testimonials testimonials={testimonials} />
    <Stack technologies={technologies} />
    <Pricing />
    <Faq />
  </>
)

export default HomeView
