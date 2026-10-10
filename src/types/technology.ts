export const TECHNOLOGY_GROUPS = ['frontend', 'backend', 'mobile', 'tooling', 'design'] as const
export type TechnologyGroup = (typeof TECHNOLOGY_GROUPS)[number]

export interface Technology {
  id: string
  slug: string
  label: string
  group: TechnologyGroup
  /** `null` kad logotip nije otpremljen — pločica se tada prikazuje samo kao naziv. */
  logoUrl: string | null
}

export interface AdminTechnology extends Technology {
  logoId: string | null
  sortOrder: number
}
