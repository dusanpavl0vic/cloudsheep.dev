import type { TeamDiploma } from '@/types/team'

import { Degree, Empty, Frame, Paper, Place, Programme, Rule, Seal, University } from './Diploma.styles'

interface DiplomaProps {
  diploma: TeamDiploma | null
  /** Tekst kad član nema diplomu. */
  emptyLabel: string
}

/** Diploma aktivnog člana tima — papir sa okvirom i pečatom. */
const Diploma = ({ diploma, emptyLabel }: DiplomaProps) => {
  if (!diploma) return <Empty>{emptyLabel}</Empty>

  return (
    <Paper>
      <Frame>
        <University>{diploma.university}</University>
        <Degree>{diploma.degree}</Degree>
        <Programme>{diploma.programme}</Programme>
        <Rule aria-hidden="true" />
        <Place>
          {diploma.faculty}
          {diploma.city && ` · ${diploma.city}`}
        </Place>
        {diploma.sealUrl && <Seal src={diploma.sealUrl} alt="" width={104} height={104} loading="lazy" />}
      </Frame>
    </Paper>
  )
}

export default Diploma
