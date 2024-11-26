import { getFakerFunctionsQueryOptions, getHelperEnumsQueryOptions } from '@/api/queries'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'

interface RootRouteProps {
  queryClient: QueryClient
  fakerMethods: string[]
  locales: string[]
}

export const Route = createRootRouteWithContext<RootRouteProps>()({
  beforeLoad: async ({ context }) => {
    const fakerMethods = await context.queryClient.ensureQueryData(getFakerFunctionsQueryOptions())
    const locales = await context.queryClient.ensureQueryData(getHelperEnumsQueryOptions({ name: 'locale' }))
    return { fakerMethods, locales }
  },
  component: () => (
    <>
      <div className='p-2 flex gap-2'>
        <Link to='/' preload='intent' className='block py-2 px-3 text-blue-700' activeProps={{ className: `font-bold` }}>
          Generate
        </Link>
        <Link to='/mock' preload='intent' className='block py-2 px-3 text-blue-700' activeProps={{ className: `font-bold` }}>
          Mock
        </Link>
        <Link to='/helper' preload='intent' className='block py-2 px-3 text-blue-700' activeProps={{ className: `font-bold` }}>
          Helper
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
})
