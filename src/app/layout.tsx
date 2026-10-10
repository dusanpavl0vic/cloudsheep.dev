import type { ReactNode } from 'react'

/**
 * Koren je prolaz: `<html>` renderuju `[locale]/layout.tsx` i `admin/layout.tsx`, jer jezik i
 * provideri zavise od toga koji je deo aplikacije. Fajl postoji jer ga `not-found.tsx` traži.
 */
const RootLayout = ({ children }: { children: ReactNode }) => children

export default RootLayout
