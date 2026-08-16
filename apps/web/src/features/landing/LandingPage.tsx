import { Reveal } from '@app/ui'

import { ContactSection } from './components/ContactSection'
import { FaqSection } from './components/FaqSection'
import { HeroSection } from './components/HeroSection'
import { InsightSection } from './components/InsightSection'
import { PricingSection } from './components/PricingSection'
import { ProcessSection } from './components/ProcessSection'
import { ServicesSection } from './components/ServicesSection'
import { StudioSection } from './components/StudioSection'
import { WorkSection } from './components/WorkSection'

export const LandingPage = () => (
  <>
    <HeroSection />
    <InsightSection />
    <Reveal>
      <StudioSection />
    </Reveal>
    <Reveal>
      <ServicesSection />
    </Reveal>
    <Reveal>
      <ProcessSection />
    </Reveal>
    <Reveal>
      <WorkSection />
    </Reveal>
    <Reveal>
      <PricingSection />
    </Reveal>
    <Reveal>
      <FaqSection />
    </Reveal>
    <Reveal>
      <ContactSection />
    </Reveal>
  </>
)
