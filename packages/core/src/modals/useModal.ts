import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { allModalsClosed, modalClosed, modalOpened, selectModalStack } from './modal.slice'
import type { ModalId, ModalMeta, ModalPropsMap, ModalState } from './modal.types'
import { registerResolver, settleResolver } from './resolvers'

/** Minimalni oblik store-a koji ovaj hook zahteva — app sme imati i sve ostalo. */
interface StateWithModal {
  modal: ModalState
}

/**
 * Javni API modal sistema.
 *
 * `open` vraća promise koji se razrešava rezultatom modala. Time nestaje klasičan
 * `useEffect` koji sluša promenu rezultata — vidi docs/06-modals.md i docs/07 §3.
 *
 * Ovo je jedini hook u `@app/core` koji komponente smeju da zovu direktno; sve ostalo
 * ide kroz feature hookove (docs/13-hooks.md).
 */
export function useModal() {
  const dispatch = useDispatch()
  const stack = useSelector((state: StateWithModal) => selectModalStack(state))

  const open = useCallback(
    <K extends ModalId, R = unknown>(
      id: K,
      props: ModalPropsMap[K],
      meta?: ModalMeta,
    ): Promise<R | undefined> => {
      const action = modalOpened(id, props, meta)
      dispatch(action)

      return new Promise<R | undefined>((resolve) => {
        registerResolver(action.payload.key, resolve as (value: unknown) => void)
      })
    },
    [dispatch],
  )

  const close = useCallback(
    (key: string, result?: unknown): void => {
      // Razreši PRE dispatch-a — ako komponenta nestane, promise je već razrešen
      settleResolver(key, result)
      dispatch(modalClosed(key))
    },
    [dispatch],
  )

  const closeAll = useCallback((): void => {
    // Prolazak kroz ceo stack, ne samo pražnjenje — inače `await open(...)` visi zauvek
    for (const entry of stack) settleResolver(entry.key, undefined)
    dispatch(allModalsClosed())
  }, [dispatch, stack])

  const isOpen = useCallback(
    (id: ModalId): boolean => stack.some((entry) => entry.id === id),
    [stack],
  )

  return { open, close, closeAll, isOpen, stack }
}
