import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    const start = prevTarget.current
    const diff = target - start
    if (diff === 0) return

    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + diff * eased)
      setValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        prevTarget.current = target
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  return value
}
