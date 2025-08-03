import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { MetricDelta } from '@/hooks/useTopMetricChanges'

interface DeltaSpotlightTilesProps {
  metrics: MetricDelta[] | null
}

export default function DeltaSpotlightTiles({ metrics }: DeltaSpotlightTilesProps) {
  const navigate = useNavigate()
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        notation: 'compact',
        maximumFractionDigits: 1,
      }),
    [],
  )
  if (!metrics) return <Skeleton className="h-24 w-full" />

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, idx) => {
        const color = `hsl(var(--chart-${idx + 1}))`
        const config = { value: { color } }
        const handleNavigate = () => navigate(`/metrics/${metric.key}`)
        const prevValue =
          metric.trend[metric.trend.length - 2]?.value ?? metric.value
        const deltaAbs = metric.value - prevValue
        return (
          <Card
            key={metric.key}
            role="button"
            tabIndex={0}
            onClick={handleNavigate}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleNavigate()
            }}
            className="p-4 space-y-2 cursor-pointer transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">{metric.label}</span>
              <span className={`text-xs ${deltaAbs >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {deltaAbs >= 0 ? '+' : '-'}
                {numberFormatter.format(Math.abs(deltaAbs))}
                {metric.unit && ` ${metric.unit}`} (
                {metric.deltaPct >= 0 ? '+' : ''}
                {(metric.deltaPct * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="text-2xl font-bold">
              {metric.value.toFixed(0)}
              {metric.unit && <span className="text-sm font-normal ml-1">{metric.unit}</span>}
            </div>
            <ChartContainer config={config} className="h-16 w-full">
              <LineChart data={metric.trend} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </Card>
        )
      })}
    </div>
  )
}
