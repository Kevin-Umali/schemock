import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import type * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { PanelLeftIcon, X } from 'lucide-react'
import {
  SIDEBAR_DEFAULT_OPEN,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_STORAGE_KEY,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_WIDTH_MOBILE,
} from '@/constants/sidebar'
import { SidebarContext } from '@/context/sidebar-context'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useSidebar } from '@/hooks/use-sidebar'
import type {
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupActionProps,
  SidebarGroupContentProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarHeaderProps,
  SidebarInsetProps,
  SidebarInputProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubButtonProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarState,
  SidebarProps,
  SidebarTriggerProps,
} from '@/types/sidebar'
import { sidebarMenuButtonVariants } from '@/utils/sidebar-variants'
import { isSidebarOpen } from '@/utils/sidebar'
import { cn } from '@/utils/classes'

const SidebarProvider: React.FC<SidebarProviderProps> = ({
  defaultOpen = SIDEBAR_DEFAULT_OPEN,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) => {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)
  const { value: storedOpen, setValue: setStoredOpen } = useLocalStorage<boolean>(
    SIDEBAR_STORAGE_KEY,
    (savedValue) => savedValue ?? defaultOpen,
    isSidebarOpen,
  )
  const open = openProp ?? storedOpen
  const setOpen = useCallback(
    (value: React.SetStateAction<boolean>) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        setStoredOpen(openState)
      }
    },
    [setOpenProp, open, setStoredOpen],
  )
  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((current) => !current) : setOpen((current) => !current)
  }, [isMobile, setOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const isEditable =
        target instanceof HTMLElement &&
        (target.isContentEditable || target.closest("input, textarea, select, [contenteditable='true']"))
      if (isEditable || event.repeat || event.altKey || event.shiftKey) return
      if (event.key.toLowerCase() !== SIDEBAR_KEYBOARD_SHORTCUT || (!event.metaKey && !event.ctrlKey)) return
      event.preventDefault()
      toggleSidebar()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  const state: SidebarState = open ? 'expanded' : 'collapsed'
  const contextValue = useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot='sidebar-wrapper'
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn('group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar', className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

const Sidebar: React.FC<SidebarProps> = ({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  dir,
  ...props
}) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        data-slot='sidebar'
        className={cn('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground', className)}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          dir={dir}
          data-sidebar='sidebar'
          data-slot='sidebar'
          data-mobile='true'
          className='w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground'
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className='sr-only'>
          <SheetTitle>Workspace navigation</SheetTitle>
          <SheetDescription>Choose a generator or a tool.</SheetDescription>
          </SheetHeader>
          <SheetClose
            aria-label='Close navigation'
            className='absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring'
          >
            <X aria-hidden='true' />
          </SheetClose>
          <div className='flex h-full w-full flex-col'>{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className='group peer hidden text-sidebar-foreground md:block'
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot='sidebar'
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot='sidebar-gap'
        className={cn(
          'relative w-(--sidebar-width) bg-transparent',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      />
      <div
        data-slot='sidebar-container'
        data-side={side}
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar='sidebar'
          data-slot='sidebar-inner'
          className='flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border'
        >
          {children}
        </div>
      </div>
    </div>
  )
}

const SidebarTrigger: React.FC<SidebarTriggerProps> = ({ className, onClick, ...props }) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar='trigger'
      data-slot='sidebar-trigger'
      aria-keyshortcuts='Control+B Meta+B'
      title='Toggle sidebar (Ctrl+B or Command+B)'
      variant='ghost'
      size='icon'
      className={cn('size-11 md:size-9', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  )
}

const SidebarRail: React.FC<SidebarRailProps> = ({ className, ...props }) => {
  const { toggleSidebar, isMobile } = useSidebar()
  if (isMobile) return null

  return (
    <button
      data-sidebar='rail'
      data-slot='sidebar-rail'
      aria-label='Toggle Sidebar'
      tabIndex={0}
      onClick={toggleSidebar}
      title='Toggle Sidebar'
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  )
}

const SidebarInset: React.FC<SidebarInsetProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-inset'
      className={cn(
        'relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className,
      )}
      {...props}
    />
  )
}

const SidebarInput: React.FC<SidebarInputProps> = ({ className, ...props }) => {
  return (
    <Input
      data-slot='sidebar-input'
      data-sidebar='input'
      className={cn('h-8 w-full bg-background shadow-none', className)}
      {...props}
    />
  )
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-header'
      data-sidebar='header'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-footer'
      data-sidebar='footer'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  )
}

