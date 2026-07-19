import { ContactSection } from './components/ContactSection'
import { FaqSection } from './components/FaqSection'
import { HeroSection } from './components/HeroSection'
import { PricingSection } from './components/PricingSection'
import { ProcessSection } from './components/ProcessSection'
import { ServicesSection } from './components/ServicesSection'
import { StudioSection } from './components/StudioSection'
import { WorkSection } from './components/WorkSection'

export const LandingPage = () => (
  <>
    <HeroSection />
    <StudioSection />
    <ServicesSection />
    <ProcessSection />
    <WorkSection />
    <PricingSection />
    <FaqSection />
    <ContactSection />
  </>
)
