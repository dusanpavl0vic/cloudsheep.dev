
import { ContactSection } from '@/features/landing/components/ContactSection'
import { FaqSection } from '@/features/landing/components/FaqSection'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { InsightSection } from '@/features/landing/components/InsightSection'
import { PricingSection } from '@/features/landing/components/PricingSection'
import { ProcessSection } from '@/features/landing/components/ProcessSection'
import { ServicesSection } from '@/features/landing/components/ServicesSection'
import { StudioSection } from '@/features/landing/components/StudioSection'
import { TechMarquee } from '@/features/landing/components/TechMarquee'
import { WorkSection } from '@/features/landing/components/WorkSection'
import { Reveal } from '@app/ui'

export const LandingPage = () => (
  <>
    <HeroSection />
    <TechMarquee />
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
