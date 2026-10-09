import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { NAVIGATION_GROUPS, NAVIGATION_ITEMS } from '@/constants/navigation'
import { useSidebar } from '@/hooks/use-sidebar'
import { useTheme } from '@/hooks/use-theme'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { ArrowUpRight, BookOpen, Braces, HardDrive, Moon, Sun } from 'lucide-react'
import type * as React from 'react'

const WorkspaceFrame: React.FC = () => {
  const path = useRouterState({ select: (state) => state.location.pathname })
  const current = NAVIGATION_ITEMS.find((item) => item.to === path)
  const { setOpenMobile } = useSidebar()
  const { theme, toggleTheme } = useTheme()
  return (
    <>
      <a href='#main-content' className='fixed -top-20 left-4 z-50 rounded-md bg-card px-4 py-3 focus:top-2'>
        Skip to content
      </a>
      <Sidebar collapsible='icon' variant='inset' aria-label='Workspace tools'>
        <SidebarHeader className='px-3 pb-7 pt-5 group-data-[collapsible=icon]:px-2'>
          <Link
            to='/'
            aria-label='Schemock home'
            className='flex h-8 items-center gap-2.5 text-xl font-semibold tracking-[-0.03em]'
            onClick={() => setOpenMobile(false)}
          >
            <Braces className='size-6 shrink-0' />
            <span className='group-data-[collapsible=icon]:hidden'>schemock</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label='Main navigation'>
            {NAVIGATION_GROUPS.map((group) => (
              <SidebarGroup key={group}>
                <SidebarGroupLabel>{group}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {NAVIGATION_ITEMS.filter((item) => item.group === group).map((item) => (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          isActive={path === item.to}
                          tooltip={item.label}
                          render={
                            <Link to={item.to} activeOptions={{ exact: true }} onClick={() => setOpenMobile(false)} />
                          }
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </nav>
        </SidebarContent>
        <SidebarFooter className='pb-4'>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={path === '/docs'}
                tooltip='User guide'
                render={<Link to='/docs' onClick={() => setOpenMobile(false)} />}
              >
                <BookOpen />
                <span>User guide</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip='API reference'
                render={<a href='/api/v1/ui' target='_blank' rel='noreferrer' />}
              >
                <ArrowUpRight />
                <span>API reference</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleTheme}
                tooltip={theme === 'light' ? 'Dark appearance' : 'Light appearance'}
              >
                {theme === 'light' ? <Moon /> : <Sun />}
                <span>{theme === 'light' ? 'Dark appearance' : 'Light appearance'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className='min-w-0 bg-background shadow-none!'>
        <header className='flex min-h-16 items-center justify-between gap-3 border-b px-4 md:px-8'>
          <div className='flex min-w-0 items-center gap-3'>
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList className='text-xs'>
                <BreadcrumbItem className='hidden sm:inline-flex'>Workspace</BreadcrumbItem>
                <BreadcrumbSeparator className='hidden sm:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>{path === '/docs' ? 'User guide' : (current?.label ?? 'Schemock')}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <span className='hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex'>
            <HardDrive size={13} />
            Local workspace
          </span>
        </header>
        <main id='main-content' tabIndex={-1} className='min-w-0 outline-none'>
          <Outlet />
        </main>
      </SidebarInset>
    </>
  )
}

export const AppShell: React.FC = () => (
  <SidebarProvider>
    <WorkspaceFrame />
  </SidebarProvider>
)
