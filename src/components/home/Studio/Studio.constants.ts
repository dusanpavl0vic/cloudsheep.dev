/** Vizuelni raspored karata tima oko aktivne (dizajn: pomeraj 46 %, skala −16 % po koraku, nagib 10°). */
export const TEAM_CARD = {
  shiftPct: 46,
  scaleStep: 0.16,
  minScale: 0.6,
  tiltDeg: 10,
  /** Karte dalje od ovoga se ne prikazuju. */
  maxDistance: 2,
} as const

export const cardOpacity = (distance: number) => (distance === 0 ? 1 : Math.max(0.55 - (distance - 1) * 0.2, 0.15))

export const cardTransform = (offset: number) =>
  `translateX(${String(offset * TEAM_CARD.shiftPct)}%) scale(${String(Math.max(1 - Math.abs(offset) * TEAM_CARD.scaleStep, TEAM_CARD.minScale))}) rotateY(${String(-offset * TEAM_CARD.tiltDeg)}deg)`

/** Karusel počinje od prvog člana (vlasnika studija). */
export const INITIAL_MEMBER = 0
