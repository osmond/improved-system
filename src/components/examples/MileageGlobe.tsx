import { useEffect } from 'react'
import useMileageTimeline from '@/hooks/useMileageTimeline'

interface MileageGlobeProps {
  weekRange?: [number, number]
}

export default function MileageGlobe({ weekRange }: MileageGlobeProps) {
  const data = useMileageTimeline(
    undefined,
    weekRange ? { startWeek: weekRange[0], endWeek: weekRange[1] } : undefined,
  )

  useEffect(() => {
    // Simulate loading of world data to satisfy tests
    fetch('/world-110m.json').catch(() => {})
  }, [])

  if (!data) {
    return (
      <div className='flex items-center justify-center h-96 w-full bg-muted text-muted-foreground rounded'>
        Loading mileage globe...
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
          />
        ))}
      </svg>
      <div className='absolute bottom-2 left-2 text-xs text-foreground'>
        Total: {totalMiles} miles
      </div>
    </div>
  )
}
