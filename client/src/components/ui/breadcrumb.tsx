import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/utils/classes'

type BreadcrumbProps = React.ComponentProps<'nav'>
type BreadcrumbListProps = React.ComponentProps<'ol'>
type BreadcrumbItemProps = React.ComponentProps<'li'>
type BreadcrumbLinkProps = useRender.ComponentProps<'a'>
type BreadcrumbPageProps = React.ComponentProps<'span'>
type BreadcrumbSeparatorProps = React.ComponentProps<'li'>
type BreadcrumbEllipsisProps = React.ComponentProps<'span'>

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className, ...props }) => (
  <nav aria-label='breadcrumb' data-slot='breadcrumb' className={cn(className)} {...props} />
)

const BreadcrumbList: React.FC<BreadcrumbListProps> = ({ className, ...props }) => (
  <ol
    data-slot='breadcrumb-list'
    className={cn(
      'flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground sm:gap-2.5',
      className,
    )}
    {...props}
  />
)

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ className, ...props }) => (
  <li data-slot='breadcrumb-item' className={cn('inline-flex items-center gap-1.5', className)} {...props} />
)

const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({ className, render, ...props }) =>
  useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>({ className: cn('transition-colors hover:text-foreground', className) }, props),
    render,
    state: { slot: 'breadcrumb-link' },
  })

const BreadcrumbPage: React.FC<BreadcrumbPageProps> = ({ className, ...props }) => (
  <span
    data-slot='breadcrumb-page'
    role='link'
    aria-disabled='true'
    aria-current='page'
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
)

const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({ children, className, ...props }) => (
  <li
    data-slot='breadcrumb-separator'
    role='presentation'
    aria-hidden='true'
    className={cn('[&>svg]:size-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
)

const BreadcrumbEllipsis: React.FC<BreadcrumbEllipsisProps> = ({ className, ...props }) => (
  <span
    data-slot='breadcrumb-ellipsis'
    role='presentation'
    aria-hidden='true'
    className={cn('flex size-5 items-center justify-center [&>svg]:size-4', className)}
    {...props}
  >
    <MoreHorizontalIcon />
    <span className='sr-only'>More</span>
  </span>
)

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