const SidebarSeparator: React.FC<SidebarSeparatorProps> = ({ className, ...props }) => {
  return (
    <Separator
      data-slot='sidebar-separator'
      data-sidebar='separator'
      className={cn('mx-2 w-auto bg-sidebar-border', className)}
      {...props}
    />
  )
}

const SidebarContent: React.FC<SidebarContentProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-content'
      data-sidebar='content'
      className={cn(
        'no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  )
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-group'
      data-sidebar='group'
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  )
}

const SidebarGroupLabel: React.FC<SidebarGroupLabelProps> = ({ className, render, ...props }) => {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-muted ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'sidebar-group-label',
      sidebar: 'group-label',
    },
  })
}

const SidebarGroupAction: React.FC<SidebarGroupActionProps> = ({ className, render, ...props }) => {
  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(
          'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0',
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'sidebar-group-action',
      sidebar: 'group-action',
    },
  })
}

const SidebarGroupContent: React.FC<SidebarGroupContentProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-group-content'
      data-sidebar='group-content'
      className={cn('w-full text-sm', className)}
      {...props}
    />
  )
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ className, ...props }) => {
  return (
    <ul
      data-slot='sidebar-menu'
      data-sidebar='menu'
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  )
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ className, ...props }) => {
  return (
    <li
      data-slot='sidebar-menu-item'
      data-sidebar='menu-item'
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  )
}

const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({
  render,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}) => {
  const { isMobile, state } = useSidebar()
  const comp = useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      },
      props,
    ),
    render: !tooltip ? render : <TooltipTrigger render={render} />,
    state: {
      slot: 'sidebar-menu-button',
      sidebar: 'menu-button',
      size,
      active: isActive,
    },
  })

  if (!tooltip) {
    return comp
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent hidden={state !== 'collapsed' || isMobile} {...tooltip} />
    </Tooltip>
  )
}

const SidebarMenuAction: React.FC<SidebarMenuActionProps> = ({ className, render, showOnHover = false, ...props }) => {
  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        className: cn(
          'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0',
          showOnHover &&
            'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0',
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'sidebar-menu-action',
      sidebar: 'menu-action',
    },
  })
}

const SidebarMenuBadge: React.FC<SidebarMenuBadgeProps> = ({ className, ...props }) => {
  return (
    <div
      data-slot='sidebar-menu-badge'
      data-sidebar='menu-badge'
      className={cn(
        'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground',
        className,
      )}
      {...props}
    />
  )
}

const SidebarMenuSkeleton: React.FC<SidebarMenuSkeletonProps> = ({ className, showIcon = false, ...props }) => {
  // Random width between 50 to 90%.
  const [width] = useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  })

  return (
    <div
      data-slot='sidebar-menu-skeleton'
      data-sidebar='menu-skeleton'
      className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
      {...props}
    >
      {showIcon && <Skeleton className='size-4 rounded-md' data-sidebar='menu-skeleton-icon' />}
      <Skeleton
        className='h-4 max-w-(--skeleton-width) flex-1'
        data-sidebar='menu-skeleton-text'
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

const SidebarMenuSub: React.FC<SidebarMenuSubProps> = ({ className, ...props }) => {
  return (
    <ul
      data-slot='sidebar-menu-sub'
      data-sidebar='menu-sub'
      className={cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  )
}

const SidebarMenuSubItem: React.FC<SidebarMenuSubItemProps> = ({ className, ...props }) => {
  return (
    <li
      data-slot='sidebar-menu-sub-item'
      data-sidebar='menu-sub-item'
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    />
  )
}

const SidebarMenuSubButton: React.FC<SidebarMenuSubButtonProps> = ({
  render,
  size = 'md',
  isActive = false,
  className,
  ...props
}) => {
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        className: cn(
          'flex h-11 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground md:h-7',
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'sidebar-menu-sub-button',
      sidebar: 'menu-sub-button',
      size,
      active: isActive,
    },
  })
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
