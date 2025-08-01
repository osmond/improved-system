import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps'
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

const CITY_COORDS: Record<string, [number, number]> = {
  'Los Angeles': [-118.2437, 34.0522],
  'San Francisco': [-122.4194, 37.7749],
  Austin: [-97.7431, 30.2672],
  Houston: [-95.3698, 29.7604],
}

const config = {
  effort: { label: 'Effort', color: 'var(--chart-1)' },
} as const

export default function LocationEfficiencyComparison() {
  const data = useLocationEfficiency()

  if (!data) return <Skeleton className="h-64" />

  const sorted = [...data].sort((a, b) => b.effort - a.effort)

  return (
    <ChartCard
      title="Location Efficiency"
      description="Relative efficiency by location"
    >
      <div className="flex gap-4">
        <div className="w-64 h-40" aria-label="location map">
          <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={statesTopo as any}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{ default: { fill: 'hsl(var(--muted))', outline: 'none' } }}
                  />
                ))
              }
            </Geographies>
            {sorted.map((loc) => {
              const coords = CITY_COORDS[loc.city]
              return coords ? (
                <Marker key={loc.city} coordinates={coords}>
                  <circle r={3} fill="hsl(var(--primary))" />
                </Marker>
              ) : null
            })}
          </ComposableMap>
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
