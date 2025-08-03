'use client'

import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import Slider from '@/components/ui/slider'
import { useState, useEffect } from 'react'
import ChartCard from '@/components/dashboard/ChartCard'
import type { ChartConfig } from '@/components/ui/chart'
import useWeeklyVolumeHistory from '@/hooks/useWeeklyVolumeHistory'
import { Skeleton } from '@/components/ui/skeleton'
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion'

export default function WeeklyVolumeHistoryChart() {
  const data = useWeeklyVolumeHistory()
  const [range, setRange] = useState<[number, number]>([0, 0])
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (data) {
      setRange([Math.max(0, data.length - 52), data.length - 1])
    }
  }, [data])

  if (!data) return <Skeleton className="h-64" />

  const filtered = data.slice(range[0], range[1] + 1)

  const config = {
    miles: { label: 'Miles', color: 'hsl(var(--chart-1))' },
  } satisfies ChartConfig

  return (
    <ChartCard
      title="Weekly Training Volume"
      description="Historical weekly mileage totals (run + bike)"
    >
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <BarChart
          data={filtered}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            interval="preserveStartEnd"
            tickFormatter={(d) => {
              const date = new Date(d)
              return (
                date.toLocaleString('en-US', { month: 'short' }) +
                " '" +
                date.toLocaleString('en-US', { year: '2-digit' })
              )
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(d) =>
                  new Date(d).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }
              />
            }
          />
          <Bar
            dataKey="miles"
            fill="var(--color-miles)"
            radius={2}
            animationDuration={prefersReducedMotion ? 0 : 300}
            animationEasing="ease-in-out"
            isAnimationActive={!prefersReducedMotion}
            className="motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-in-out hover:opacity-80"
          />
        </BarChart>
      </ChartContainer>
      <div className="mt-4">
        <Slider
          numberOfThumbs={2}
          min={0}
          max={data.length - 1}
          step={1}
          value={range}
          onValueChange={(val) => setRange(val as [number, number])}
        />
      </div>
    </ChartCard>
  )
}
