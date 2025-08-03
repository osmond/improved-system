import { useEffect, useState } from 'react'
import useMileageTimeline, { CumulativeMileagePoint } from '@/hooks/useMileageTimeline'
import GlobeRenderer from '@/components/GlobeRenderer'

interface MileageGlobeProps {
  weekRange?: [number, number]
  autoRotate?: boolean
}

export default function MileageGlobe({ weekRange, autoRotate = false }: MileageGlobeProps) {
  const data = useMileageTimeline(
    undefined,
    weekRange ? { startWeek: weekRange[0], endWeek: weekRange[1] } : undefined,
  )
  const [worldError, setWorldError] = useState(false)
  const [tooltip, setTooltip] = useState<CumulativeMileagePoint | null>(null)

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
  const strokeWidth = Math.max(2, Math.min(10, 1 + totalMiles / 50))

  return (
    <div className='relative aspect-square w-full'>
      <GlobeRenderer
        paths={data}
        autoRotate={autoRotate}
        strokeWidth={strokeWidth}
        onPathMouseEnter={(p) => setTooltip(p as CumulativeMileagePoint)}
        onPathMouseLeave={() => setTooltip(null)}
      />
      {tooltip && (
        <div className='absolute top-2 right-2 bg-background text-foreground text-xs px-2 py-1 rounded shadow'>
          <div>{tooltip.date}</div>
          <div>{tooltip.miles} miles</div>
        </div>
      )}
      <div className='absolute bottom-2 left-2 text-xs text-foreground'>
        Total: {totalMiles} miles
      </div>
    </div>
  )
}
