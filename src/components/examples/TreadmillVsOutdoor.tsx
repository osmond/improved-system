'use client'

import React from 'react'
import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartLegend,
  ChartLegendContent,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
} from '@/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card'

import type { ChartConfig } from '@/ui/chart'

export const description = 'A treadmill vs outdoor chart'

const monthlyData = [
  { month: 'january', outdoor: 180, treadmill: 60 },
  { month: 'february', outdoor: 170, treadmill: 70 },
  { month: 'march', outdoor: 190, treadmill: 50 },
  { month: 'april', outdoor: 210, treadmill: 40 },
  { month: 'may', outdoor: 200, treadmill: 55 },
] as const

const chartConfig = {
  outdoor: { label: 'Outdoor', color: 'hsl(var(--chart-5))' },
  treadmill: { label: 'Treadmill', color: 'hsl(var(--chart-6))' },
} satisfies ChartConfig

export default function TreadmillVsOutdoorExample() {

  return (
    <Card className='flex flex-col'>
      <CardHeader className='space-y-0'>
        <CardTitle>Indoor vs Outdoor Split</CardTitle>
        <CardDescription>
          Comparison of workout volume or sessions (e.g., treadmill vs outdoor activities)
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center pb-0'>
        <ChartContainer config={chartConfig} className='h-60 md:h-80 lg:h-96 w-full'>
          <BarChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey='outdoor' fill={chartConfig.outdoor.color} />
            <Bar dataKey='treadmill' fill={chartConfig.treadmill.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
