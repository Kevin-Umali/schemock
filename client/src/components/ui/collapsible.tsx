import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'
import type * as React from 'react'

type CollapsibleProps = CollapsiblePrimitive.Root.Props
type CollapsibleTriggerProps = CollapsiblePrimitive.Trigger.Props
type CollapsibleContentProps = CollapsiblePrimitive.Panel.Props

const Collapsible: React.FC<CollapsibleProps> = (props) => (
  <CollapsiblePrimitive.Root data-slot='collapsible' {...props} />
)

const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = (props) => (
  <CollapsiblePrimitive.Trigger data-slot='collapsible-trigger' {...props} />
)

const CollapsibleContent: React.FC<CollapsibleContentProps> = (props) => (
  <CollapsiblePrimitive.Panel data-slot='collapsible-content' {...props} />
)

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
