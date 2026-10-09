import type { ReactNode } from 'react'

import type { BriefBudget, BriefTimeline, BriefType } from '@/constants/contact'
import type { EstimateInput } from '@/helpers/estimator'

export interface BriefFormProps {
  /** Serverski deo leve kolone (naslov, adresa, lokalno vreme) — ide iznad kartice termina. */
  intro: ReactNode
  defaults: {
    projectType: BriefType | null
    budget: BriefBudget | null
    timeline: BriefTimeline | null
    message: string
    estimate: EstimateInput | null
  }
}
