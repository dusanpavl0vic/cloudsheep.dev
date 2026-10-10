'use client'

import CarouselControls from '@/components/navigation/CarouselControls'
import { useCarousel } from '@/hooks/useCarousel'
import type { TeamMember } from '@/types/team'

import Diploma from './Diploma'
import { cardOpacity, cardTransform, INITIAL_MEMBER, TEAM_CARD } from './Studio.constants'
import { Avatar, Card, Name, Person, Pick, Role, Stage } from './TeamCarousel.styles'

interface TeamCarouselProps {
  team: TeamMember[]
  labels: { previous: string; next: string; noDiploma: string; show: string[] }
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

/** Karte tima u 3D lepezi; aktivna prikazuje diplomu. Neaktivne su skrivene od čitača ekrana. */
const TeamCarousel = ({ team, labels }: TeamCarouselProps) => {
  const { active, goTo, next, prev, offsetOf } = useCarousel(team.length, INITIAL_MEMBER)

  return (
    <>
      <Stage>
        {team.map((member, index) => {
          const offset = offsetOf(index)
          const distance = Math.abs(offset)
          if (distance > TEAM_CARD.maxDistance) return null
          const current = distance === 0

          return (
            <Card
              key={member.id}
              $distance={distance}
              style={{ transform: cardTransform(offset), opacity: cardOpacity(distance) }}
              aria-hidden={!current || undefined}
            >
              <Person>
                <Avatar>
                  {member.avatar ? (
                    <img src={member.avatar.url} alt="" width={84} height={84} loading="lazy" />
                  ) : (
                    initials(member.fullName)
                  )}
                </Avatar>
                <Name>{member.fullName}</Name>
                <Role>{member.role}</Role>
              </Person>
              {current && <Diploma diploma={member.diploma} emptyLabel={labels.noDiploma} />}
              {!current && (
                <Pick
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    goTo(index)
                  }}
                />
              )}
            </Card>
          )
        })}
      </Stage>
      <CarouselControls
        count={team.length}
        active={active}
        onPrev={prev}
        onNext={next}
        onPick={goTo}
        prevLabel={labels.previous}
        nextLabel={labels.next}
        dotLabel={(index) => labels.show[index] ?? ''}
      />
    </>
  )
}

export default TeamCarousel
