// Javni API dizajn sistema (docs/adr/0005 — barrel samo na granici paketa).
//
// Komponente ovde ne znaju za domen, store ni i18n ključeve — sve primaju kroz props.
// Test: rade li u projektu bez Redux-a i bez i18n-a? (packages/ui/CLAUDE.md)

// ── ui/ — shadcn primitivi, flat po ADR 0007 ──
export { Accordion } from './ui/accordion'
export { Badge } from './ui/badge'
export { Button } from './ui/button'
export { Card, CardContent, CardHeader, CardTitle } from './ui/card'
export { Checkbox } from './ui/checkbox'
export { Container } from './ui/container'
export { Dialog } from './ui/dialog'
export { Input } from './ui/input'
export { Label } from './ui/label'
export { Select } from './ui/select'
export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
export { Textarea } from './ui/textarea'

// Varijante su javne — app ih koristi za kompoziciju bez dupliranja stila
export { accordionItemVariants } from './ui/accordion.variants'
export { badgeMarkerVariants, badgeVariants } from './ui/badge.variants'
export { buttonVariants } from './ui/button.variants'
export { containerVariants } from './ui/container.variants'
export { logoMarkVariants, logoVariants, logoWordmarkVariants } from './atoms/Logo/Logo.variants'

// ── atoms ──
export { Eyebrow } from './atoms/Eyebrow'
export { CloseIcon, MenuIcon } from './atoms/Icon'
export { Logo, SheepMark } from './atoms/Logo'
export { ProgressBar } from './atoms/ProgressBar'
export { Reveal } from './atoms/Reveal'
export { Spinner } from './atoms/Spinner'
export { StatItem } from './atoms/StatItem'
export { TextLink } from './atoms/TextLink'

// ── molecules ──
export { EmptyState } from './molecules/EmptyState'
export { FormField, type FormFieldControlProps } from './molecules/FormField'
export { PageHeader } from './molecules/PageHeader'
export { TagList, type TagListItem } from './molecules/TagList'

// ── layouts ──
export { SectionBlock } from './layouts/SectionBlock'

// ── lib ──
export { cn } from './lib/cn'
export { dottedSurfaceVariants, surfaceVariants } from './lib/surface.variants'
