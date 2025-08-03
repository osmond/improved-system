import React, { useEffect, useState } from 'react'
import useFragilityIndex from '@/hooks/useFragilityIndex'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { getFragilityLevel } from '@/lib/fragility'
import useSelection from '@/hooks/useSelection'

export interface FragilityGaugeProps {
  /** Diameter of the gauge in pixels */
  size?: number
  /** Stroke width for gauge arcs */
  strokeWidth?: number
}

/**
 * Semicircular gauge displaying the behavioral fragility index.
 */
export default function FragilityGauge({ size = 160, strokeWidth = 12 }: FragilityGaugeProps) {
  const fragility = useFragilityIndex()
  const [displayIndex, setDisplayIndex] = useState(0)
  const { selected, toggle } = useSelection()

  useEffect(() => {
    if (!fragility) return
    const { index } = fragility
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
  }, [fragility])

  if (!fragility) return <Skeleton className="h-32" />
  const { index } = fragility

  const radius = size / 2 - strokeWidth / 2
  const circumference = Math.PI * radius
  const offset = circumference - displayIndex * circumference

  const { color } = getFragilityLevel(index)

  const isDimmed = selected.length && !selected.includes('fragility')

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={
              isDimmed
                ? 'flex flex-col items-center opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded'
                : 'flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded'
            }
            aria-label={`Toggle fragility metric (current ${displayIndex.toFixed(2)})`}
            onClick={() => toggle('fragility')}
          >
            <svg
              width={size}
              height={size / 2}
              viewBox={`0 0 ${size} ${size / 2}`}
              aria-hidden="true"
            >
              <path
                d={`M ${strokeWidth / 2},${size / 2 - strokeWidth / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2 - strokeWidth / 2}`}
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <path
                d={`M ${strokeWidth / 2},${size / 2 - strokeWidth / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2 - strokeWidth / 2}`}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <span className="mt-2 text-lg font-bold tabular-nums">
              {displayIndex.toFixed(2)}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          Higher values indicate disrupted routine or sudden load increases
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
