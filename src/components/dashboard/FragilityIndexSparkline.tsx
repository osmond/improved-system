import React from 'react'
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import useFragilityHistory from '@/hooks/useFragilityHistory'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Small sparkline showing recent fragility index trend.
 */
export default function FragilityIndexSparkline() {
  const history = useFragilityHistory(14)

  if (!history) return <Skeleton className="h-8 w-full" />

  const data = history.map((d) => ({
    date: d.date,
    low: d.value < 0.33 ? d.value : null,
    medium: d.value >= 0.33 && d.value < 0.66 ? d.value : null,
    high: d.value >= 0.66 ? d.value : null,
  }))

  const config = {
    low: { label: 'Low', color: 'hsl(var(--chart-3))' },
    medium: { label: 'Medium', color: 'hsl(var(--chart-8))' },
    high: { label: 'High', color: 'hsl(var(--destructive))' },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="h-16 w-full">
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <XAxis dataKey="date" hide />
        <YAxis domain={[0, 1]} hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line type="monotone" dataKey="low" stroke={config.low.color} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="medium" stroke={config.medium.color} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="high" stroke={config.high.color} strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  )
}

