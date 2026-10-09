import { FIELD_KINDS } from '@/constants/field-inspector'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import type { FieldPath, FieldTreeNode } from '@/types/field-tree'
import { formatFieldPath, pathKey } from '@/utils/field-tree'
import { ChevronRight, CircleAlert } from 'lucide-react'
import type * as React from 'react'

interface FieldTreeProps {
  nodes: FieldTreeNode[]
  selectedPath: FieldPath
  expandedPaths: Record<string, boolean>
  invalidPaths: Set<string>
  onSelect: (path: FieldPath) => void
  onToggle: (key: string, open: boolean) => void
  depth?: number
}

export const FieldTree: React.FC<FieldTreeProps> = ({
  nodes,
  selectedPath,
  expandedPaths,
  invalidPaths,
  onSelect,
  onToggle,
  depth = 0,
}) => (
  <SidebarMenu className='gap-0.5'>
    {nodes.map((node) => {
      const key = pathKey(node.path)
      const selected = key === pathKey(selectedPath)
      const kind = FIELD_KINDS.find((item) => item.value === node.kind) ?? FIELD_KINDS[0]
      const Icon = kind.icon
      const hasChildren = node.children.length > 0
      const open = expandedPaths[key] ?? depth < 1
      const invalid = invalidPaths.has(key)
      return (
        <SidebarMenuItem key={key}>
          <Collapsible open={open} onOpenChange={(expanded) => onToggle(key, expanded)}>
            <div className='flex min-w-0 items-center gap-0.5'>
              <SidebarMenuButton
                isActive={selected}
                aria-current={selected ? 'true' : undefined}
                aria-label={`Edit ${formatFieldPath(node.path)}, ${kind.label}${invalid ? ', needs attention' : ''}`}
                title={formatFieldPath(node.path)}
                onClick={() => onSelect(node.path)}
                className='h-auto min-h-11 min-w-0 flex-1 gap-2 py-2 data-[active=true]:bg-secondary data-[active=true]:text-foreground'
              >
                <Icon aria-hidden='true' className='size-4 shrink-0' />
                <span className='min-w-0 flex-1'>
                  <span className='block truncate font-mono text-sm font-medium'>{node.name}</span>
                  <span className='mt-0.5 block text-xs font-normal text-muted-foreground'>
                    {kind.label}
                    {node.kind === 'object'
                      ? ` · ${node.children.length}`
                      : node.kind === 'array' && typeof node.value === 'object' && node.value && 'count' in node.value
                        ? ` · ${node.value.count} items`
                        : ''}
                  </span>
                </span>
                {invalid && <CircleAlert aria-hidden='true' className='size-4 shrink-0' />}
              </SidebarMenuButton>
              {hasChildren && (
                <CollapsibleTrigger
                  render={<Button variant='ghost' size='icon-sm' />}
                  aria-label={`${open ? 'Collapse' : 'Expand'} ${formatFieldPath(node.path)}`}
                  className='shrink-0'
                >
                  <ChevronRight aria-hidden='true' className={open ? 'rotate-90' : ''} />
                </CollapsibleTrigger>
              )}
            </div>
            {hasChildren && (
              <CollapsibleContent
                className={depth < 2 ? 'ms-4 border-s border-border ps-1' : 'border-s border-border ps-1'}
              >
                <FieldTree
                  nodes={node.children}
                  selectedPath={selectedPath}
                  expandedPaths={expandedPaths}
                  invalidPaths={invalidPaths}
                  onSelect={onSelect}
                  onToggle={onToggle}
                  depth={depth + 1}
                />
              </CollapsibleContent>
            )}
          </Collapsible>
        </SidebarMenuItem>
      )
    })}
  </SidebarMenu>
)
