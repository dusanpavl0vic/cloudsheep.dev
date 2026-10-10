import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  LogOut,
  Mail,
  Menu,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react'

import type { IconName } from '@/constants/icons'

/** Zatvoren spisak — samo ove ikonice ulaze u bundle (constants/icons.ts). */
export const ICONS: Record<IconName, LucideIcon> = {
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUpRight: ArrowUpRight,
  arrowDown: ArrowDown,
  check: Check,
  close: X,
  menu: Menu,
  mail: Mail,
  plus: Plus,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  logOut: LogOut,
  trash: Trash2,
  edit: Pencil,
  upload: Upload,
  download: Download,
}
