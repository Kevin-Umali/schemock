import { getFakerFunctionsQueryOptions, getHelperEnumsQueryOptions } from '@/api/queries'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface RootRouteProps {
  queryClient: QueryClient
  fakerMethods: string[]
  locales: string[]
}

const ListItem = forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'> & { title: string }>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            to={href}
            preload='intent'
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            activeProps={{ className: 'bg-accent text-accent-foreground' }}
            {...props}
          >
            <div className='text-sm font-medium leading-none'>{title}</div>
            {children && <p className='line-clamp-2 text-sm leading-snug text-muted-foreground mt-1'>{children}</p>}
          </Link>
        </NavigationMenuLink>
      </li>
    )
  },
)

ListItem.displayName = 'ListItem'

export const Route = createRootRouteWithContext<RootRouteProps>()({
  beforeLoad: async ({ context }) => {
    const fakerMethods = await context.queryClient.ensureQueryData(getFakerFunctionsQueryOptions())
    const locales = await context.queryClient.ensureQueryData(getHelperEnumsQueryOptions({ name: 'locale' }))
    return { fakerMethods, locales }
  },
  component: () => (
    <>
      <header className='border-b border-border shadow-sm sticky top-0 z-10 max-w-7xl mx-auto flex items-center justify-center'>
        <NavigationMenu className='p-4'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Generate</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4  '>
                  <ListItem title='JSON' href='/'>
                    Generate JSON data based on your created schema.
                  </ListItem>
                  <ListItem title='CSV' href='/csv'>
                    Generate CSV files with custom data structures and faker methods.
                  </ListItem>
                  <ListItem title='SQL' href='/sql'>
                    Generate SQL insert statements with custom table and field definitions.
                  </ListItem>
                  <ListItem title='Template' href='/template'>
                    Create custom templates with dynamic data generation.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Mock</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4'>
                  <ListItem title='API Mocking' href='/mock'>
                    Create mock APIs with custom responses and data.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Helper</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4'>
                  <ListItem title='Helper Functions' href='/helper'>
                    Utility functions and tools to help with data generation.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className='p-4'>
        <Outlet />
      </main>
    </>
  ),
})
