import React, { useMemo, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ChartContainer } from '@/components/ui/chart'
import { SimpleSelect } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouteHeatmap } from '@/hooks/useRouteHeatmap'

interface HeatLayerProps {
  points: [number, number, number][]
}

function HeatLayer({ points }: HeatLayerProps) {
  const map = useMap()
  React.useEffect(() => {
    const L = require('leaflet')
    ;(window as any).L = L
    require('leaflet.heat')
    // @ts-ignore
    const layer = (window as any).L.heatLayer(points, { radius: 25 }).addTo(map)
    return () => {
      layer.remove()
    }
  }, [map, points])
  return null
}

export default function RouteHeatmap() {
  const data = useRouteHeatmap()
  const [activity, setActivity] = useState('all')
  const [range, setRange] = useState('year')

  const points = useMemo(() => {
    if (!data) return []
    return data
      .filter((p) => activity === 'all' || p.type.toLowerCase() === activity)
      .map((p) => [p.lat, p.lng, p.weight] as [number, number, number])
  }, [data, activity])

  if (!data) return <Skeleton className="h-60 w-full" />

  const center: [number, number] = [data[0].lat, data[0].lng]

  return (
    <ChartContainer title="Route Heatmap" config={{}} className="space-y-4">
      <div className="flex gap-4">
        <SimpleSelect
          label="Activity"
          value={activity}
          onValueChange={setActivity}
          options={[
            { value: 'all', label: 'All' },
            { value: 'run', label: 'Run' },
            { value: 'bike', label: 'Bike' },
          ]}
        />
        <SimpleSelect
          label="Range"
          value={range}
          onValueChange={setRange}
          options={[
            { value: 'year', label: 'This Year' },
            { value: 'month', label: 'This Month' },
            { value: 'all', label: 'All Time' },
          ]}
        />
      </div>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatLayer points={points} />
      </MapContainer>
    </ChartContainer>
  )
}
