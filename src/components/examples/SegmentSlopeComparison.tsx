'use client'

import React, { useMemo } from 'react'
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import ChartCard from '@/components/dashboard/ChartCard'
import type { ChartConfig } from '@/components/ui/chart'

interface SegmentAttempt {
  date: string
  time: number
}

const attempts: SegmentAttempt[] = [
  { date: '2024-01-05', time: 310 },
  { date: '2024-02-10', time: 305 },
  { date: '2024-03-12', time: 299 },
  { date: '2024-04-09', time: 301 },
  { date: '2024-05-14', time: 295 },
  { date: '2024-06-20', time: 294 },
]

export default function SegmentSlopeComparison() {
  const data = useMemo(() => {
    let best = Infinity
    let sum = 0
    return attempts.map((a, idx) => {
      if (a.time < best) best = a.time
      sum += a.time
      const avg = sum / (idx + 1)
      return { ...a, best, avg }
    })
  }, [])

  const current = attempts[attempts.length - 1].time

  const config = {
    best: { label: 'Best', color: 'hsl(var(--chart-1))' },
    avg: { label: 'Avg', color: 'hsl(var(--chart-2))' },
    current: { label: 'Current', color: 'hsl(var(--chart-3))' },
  } satisfies ChartConfig

  return (
    <ChartCard title='Segment Performance'>
      <ChartContainer config={config} className='h-60'>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='date'
            tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short' })}
          />
          <YAxis />
          <ReferenceLine y={current} stroke={config.current.color} strokeDasharray='4 4' />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(d) =>
                  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
              />
            }
          />
          <Line dataKey='best' stroke={config.best.color} />
          <Line dataKey='avg' stroke={config.avg.color} />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}
