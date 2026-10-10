import { EFFECT_ATTRS, PIN } from '@/constants/effects'

/**
 * Jedan korak zakačenog procesa: iz položaja skrola unutar sekcije računa koja je karta aktivna
 * i piše transform/opacity direktno na elemente (bez React rendera).
 */
export const applyPin = (pin: HTMLElement) => {
  const rect = pin.getBoundingClientRect()
  const span = rect.height - window.innerHeight
  const progress = Math.min(1, Math.max(0, -rect.top / (span > 0 ? span : 1)))

  const cards = pin.querySelectorAll<HTMLElement>(`[${EFFECT_ATTRS.pinCard}]`)
  const last = Math.max(1, cards.length) - 1
  const position = Math.min(last, progress * last * PIN.overshoot)

  cards.forEach((card) => {
    const delta = position - Number(card.getAttribute(EFFECT_ATTRS.pinCard))
    if (delta < -1) {
      card.style.transform = `translateY(${String(PIN.exitShiftPct)}%) rotate(${String(PIN.exitTiltDeg)}deg)`
      card.style.opacity = '0'
    } else if (delta < 0) {
      const k = -delta
      card.style.transform = `translateY(${String(k * PIN.exitShiftPct)}%) rotate(${String(k * PIN.exitTiltDeg)}deg)`
      card.style.opacity = String(1 - k * 0.6)
    } else {
      const k = Math.min(delta, PIN.maxStack)
      card.style.transform = `translateY(${String(-k * PIN.stackShiftPx)}px) scale(${String(1 - k * PIN.stackScale)})`
      card.style.opacity = String(Math.max(0, 1 - k * PIN.stackFade))
      card.style.filter = k > 0 ? `saturate(${String(1 - k * 0.3)})` : 'none'
    }
  })

  const fill = pin.querySelector<HTMLElement>(`[${EFFECT_ATTRS.pinFill}]`)
  if (fill) fill.style.width = `${String((position / last) * 100)}%`

  const active = Math.round(position)
  pin.querySelectorAll<HTMLElement>(`[${EFFECT_ATTRS.pinStep}]`).forEach((step) => {
    const index = Number(step.getAttribute(EFFECT_ATTRS.pinStep))
    step.style.opacity = index === active ? '1' : index < active ? '.65' : '.35'
    step.style.transform = index === active ? `translateX(${String(PIN.activeStepShiftPx)}px)` : 'none'
    if (index === active) step.setAttribute('aria-current', 'step')
    else step.removeAttribute('aria-current')
  })
}
