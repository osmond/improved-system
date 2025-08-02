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
    lastYear: data.lastYear[i]?.value ?? null,
  }))

  const totals = {
    current: data.current.reduce((sum, p) => sum + p.value, 0),
    previous: data.previous.reduce((sum, p) => sum + p.value, 0),
    lastYear: data.lastYear.reduce((sum, p) => sum + p.value, 0),
  }

  const lastYearYear = data.lastYear.length
    ? new Date(data.lastYear[0].date).getFullYear()
    : new Date().getFullYear() - 1

  const diff = totals.current - totals.lastYear

  const config = {
    current: { label: 'This Week', color: 'hsl(var(--chart-1))' },
    previous: { label: 'Last Week', color: 'hsl(var(--chart-2))' },
    lastYear: { label: 'Same Week Last Year', color: 'hsl(var(--chart-3))' },
  } as const

  return (
    <ChartCard
      title="Weekly Comparison"
      description="Compare this week to last week"
    >
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <LineChart data={merged} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short' })} />
          <ChartTooltip />
          <ChartLegend content={<ChartLegendContent />} />
          <Line type="monotone" dataKey="current" stroke={config.current.color} dot={false} />
          <Line type="monotone" dataKey="previous" stroke={config.previous.color} dot={false} strokeOpacity={0.5} />
          <Line type="monotone" dataKey="lastYear" stroke={config.lastYear.color} dot={false} strokeOpacity={0.5} />
        </LineChart>
      </ChartContainer>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        You're {Math.abs(diff).toFixed(0)} miles {diff >= 0 ? 'ahead of' : 'behind'} {lastYearYear}-you.
      </p>
    </ChartCard>
  )
}
