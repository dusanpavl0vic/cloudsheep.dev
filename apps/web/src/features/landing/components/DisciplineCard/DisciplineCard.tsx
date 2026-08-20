import { glowPanelProps } from '@/hooks/usePointerGlow'
import { TagList } from '@app/ui'

import { PANEL_GLOW } from './DisciplineCard.constants'
import {
  panelGhostVariants,
  panelGlowVariants,
  panelScanVariants,
  panelSlugVariants,
  panelTagsVariants,
  panelTextVariants,
  panelTickVariants,
  panelTitleVariants,
  panelVariants,
} from './DisciplineCard.variants'

interface DisciplineCardProps {
  /** Redni broj, dvocifren — crta se kao duh u pozadini. */
  no: string
  /** Kratka oznaka discipline (`design`, `web`…). Nije prevod: ista je na svim jezicima. */
  slug: string
  title: string
  description: string
  tags: readonly string[]
}

/**
 * Jedan panel u matrici disciplina.
 *
 * Panel NIJE link i namerno nema strelicu: nema stranice po disciplini, a strelica koja ne
 * vodi nikuda je obećanje koje se ne ispuni. Da se panel oseti živim brine svetlo pod
 * kursorom, nit po gornjoj ivici i ugaonici — dakle povratna informacija bez lažne afordanse.
 *
 * Dekoracija (`svetlo`, `nit`, `ugaonici`, `duh-numeral`) je van pristupačnog stabla: sve što
 * ona znači već stoji u tekstu. Screen reader čita oznaku, naslov, opis i oznake tehnologija.
 */
export const DisciplineCard = ({ no, slug, title, description, tags }: DisciplineCardProps) => (
  <article {...glowPanelProps} className={panelVariants()}>
    <span aria-hidden className={panelGlowVariants()} style={{ backgroundImage: PANEL_GLOW }} />
    <span aria-hidden className={panelScanVariants()} />
    <span aria-hidden className={panelTickVariants({ corner: 'end' })} />
    <span aria-hidden className={panelTickVariants({ corner: 'start' })} />
    <span aria-hidden data-no={no} className={panelGhostVariants()} />

    <p className={panelSlugVariants()}>{slug}</p>
    <h3 className={panelTitleVariants()}>{title}</h3>
    <p className={panelTextVariants()}>{description}</p>

    <TagList tags={tags} variant="soft" shape="square" size="sm" className={panelTagsVariants()} />
  </article>
)
