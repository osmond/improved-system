import React from 'react'
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
} from '@/ui/chart'
import type { ChartConfig } from '@/ui/chart'
import useFragilityHistory from '@/hooks/useFragilityHistory'
import { Skeleton } from '@/ui/skeleton'
import { FRAGILITY_LEVELS, getFragilityLevel } from '@/lib/fragility'

/**
 * Small sparkline showing recent fragility index trend.
 */
export default function FragilityIndexSparkline() {
  const history = useFragilityHistory(14)

  if (!history) return <Skeleton className="h-8 w-full" />

  const data = history.map((d) => {
    const level = getFragilityLevel(d.value).key
    return {
      date: d.date,
      low: level === 'low' ? d.value : null,
      medium: level === 'medium' ? d.value : null,
      high: level === 'high' ? d.value : null,
    }
  })

  const config = {
    low: { label: FRAGILITY_LEVELS.low.label, color: FRAGILITY_LEVELS.low.color },
    medium: { label: FRAGILITY_LEVELS.medium.label, color: FRAGILITY_LEVELS.medium.color },
    high: { label: FRAGILITY_LEVELS.high.label, color: FRAGILITY_LEVELS.high.color },
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

