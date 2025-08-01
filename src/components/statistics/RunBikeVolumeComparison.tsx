"use client"

import { useState } from 'react'
import {
  ChartContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import ChartCard from '@/components/dashboard/ChartCard'
import useRunBikeVolume from '@/hooks/useRunBikeVolume'
import { Skeleton } from '@/components/ui/skeleton'

const config = {
  run: { label: 'Run', color: 'var(--chart-1)' },
  bike: { label: 'Bike', color: 'var(--chart-2)' },
} as const

export default function RunBikeVolumeComparison() {
  const data = useRunBikeVolume()
  const [metric, setMetric] = useState<'distance' | 'time'>('distance')

  if (!data) return <Skeleton className="h-64" />

  const runKey = metric === 'distance' ? 'runMiles' : 'runTime'
  const bikeKey = metric === 'distance' ? 'bikeMiles' : 'bikeTime'

  return (
    <ChartCard
      title="Run vs Bike Volume"
      description="Compare running and cycling volume"
    >
      <div className="flex justify-end gap-2 pb-2">
        <button
          data-active={metric === 'distance'}
          className="text-xs px-2 py-1 rounded-md border data-[active=true]:bg-muted"
          onClick={() => setMetric('distance')}
        >
          Distance
        </button>
        <button
          data-active={metric === 'time'}
          className="text-xs px-2 py-1 rounded-md border data-[active=true]:bg-muted"
          onClick={() => setMetric('time')}
        >
          Time
        </button>
      </div>
      <ChartContainer config={config} className="h-64">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <ChartTooltip />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey={runKey} fill={config.run.color} radius={2} />
          <Bar dataKey={bikeKey} fill={config.bike.color} radius={2} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
