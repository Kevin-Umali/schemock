import { createContext } from 'react'
import type { SidebarContextValue } from '@/types/sidebar'

export const SidebarContext = createContext<SidebarContextValue | null>(null)
