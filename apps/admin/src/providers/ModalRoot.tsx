import { Suspense, useEffect, type ComponentType } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'

import type { RootState } from '@/store'
import { selectModalStack, useModal } from '@app/core'

import { modalRegistry } from './modalRegistry'

/**
 * Jedini renderer modala. Montira se jednom, u `AppProviders`, ispod router-a.
 *
 * Sam ne crta okvir — svaki modal renderuje svoj `<Dialog>` iz `@app/ui`, pa ima svoj
 * naslov i svoju dugmad. Ovde ostaje samo ono što je zajedničko: čitanje stack-a iz
 * Redux-a i sprovođenje rezultata nazad kroz `close`.
 */
export function ModalRoot() {
  const stack = useSelector((state: RootState) => selectModalStack(state))
  const { close, closeAll } = useModal()
  const { pathname } = useLocation()

  // effect: router — modali se ne smeju preneti preko navigacije.
  // Ovo je JEDINI useEffect u modal sistemu (docs/06-modals.md).
  useEffect(() => {
    closeAll()
    // closeAll zavisi od stack-a; uključivanje bi zatvaralo modal čim se otvori
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (stack.length === 0) return null

  return (
    <>
      {stack.map((entry) => {
        // Registry čuva komponente sa različitim propsima; tip para `ModalPropsMap`,
        // pa je ovde svođenje na zajednički potpis neizbežno i bezbedno.
        const Component = modalRegistry[entry.id as keyof typeof modalRegistry] as unknown as
          ComponentType<Record<string, unknown>> | undefined

        if (!Component) return null

        return (
          <Suspense key={entry.key} fallback={null}>
            <Component
              {...(entry.props as Record<string, unknown>)}
              onClose={(result: unknown) => {
                close(entry.key, result)
              }}
            />
          </Suspense>
        )
      })}
    </>
  )
}
