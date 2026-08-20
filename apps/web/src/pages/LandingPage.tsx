import { useLoaderData } from 'react-router'

import { ContactSection } from '@/features/landing/components/ContactSection'
import { FaqSection } from '@/features/landing/components/FaqSection'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { InsightSection } from '@/features/landing/components/InsightSection'
import { PricingSection } from '@/features/landing/components/PricingSection'
import { ProcessSection } from '@/features/landing/components/ProcessSection'
import { ServicesSection } from '@/features/landing/components/ServicesSection'
import { StudioSection } from '@/features/landing/components/StudioSection'
import { TechMarquee } from '@/features/landing/components/TechMarquee'
import { TechSection } from '@/features/landing/components/TechSection'
import { WorkSection } from '@/features/landing/components/WorkSection'
import type { Project, Technology } from '@/features/projects'
import { emailOf, type SiteProfile, type TeamMember } from '@/lib/site'
import { Reveal } from '@app/ui'

export const LandingPage = () => {
  // Izdvojeni projekti i tehnologije stižu iz loader-a rute, pre rendera (ADR 0009)
  const { featured, technologies, site, team } = useLoaderData<{
    featured: Project[]
    technologies: Technology[]
    site: SiteProfile
    team: TeamMember[]
  }>()

  return (
    <>
      <HeroSection technologies={technologies} />
      <TechMarquee technologies={technologies} />
      <InsightSection />
      <Reveal>
        <StudioSection profile={site.profile} team={team} />
      </Reveal>
      <Reveal>
        <ServicesSection />
      </Reveal>
      <Reveal>
        <ProcessSection />
      </Reveal>
      <Reveal>
        <WorkSection projects={featured} />
      </Reveal>
      <Reveal>
        <TechSection technologies={technologies} />
      </Reveal>
      <Reveal>
        <PricingSection />
      </Reveal>
      <Reveal>
        <FaqSection />
      </Reveal>
      <Reveal>
        <ContactSection email={emailOf(site)} />
      </Reveal>
    </>
  )
}
