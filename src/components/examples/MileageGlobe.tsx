import { useEffect, useState } from 'react'
import type { Feature } from 'geojson'
import { feature } from 'topojson-client'
import { geoInterpolate } from 'd3-geo'
import useMileageTimeline, { CumulativeMileagePoint } from '@/hooks/useMileageTimeline'
import GlobeRenderer from '@/components/GlobeRenderer'
import { Skeleton } from '@/ui/skeleton'

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
    return <Skeleton data-testid='loading' className='h-96 w-full' />
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

  const ROUTE_START: [number, number] = [-122.4194, 37.7749]
  const ROUTE_END: [number, number] = [-74.006, 40.7128]
  const ROUTE_DISTANCE = 2900
  const progressRatio = Math.min(totalMiles / ROUTE_DISTANCE, 1)
  const interpolate = geoInterpolate(ROUTE_START, ROUTE_END)
  const numPoints = Math.max(2, Math.ceil(progressRatio * 50))
  const progressCoords = Array.from({ length: numPoints }, (_, i) =>
    interpolate((i / (numPoints - 1)) * progressRatio),
  )

  return (
    <div className='relative aspect-square w-full'>
      <GlobeRenderer
        paths={[
          { coordinates: progressCoords, color: 'var(--primary-foreground)' },
        ]}
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
      {/* Total: {totalMiles} miles */}
    </div>
  )
}
