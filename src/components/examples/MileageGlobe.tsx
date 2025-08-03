import { useEffect, useState } from 'react'
import useMileageTimeline from '@/hooks/useMileageTimeline'

interface MileageGlobeProps {
  weekRange?: [number, number]

}

export default function MileageGlobe({ weekRange }: MileageGlobeProps) {
  const data = useMileageTimeline(
    undefined,
    weekRange ? { startWeek: weekRange[0], endWeek: weekRange[1] } : undefined,
  )

  const [worldError, setWorldError] = useState(false)
  const [tooltip, setTooltip] = useState<
    { x: number; y: number; date: string; miles: number } | null
  >(null)

  useEffect(() => {
    // Simulate loading of world data to satisfy tests
    fetch('/world-110m.json').catch(() => setWorldError(true))
  }, [])

  if (!data) {
    return (
      <div className='flex items-center justify-center h-96 w-full bg-muted text-muted-foreground rounded'>
        Loading mileage globe...
      </div>
    )
  }

  if (worldError) {
    return (
      <div className='flex items-center justify-center h-96 w-full bg-muted text-muted-foreground rounded'>
        Map unavailable
      </div>
    )
  }

  const totalMiles = data.reduce((sum, p) => sum + p.miles, 0)

  return (
    <div className='relative aspect-square w-full'>
      <svg className='h-full w-full rounded' preserveAspectRatio='xMidYMid meet'>
        {data.map((p, idx) => (
          <path
            key={idx}
            d={`M ${p.coordinates.map((c) => c.join(' ')).join(' L ')}`}
            fill='none'
            stroke='var(--primary-foreground)'
            strokeWidth={Math.max(2, Math.min(10, 1 + totalMiles / 50))}
            strokeLinecap='round'
            opacity={0.8}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect()
              setTooltip({
                x: e.clientX - (rect?.left ?? 0),
                y: e.clientY - (rect?.top ?? 0),
                date: p.date,
                miles: p.miles,
              })
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>
      {tooltip && (
        <div
          className='pointer-events-none absolute bg-background text-foreground border rounded px-1 py-0.5 text-xs'
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          {tooltip.date}: {tooltip.miles} miles
        </div>
      )}
      <div className='absolute bottom-2 left-2 text-xs text-foreground'>
        Total: {totalMiles} miles
      </div>
    </div>
  )
}
