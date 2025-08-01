import React, { useMemo } from 'react'
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import { feature } from 'topojson-client'
import ChartCard from '@/components/dashboard/ChartCard'
import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
} from '@/components/ui/chart'
import { Cell } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import useLocationEfficiency from '@/hooks/useLocationEfficiency'
import statesTopo from '../../../public/us-states.json'
import CITY_COORDS from '@/lib/cityCoords'


const config = {
  effort: { label: 'Effort', color: 'var(--chart-1)' },
} as const

export default function LocationEfficiencyComparison() {
  const data = useLocationEfficiency()
  const statesGeo = useMemo(
    () =>
      feature(
        statesTopo as any,
        (statesTopo as any).objects.states
      ) as unknown as GeoJSON.FeatureCollection,
    []
  )

  if (!data) return <Skeleton className="h-64" />

  const sorted = [...data].sort((a, b) => b.effort - a.effort)

  return (
    <ChartCard
      title="Location Efficiency"
      description="Relative efficiency by location"
    >
      <div className="flex gap-4">
        <div className="w-64 h-40" aria-label="location map">
          <Map
            mapLib={maplibregl}
            mapStyle="https://demotiles.maplibre.org/style.json"
            initialViewState={{ longitude: -98, latitude: 38, zoom: 3 }}
            attributionControl={false}
            style={{ width: '100%', height: '100%' }}
          >
            <Source id="states" type="geojson" data={statesGeo as any}>
              <Layer
                id="fill"
                type="fill"
                paint={{
                  'fill-color': 'hsl(var(--muted))',
                  'fill-outline-color': 'hsl(var(--border))',
                }}
              />
            </Source>
            {sorted.map((loc) => {
              const coords = CITY_COORDS[loc.city]
              return coords ? (
                <Marker key={loc.city} longitude={coords[0]} latitude={coords[1]}>
                  <circle r={3} fill="hsl(var(--primary))" />
                </Marker>
              ) : null
            })}
          </Map>
        </div>
        <div className="flex-1">
          <ChartContainer config={config} className="h-40">
            <BarChart data={sorted} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="effort" fill={config.effort.color} animationDuration={300}>
                {sorted.map((l) => (
                  <Cell key={l.city} aria-label={`Effort for ${l.city}`} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <ol aria-label="ranking" className="sr-only">
            {sorted.map((l) => (
              <li key={l.city}>{l.city}</li>
            ))}
          </ol>
        </div>
      </div>
    </ChartCard>
  )
}
