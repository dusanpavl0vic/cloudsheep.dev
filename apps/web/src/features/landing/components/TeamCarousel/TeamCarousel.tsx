import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CredentialSeal } from '@/components/CredentialSeal'
import { localize } from '@/features/projects'
import type { TeamMember } from '@/lib/site'

import {
  arrowVariants,
  avatarVariants,
  carouselCardVariants,
  carouselStageVariants,
  carouselWrapVariants,
  dotVariants,
  dotsVariants,
  memberHeadVariants,
  memberNameVariants,
  memberRoleVariants,
  noDiplomaVariants,
} from './TeamCarousel.variants'

interface TeamCarouselProps {
  members: readonly TeamMember[]
}

/** Inicijali kad slike nema — prazan krug izgleda kao greška u učitavanju. */
const initials = (fullName: string) =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

/**
 * Najkraće rastojanje do centra, u krug.
 *
 * Kod pet članova i aktivnog prvog, poslednji je udaljen **−1**, ne +4: tako se pri prelasku
 * sa poslednjeg na prvi kartice vrte u istom smeru umesto da prelete ceo niz unazad.
 */
const circularOffset = (index: number, active: number, total: number) => {
  const raw = index - active
  const half = Math.floor(total / 2)

  if (raw > half) return raw - total
  if (raw < -half) return raw + total
  return raw
}

/** Pomeraj, umanjenje i providnost po rastojanju od centra. */
const cardStyle = (offset: number) => {
  const distance = Math.abs(offset)

  return {
    // Bočne kartice idu iza centralne i blago se okreću — otud utisak dubine
    transform: `translateX(${String(offset * 46)}%) scale(${String(Math.max(1 - distance * 0.16, 0.6))})`,
    opacity: distance === 0 ? 1 : Math.max(0.55 - (distance - 1) * 0.2, 0.15),
    zIndex: 20 - distance,
    // Treća i dalje se ne renderuju — na ekranu ionako nisu, a nose slike i tekst
    display: distance > 2 ? 'none' : undefined,
  }
}

/**
 * Tim kao ringišpil: jedna kartica u centru, ostale umanjene sa strane.
 *
 * **Pomeranje je ručno** — strelice, tastatura, prevlačenje prstom, klik na bočnu karticu.
 * Automatsko klizanje bi nad tekstom koji treba pročitati bilo smetnja, ne efekat.
 *
 * Vrti se **u krug**: sa poslednjeg se ide na prvog, bez skoka unazad. Rastojanje računa
 * `circularOffset`, pa smer animacije uvek prati smer klika.
 */
export const TeamCarousel = ({ members }: TeamCarouselProps) => {
  const { t, i18n } = useTranslation('landing')
  const [active, setActive] = useState(0)
  const touchStartX = useRef<number | null>(null)

  if (members.length === 0) return null

  const total = members.length
  const canRotate = total > 1

  const go = (direction: -1 | 1) => {
    setActive((current) => (current + direction + total) % total)
  }

  return (
    <div className={carouselWrapVariants()}>
      {canRotate && (
        <button
          type="button"
          aria-label={t('studio.team.previous')}
          className={arrowVariants({ side: 'start' })}
          onClick={() => {
            go(-1)
          }}
        >
          ←
        </button>
      )}

      <div
        className={carouselStageVariants()}
        {...(canRotate
          ? {
              // Fokusabilan region: bez ovoga se ringišpil ne može okretati tastaturom
              tabIndex: 0,
              role: 'region',
              'aria-roledescription': 'carousel',
              'aria-label': t('studio.team.label'),
              onKeyDown: (event: React.KeyboardEvent) => {
                if (event.key === 'ArrowLeft') go(-1)
                if (event.key === 'ArrowRight') go(1)
              },
              onTouchStart: (event: React.TouchEvent) => {
                touchStartX.current = event.touches[0]?.clientX ?? null
              },
              onTouchEnd: (event: React.TouchEvent) => {
                const start = touchStartX.current
                const end = event.changedTouches[0]?.clientX
                touchStartX.current = null
                if (start === null || end === undefined) return

                // Prag od 40px: kratak dodir pri skrolovanju ne sme da pomeri ringišpil
                const delta = end - start
                if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1)
              },
            }
          : {})}
      >
        {members.map((member, index) => {
          const offset = circularOffset(index, active, total)
          const isActive = offset === 0

          return (
            <div
              key={member.id}
              className={carouselCardVariants({ active: isActive })}
              style={cardStyle(offset)}
              // Bočne kartice su van reda čitanja — u centru je uvek tačno jedna.
              // `inert` bi bio tačniji (gasi i fokus), ali ga React tipovi u ovoj verziji
              // još ne poznaju; `pointer-events-none` u varijanti pokriva isti slučaj.
              aria-hidden={!isActive}
            >
              <div className={memberHeadVariants()}>
                <span className={avatarVariants()}>
                  {member.avatar ? (
                    <img
                      src={member.avatar.url}
                      alt=""
                      width={member.avatar.width}
                      height={member.avatar.height}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  ) : (
                    initials(member.fullName)
                  )}
                </span>

                <span>
                  <span className={`block ${memberNameVariants()}`}>{member.fullName}</span>
                  {localize(member.role, i18n.language) && (
                    <span className={`block ${memberRoleVariants()}`}>
                      {localize(member.role, i18n.language)}
                    </span>
                  )}
                </span>
              </div>

              {/*
                Diploma se prikazuje SAMO na centralnoj kartici.

                U daljini je nečitka — umanjena i providna — a nosi pet redova sitnog teksta
                i pečat, pa bočne kartice deluju kao mrlje. Ovako pažnja ostaje na sredini, a
                sa strane se vide lice i ime, što je dovoljno da se prepozna ko sledi.

                Prazan okvir umesto ničega kad član nema diplomu: bez njega je ta kartica
                upola niža, pa ringišpil poskakuje pri okretanju.
              */}
              {isActive &&
                (member.diploma ? (
                  <CredentialSeal
                    layout="slide"
                    university={localize(member.diploma.university, i18n.language)}
                    degree={localize(member.diploma.degree, i18n.language)}
                    programme={localize(member.diploma.programme, i18n.language)}
                    faculty={localize(member.diploma.faculty, i18n.language)}
                    city={member.diploma.city}
                    logo={member.diploma.sealUrl}
                  />
                ) : (
                  <span className={noDiplomaVariants()}>{t('studio.team.noDiploma')}</span>
                ))}
            </div>
          )
        })}
      </div>

      {canRotate && (
        <button
          type="button"
          aria-label={t('studio.team.next')}
          className={arrowVariants({ side: 'end' })}
          onClick={() => {
            go(1)
          }}
        >
          →
        </button>
      )}

      {canRotate && (
        <div className={dotsVariants()}>
          {members.map((member, index) => (
            <button
              key={member.id}
              type="button"
              aria-label={member.fullName}
              aria-current={index === active}
              className={dotVariants({ active: index === active })}
              onClick={() => {
                setActive(index)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
