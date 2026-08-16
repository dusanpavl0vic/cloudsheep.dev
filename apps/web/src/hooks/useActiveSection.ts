import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

/**
 * Vraća id sekcije koja je trenutno u fokusu ekrana.
 *
 * Zašto observer, a ne `location.hash`: hash se menja samo na klik. Ako korisnik skroluje
 * rukom, hash ostaje na staroj sekciji i navigacija laže. Jedan mehanizam pokriva oba
 * slučaja — klik skroluje, skrol okida observer.
 *
 * `rootMargin` sužava zonu na traku ispod headera: sekcija je „aktivna" kad njen vrh
 * pređe tu liniju, ne kad se bilo koji njen piksel pojavi na ekranu.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const { pathname } = useLocation()

  // effect: IntersectionObserver — pretplata na položaj skrola, spoljni sistem
  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    // Bez sekcija nema šta da se posmatra; stanje ostaje na null iz prethodnog čišćenja
    if (elements.length === 0) return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }

        // Kad su dve sekcije istovremeno u zoni, pobeđuje ona VIŠA u dokumentu —
        // inače aktivna oznaka poskakuje napred-nazad tokom skrola
        const first = sectionIds.find((id) => visible.has(id))
        setActiveId(first ?? null)
      },
      { rootMargin: '-88px 0px -70% 0px', threshold: 0 },
    )

    elements.forEach((el) => {
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
      setActiveId(null)
    }
    // pathname je u zavisnostima jer se na drugoj ruti sekcije ne renderuju —
    // observer mora ponovo da ih potraži posle navigacije
  }, [sectionIds, pathname])

  return activeId
}
