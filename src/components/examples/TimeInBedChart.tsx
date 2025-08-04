'use client'

import React from 'react'
import {
  ChartContainer,
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  ChartTooltip,
  ChartTooltipContent,
} from '@/ui/chart'
import type { ChartConfig } from '@/ui/chart'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/ui/card'

// Generate mock sleep data for a month
const sleepData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2024-05-01')
  date.setDate(date.getDate() + i)
  return {
    date: date.toISOString().slice(0, 10),
    hours: +(6 + Math.random() * 3).toFixed(1),
  }
})

const chartConfig = {
  hours: { label: 'Hours', color: 'hsl(var(--chart-1))' },
  avg: { label: '7d Avg', color: 'hsl(var(--chart-2))' },
  goal: { label: 'Goal', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig

export default function TimeInBedChart() {
  const uid = React.useId().replace(/:/g, '')
  const fillHoursId = `fillHours-${uid}`
  const dataWithAvg = React.useMemo(() => {
    return sleepData.map((d, idx) => {
      const start = Math.max(0, idx - 6)
      const slice = sleepData.slice(start, idx + 1)
      const avg = slice.reduce((sum, val) => sum + val.hours, 0) / slice.length
      return { ...d, avg }
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time in Bed</CardTitle>
        <CardDescription>Nightly sleep duration with 7‑day average</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-60 md:h-80 lg:h-96'>
          <AreaChart data={dataWithAvg} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <defs>
              <linearGradient id={fillHoursId} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='hsl(var(--chart-1))' stopOpacity={0.8} />
                <stop offset='95%' stopColor='hsl(var(--chart-1))' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              tickFormatter={(d) =>
                new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }
            />
            <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
            <ReferenceLine y={8} stroke={chartConfig.goal.color} strokeDasharray='4 4' />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey='hours'
                  formatter={(value) => `${value} hr`}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                />
              }
            />
            <Area type='monotone' dataKey='hours' stroke={chartConfig.hours.color} fill={`url(#${fillHoursId})`} />
            <Line type='monotone' dataKey='avg' stroke={chartConfig.avg.color} dot={false} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
