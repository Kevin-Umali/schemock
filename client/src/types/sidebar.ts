import type * as React from 'react'
import type { ButtonProps } from '@/components/ui/button'
import type { useRender } from '@base-ui/react/use-render'
import type { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import type { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import type { VariantProps } from 'class-variance-authority'
import type { sidebarMenuButtonVariants } from '@/utils/sidebar-variants'

export type SidebarState = 'expanded' | 'collapsed'
export type SidebarSide = 'left' | 'right'
export type SidebarVariant = 'sidebar' | 'floating' | 'inset'
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none'

export interface SidebarContextValue {
  state: SidebarState
  open: boolean
  setOpen: (open: React.SetStateAction<boolean>) => void
  openMobile: boolean
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
  toggleSidebar: () => void
}

export type SidebarProviderProps = React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type SidebarProps = React.ComponentProps<'div'> & {
  side?: SidebarSide
  variant?: SidebarVariant
  collapsible?: SidebarCollapsible
  dir?: 'ltr' | 'rtl'
}

export type SidebarTriggerProps = ButtonProps
export type SidebarRailProps = React.ComponentProps<'button'>
export type SidebarInsetProps = React.ComponentProps<'div'>
export type SidebarInputProps = React.ComponentProps<'input'>
export type SidebarHeaderProps = React.ComponentProps<'div'>
export type SidebarFooterProps = React.ComponentProps<'div'>
export type SidebarSeparatorProps = SeparatorPrimitive.Props & { decorative?: boolean }
export type SidebarContentProps = React.ComponentProps<'div'>
export type SidebarGroupProps = React.ComponentProps<'div'>
export type SidebarGroupLabelProps = useRender.ComponentProps<'div'> & React.ComponentProps<'div'>
export type SidebarGroupActionProps = useRender.ComponentProps<'button'> & React.ComponentProps<'button'>
export type SidebarGroupContentProps = React.ComponentProps<'div'>
export type SidebarMenuProps = React.ComponentProps<'ul'>
export type SidebarMenuItemProps = React.ComponentProps<'li'>
export type SidebarMenuButtonProps = useRender.ComponentProps<'button'> &
  React.ComponentProps<'button'> & {
    isActive?: boolean
    tooltip?: string | SidebarTooltipPopupProps
  } & VariantProps<typeof sidebarMenuButtonVariants>
export type SidebarTooltipPopupProps = React.ComponentProps<typeof TooltipPrimitive.Popup>
export type SidebarMenuActionProps = useRender.ComponentProps<'button'> &
  React.ComponentProps<'button'> & {
    showOnHover?: boolean
  }
export type SidebarMenuBadgeProps = React.ComponentProps<'div'>
export type SidebarMenuSkeletonProps = React.ComponentProps<'div'> & {
  showIcon?: boolean
}
export type SidebarMenuSubProps = React.ComponentProps<'ul'>
export type SidebarMenuSubItemProps = React.ComponentProps<'li'>
export type SidebarMenuSubButtonProps = useRender.ComponentProps<'a'> &
  React.ComponentProps<'a'> & {
    size?: 'sm' | 'md'
    isActive?: boolean
  }
