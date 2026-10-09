interface SpinnerProps {
  show?: boolean
  text?: string
}
import { LoaderCircle } from 'lucide-react'
import type * as React from 'react'
export const Spinner: React.FC<SpinnerProps> = ({ show = true, text = 'Loading…' }) => {
  if (!show) return null
  return (
    <span role='status' className='inline-flex items-center gap-2 text-sm text-muted-foreground'>
      <LoaderCircle className='h-4 w-4 animate-spin' aria-hidden='true' />
      {text}
    </span>
  )
}
export default Spinner
