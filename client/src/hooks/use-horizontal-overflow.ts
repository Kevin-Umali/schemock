import { useEffect, useState, type RefObject } from 'react'

export const useHorizontalOverflow = (ref: RefObject<HTMLElement | null>): boolean => {
  const [overflowing, setOverflowing] = useState(false)
  useEffect(() => {
    const viewport = ref.current
    if (!viewport) return
    const observer = new ResizeObserver(() => setOverflowing(viewport.scrollWidth > viewport.clientWidth))
    observer.observe(viewport)
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild)
    return () => observer.disconnect()
  }, [ref])
  return overflowing
}
