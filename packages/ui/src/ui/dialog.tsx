import type { VariantProps } from 'class-variance-authority'
import { useEffect, useId, useRef, type ReactNode } from 'react'

import {
  dialogBodyVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogTitleVariants,
  dialogVariants,
} from './dialog.variants'
import { cn } from '../lib/cn'

interface DialogProps extends VariantProps<typeof dialogVariants> {
  open: boolean
  /** Zove se i na `Esc`, i na klik po pozadini, i na dugme za zatvaranje. */
  onClose: () => void
  title: ReactNode
  children: ReactNode
  /** Dugmad. Bez njih se podnožje ne renderuje. */
  footer?: ReactNode
  /** `false` znači da se ne može zatvoriti bez odluke — potvrda destruktivne akcije. */
  dismissible?: boolean
  className?: string
}

/**
 * Native `<dialog>` sa `showModal()`, ne Radix.
 *
 * Platforma sama daje zamku fokusa, `Esc`, inertnu pozadinu i `::backdrop` — sve zbog čega
 * se dijalog obično uzima iz biblioteke. `@radix-ui/react-dialog` bi to isto doneo kao
 * ~25 KB zavisnost. Isti izbor koji `apps/web` već pravi u `useNativeDialog`
 * („Prvo platforma, pa biblioteka", `apps/web/CLAUDE.md`).
 *
 * Komponenta je **kontrolisana**: otvorenost drži pozivalac. U `admin`-u je to Redux modal
 * engine (`useModal` iz `@app/core`), pa `packages/ui` ne mora — i ne sme — da zna za store.
 */
export const Dialog = ({
  open,
  onClose,
  title,
  children,
  footer,
  dismissible = true,
  size,
  className,
}: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // effect: sinhronizacija `open` propsa sa DOM čvorom dijaloga — spoljni sistem.
  // `showModal()` se ne sme pozvati dvaput; bez provere `el.open` jsdom i Chrome bacaju
  // InvalidStateError pri svakom ponovnom renderu dok je dijalog otvoren.
  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  // effect: slušanje događaja na DOM čvoru dijaloga — spoljni sistem.
  // `close` pokriva i `Esc` i programsko zatvaranje, pa je jedino mesto koje javlja gore.
  // Klik po pozadini je jedina stvar koju native `<dialog>` NE radi sam: cilj klika je
  // tada sam `<dialog>`, jer sadržaj stoji u detetu.
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleClose = () => {
      onClose()
    }
    const handleClick = (event: MouseEvent) => {
      if (dismissible && event.target === el) el.close()
    }
    const handleCancel = (event: Event) => {
      if (!dismissible) event.preventDefault()
    }

    el.addEventListener('close', handleClose)
    el.addEventListener('click', handleClick)
    el.addEventListener('cancel', handleCancel)
    return () => {
      el.removeEventListener('close', handleClose)
      el.removeEventListener('click', handleClick)
      el.removeEventListener('cancel', handleCancel)
    }
  }, [onClose, dismissible])

  return (
    <dialog ref={ref} aria-labelledby={titleId} className={cn(dialogVariants({ size }), className)}>
      <div className={dialogHeaderVariants()}>
        <h2 id={titleId} className={dialogTitleVariants()}>
          {title}
        </h2>
      </div>

      <div className={dialogBodyVariants()}>{children}</div>

      {footer && <div className={dialogFooterVariants()}>{footer}</div>}
    </dialog>
  )
}
