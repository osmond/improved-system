'use client'

import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { SimpleSelect } from '@/components/ui/select'

const chartData = [

  { date: '2024-04-01', bike: 30, run: 4 },
  { date: '2024-04-02', bike: 10, run: 7 },
  { date: '2024-04-03', bike: 17, run: 6 },
  { date: '2024-04-04', bike: 14, run: 4 },
  { date: '2024-04-05', bike: 31, run: 11 },
  { date: '2024-04-06', bike: 12, run: 12 },
  { date: '2024-04-07', bike: 23, run: 3 },
  { date: '2024-04-08', bike: 10, run: 4 },
  { date: '2024-04-09', bike: 16, run: 6 },
  { date: '2024-04-10', bike: 26, run: 12 },
  { date: '2024-04-11', bike: 10, run: 11 },
  { date: '2024-04-12', bike: 16, run: 11 },
  { date: '2024-04-13', bike: 23, run: 6 },
  { date: '2024-04-14', bike: 24, run: 12 },
  { date: '2024-04-15', bike: 18, run: 3 },
  { date: '2024-04-16', bike: 34, run: 5 },
  { date: '2024-04-17', bike: 32, run: 9 },
  { date: '2024-04-18', bike: 20, run: 7 },
  { date: '2024-04-19', bike: 14, run: 6 },
  { date: '2024-04-20', bike: 40, run: 8 },
  { date: '2024-04-21', bike: 13, run: 4 },
  { date: '2024-04-22', bike: 22, run: 4 },
  { date: '2024-04-23', bike: 21, run: 8 },
  { date: '2024-04-24', bike: 29, run: 7 },
  { date: '2024-04-25', bike: 35, run: 3 },
  { date: '2024-04-26', bike: 33, run: 10 },
  { date: '2024-04-27', bike: 27, run: 4 },
  { date: '2024-04-28', bike: 39, run: 9 },
  { date: '2024-04-29', bike: 12, run: 11 },
  { date: '2024-04-30', bike: 19, run: 12 },
  { date: '2024-05-01', bike: 38, run: 8 },
  { date: '2024-05-02', bike: 28, run: 6 },
  { date: '2024-05-03', bike: 32, run: 4 },
  { date: '2024-05-04', bike: 11, run: 6 },
  { date: '2024-05-05', bike: 34, run: 7 },
  { date: '2024-05-06', bike: 12, run: 6 },
  { date: '2024-05-07', bike: 37, run: 4 },
  { date: '2024-05-08', bike: 22, run: 7 },
  { date: '2024-05-09', bike: 24, run: 8 },
  { date: '2024-05-10', bike: 15, run: 8 },
  { date: '2024-05-11', bike: 21, run: 6 },
  { date: '2024-05-12', bike: 31, run: 7 },
  { date: '2024-05-13', bike: 32, run: 4 },
  { date: '2024-05-14', bike: 29, run: 5 },
  { date: '2024-05-15', bike: 27, run: 6 },
  { date: '2024-05-16', bike: 15, run: 10 },
  { date: '2024-05-17', bike: 22, run: 7 },
  { date: '2024-05-18', bike: 39, run: 11 },
  { date: '2024-05-19', bike: 17, run: 8 },
  { date: '2024-05-20', bike: 36, run: 3 },
  { date: '2024-05-21', bike: 17, run: 3 },
  { date: '2024-05-22', bike: 35, run: 8 },
  { date: '2024-05-23', bike: 22, run: 7 },
  { date: '2024-05-24', bike: 12, run: 6 },
  { date: '2024-05-25', bike: 39, run: 12 },
  { date: '2024-05-26', bike: 38, run: 8 },
  { date: '2024-05-27', bike: 16, run: 10 },
  { date: '2024-05-28', bike: 22, run: 10 },
  { date: '2024-05-29', bike: 14, run: 7 },
  { date: '2024-05-30', bike: 14, run: 6 },
  { date: '2024-05-31', bike: 33, run: 11 },
  { date: '2024-06-01', bike: 27, run: 7 },
  { date: '2024-06-02', bike: 33, run: 12 },
  { date: '2024-06-03', bike: 23, run: 12 },
  { date: '2024-06-04', bike: 22, run: 8 },
  { date: '2024-06-05', bike: 17, run: 5 },
  { date: '2024-06-06', bike: 26, run: 10 },
  { date: '2024-06-07', bike: 12, run: 3 },
  { date: '2024-06-08', bike: 37, run: 4 },
  { date: '2024-06-09', bike: 14, run: 5 },
  { date: '2024-06-10', bike: 35, run: 9 },
  { date: '2024-06-11', bike: 29, run: 4 },
  { date: '2024-06-12', bike: 22, run: 9 },
  { date: '2024-06-13', bike: 29, run: 10 },
  { date: '2024-06-14', bike: 26, run: 7 },
  { date: '2024-06-15', bike: 27, run: 3 },
  { date: '2024-06-16', bike: 31, run: 4 },
  { date: '2024-06-17', bike: 31, run: 11 },
  { date: '2024-06-18', bike: 34, run: 7 },
  { date: '2024-06-19', bike: 34, run: 8 },
  { date: '2024-06-20', bike: 13, run: 7 },
  { date: '2024-06-21', bike: 23, run: 5 },
  { date: '2024-06-22', bike: 24, run: 3 },
  { date: '2024-06-23', bike: 40, run: 7 },
  { date: '2024-06-24', bike: 26, run: 5 },
  { date: '2024-06-25', bike: 26, run: 4 },
  { date: '2024-06-26', bike: 37, run: 7 },
  { date: '2024-06-27', bike: 36, run: 11 },
  { date: '2024-06-28', bike: 29, run: 6 },
  { date: '2024-06-29', bike: 14, run: 8 },
  { date: '2024-06-30', bike: 34, run: 5 },

]

const chartConfig = {
  run: { label: 'Run', color: 'hsl(var(--chart-1))' },
  bike: { label: 'Bike', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

export default function AreaChartInteractive() {
  const [range, setRange] = React.useState('90d')

  const filtered = React.useMemo(() => {
    const lastDataDate = new Date(chartData[chartData.length - 1].date)
    const now = new Date()
    const reference = lastDataDate > now ? lastDataDate : now
    const days = range === '30d' ? 30 : range === '7d' ? 7 : 90
    const start = new Date(reference)
    start.setDate(start.getDate() - days)
    return chartData.filter((d) => new Date(d.date) >= start)
  }, [range])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Distance Trend</CardTitle>
        <CardDescription>
          Run & bike mileage over the last 3 months
        </CardDescription>
        <SimpleSelect
          value={range}
          onValueChange={setRange}
          options={[
            { value: '90d', label: 'Last 3 months' },
            { value: '30d', label: 'Last 30 days' },
            { value: '7d', label: 'Last 7 days' },
          ]}
        />
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-60">
          <AreaChart data={filtered}>
            <defs>
            <linearGradient id="fillRun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillBike" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={1} />
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
            </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                  indicator="dot"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area dataKey="run" type="natural" fill="url(#fillRun)" stroke="hsl(var(--chart-1))" stackId="a" />
            <Area dataKey="bike" type="natural" fill="url(#fillBike)" stroke="hsl(var(--chart-2))" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
