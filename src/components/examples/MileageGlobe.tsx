import { useEffect, useState } from 'react'
import type { Feature } from 'geojson'
import { feature } from 'topojson-client'
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
  const [worldFeatures, setWorldFeatures] = useState<Feature[]>([])
  const [tooltip, setTooltip] = useState<CumulativeMileagePoint | null>(null)

  useEffect(() => {
    fetch('/world-110m.json')
      .then((res) => res.json())
      .then((world) => {
        try {
          const countries = feature(world, world.objects.countries).features as Feature[]
          setWorldFeatures(countries)
        } catch (e) {
          setWorldError(true)
        }
      })
      .catch(() => setWorldError(true))
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

  const getPathColor = (miles: number) => {
    if (miles < 4) return 'var(--color-walk)'
    if (miles < 8) return 'var(--color-run)'
    return 'var(--color-bike)'
  }

  const coloredPaths = data.map((p) => ({ ...p, color: getPathColor(p.miles) }))

  return (
    <div className='relative aspect-square w-full'>
      <GlobeRenderer
        paths={coloredPaths}
        worldFeatures={worldFeatures}
        autoRotate={autoRotate}
        strokeWidth={strokeWidth}
        onPathMouseEnter={(p) => setTooltip(p as CumulativeMileagePoint)}
        onPathMouseLeave={() => setTooltip(null)}
      />
      {tooltip && (
        <div className='absolute top-2 right-2 bg-background text-foreground text-xs px-2 py-1 rounded shadow'>
          <div>{tooltip.date}</div>
          <div>{tooltip.miles} miles</div>
          <div>Cumulative: {tooltip.cumulativeMiles} miles</div>
        </div>
      )}
      <div className='absolute bottom-2 left-2 text-xs text-foreground'>
        Total: {totalMiles} miles
      </div>
    </div>
  )
}
