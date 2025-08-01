"use client"

import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import ChartCard from '@/components/dashboard/ChartCard'
import useWeeklyComparison from '@/hooks/useWeeklyComparison'
import { Skeleton } from '@/components/ui/skeleton'

export default function WeeklyComparisonChart({
  metric,
}: {
  metric: string
}) {
  const data = useWeeklyComparison(metric)

  if (!data) return <Skeleton className="h-64" />

  const merged = data.current.map((p, i) => ({
    date: p.date,
    current: p.value,
    previous: data.previous[i]?.value ?? null,
  }))

  const config = {
    current: { label: 'This Week', color: 'hsl(var(--chart-1))' },
    previous: { label: 'Last Week', color: 'hsl(var(--chart-2))' },
  } as const

  return (
    <ChartCard title="Weekly Comparison">
      <ChartContainer config={config} className="h-64">
        <LineChart data={merged} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })} />
          <ChartTooltip />
          <ChartLegend content={<ChartLegendContent />} />
          <Line type="monotone" dataKey="current" stroke={config.current.color} dot={false} />
          <Line type="monotone" dataKey="previous" stroke={config.previous.color} dot={false} strokeOpacity={0.5} />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}
