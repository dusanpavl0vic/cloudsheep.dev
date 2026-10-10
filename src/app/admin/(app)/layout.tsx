import type { ReactNode } from 'react'

import AppShell from '@/components/admin/AppShell'

/** Sve admin stranice osim prijave: ljuska + zahtev za sesijom (`useRequireAdmin`). */
const AdminAppLayout = ({ children }: { children: ReactNode }) => <AppShell>{children}</AppShell>

export default AdminAppLayout
