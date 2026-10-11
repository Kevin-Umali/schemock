import { Button } from '@/components/ui/button'
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, RotateCcw } from 'lucide-react'
import type * as React from 'react'

interface WorkspaceLayoutControlsProps {
  panels: { label: string; hidden: boolean; side: 'left' | 'right'; onToggle: () => void }[]
  onReset: () => void
}

export const WorkspaceLayoutControls: React.FC<WorkspaceLayoutControlsProps> = ({ panels, onReset }) => (
  <div role='group' aria-label='Workspace layout' className='flex flex-wrap items-center gap-1'>
    <span className='mr-1 text-xs text-muted-foreground'>Layout</span>
    {panels.map((panel) => {
      const Icon =
        panel.side === 'left'
          ? panel.hidden
            ? PanelLeftOpen
            : PanelLeftClose
          : panel.hidden
            ? PanelRightOpen
            : PanelRightClose
      return (
        <Button
          key={panel.label}
          variant={panel.hidden ? 'outline' : 'secondary'}
          size='sm'
          aria-label={`${panel.hidden ? 'Show' : 'Hide'} ${panel.label.toLowerCase()}`}
          aria-pressed={!panel.hidden}
          disabled={!panel.hidden && panels.filter((item) => !item.hidden).length === 1}
          onClick={panel.onToggle}
        >
          <Icon data-icon='inline-start' />
          {panel.label}
        </Button>
      )
    })}
    <Button
      variant='ghost'
      size='icon-sm'
      aria-label='Reset workspace layout'
      title='Reset workspace layout'
      onClick={onReset}
    >
      <RotateCcw />
    </Button>
  </div>
)
