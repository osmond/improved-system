import React, { useEffect, useState } from 'react'
import useFragilityIndex from '@/hooks/useFragilityIndex'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/ui/tooltip'
import { Skeleton } from '@/ui/skeleton'
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion'

export interface CircularFragilityRingProps {
  /** Diameter of the ring in pixels */
  size?: number
  /** Width of the ring stroke */
  strokeWidth?: number
}

/**
 * Full circular gauge representing the behavioral fragility index.
 */
export default function CircularFragilityRing({ size = 160, strokeWidth = 12 }: CircularFragilityRingProps) {
  const fragility = useFragilityIndex()
  const [displayIndex, setDisplayIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!fragility) return
    const { index } = fragility
    if (prefersReducedMotion) {
      setDisplayIndex(index)
      return
    }
    setDisplayIndex(0)
    let start: number | null = null
    const duration = 500
    let frame: number
    const animate = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setDisplayIndex(progress * index)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [fragility, prefersReducedMotion])

  if (!fragility) return <Skeleton className="h-40" />
  const { index } = fragility

  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - displayIndex)

  const hue = (1 - displayIndex) * 120
  const color = `hsl(${hue} 90% 45%)`

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center" role="img" aria-label={`Fragility ${displayIndex.toFixed(2)}`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-in-out hover:opacity-80"
                style={{
                  transition: prefersReducedMotion
                    ? 'none'
                    : 'stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1), stroke 0.5s cubic-bezier(0.4,0,0.2,1)',
                }}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </svg>
            <span className="mt-2 text-lg font-bold tabular-nums">{displayIndex.toFixed(2)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Higher values indicate disrupted routine or sudden load increases
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
