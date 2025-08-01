'use client'

import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Brush,
  Tooltip as ChartTooltip,
} from '@/components/ui/chart'
import ChartCard from '@/components/dashboard/ChartCard'
import type { ChartConfig } from '@/components/ui/chart'
import useWeeklyVolumeHistory from '@/hooks/useWeeklyVolumeHistory'
import { Skeleton } from '@/components/ui/skeleton'

export default function WeeklyVolumeHistoryChart() {
  const data = useWeeklyVolumeHistory()

  if (!data) return <Skeleton className="h-64" />

  const config = {
    miles: { label: 'Miles', color: 'var(--chart-1)' },
  } satisfies ChartConfig

  return (
    <ChartCard
      title="Weekly Volume (20y)"
      description="Historical weekly mileage totals"
    >
      <ChartContainer config={config} className="h-64">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <ChartTooltip />
          <Bar dataKey="miles" fill="var(--chart-1)" radius={2} animationDuration={300} />
          <Brush dataKey="week" height={20} travellerWidth={10} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
