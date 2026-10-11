import { useId, useRef, useState } from 'react'
import { useGroupRef, type PanelImperativeHandle, type PanelSize } from 'react-resizable-panels'

export const useWorkspaceLayout = (defaults: Record<string, number>) => {
  const id = useId()
  const groupRef = useGroupRef()
  const panels = useRef<Record<string, PanelImperativeHandle | null>>({})
  const [hidden, setHidden] = useState<Record<string, boolean>>({})
  const panelProps = (name: string) => ({
    id: `${id}-${name}`,
    defaultSize: `${defaults[name]}%`,
    panelRef: (panel: PanelImperativeHandle | null) => {
      panels.current[name] = panel
    },
    onResize: ({ asPercentage }: PanelSize) => {
      const collapsed = asPercentage === 0
      setHidden((current) => (current[name] === collapsed ? current : { ...current, [name]: collapsed }))
    },
  })
  const show = (name: string) => {
    if (!panels.current[name]?.isCollapsed()) return
    const visible = Object.keys(defaults).filter((key) => key === name || !panels.current[key]?.isCollapsed())
    const total = visible.reduce((sum, key) => sum + defaults[key], 0)
    groupRef.current?.setLayout(
      Object.fromEntries(
        Object.entries(defaults).map(([key, size]) => [
          `${id}-${key}`,
          visible.includes(key) ? (size / total) * 100 : 0,
        ]),
      ),
    )
  }
  const toggle = (name: string) => {
    const panel = panels.current[name]
    if (panel?.isCollapsed()) show(name)
    else if (Object.entries(panels.current).some(([key, other]) => key !== name && other && !other.isCollapsed())) {
      panel?.collapse()
    }
  }
  const reset = () =>
    groupRef.current?.setLayout(
      Object.fromEntries(Object.entries(defaults).map(([name, size]) => [`${id}-${name}`, size])),
    )
  return { groupRef, panelProps, hidden, show, toggle, reset }
}
