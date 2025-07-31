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
  { date: '2024-04-01', bike: 222, run: 150 },
  { date: '2024-04-02', bike: 97, run: 180 },
  { date: '2024-04-03', bike: 167, run: 120 },
  { date: '2024-04-04', bike: 242, run: 260 },
  { date: '2024-04-05', bike: 373, run: 290 },
  { date: '2024-04-06', bike: 301, run: 340 },
  { date: '2024-04-07', bike: 245, run: 180 },
  { date: '2024-04-08', bike: 409, run: 320 },
  { date: '2024-04-09', bike: 59, run: 110 },
  { date: '2024-04-10', bike: 261, run: 190 },
  { date: '2024-04-11', bike: 327, run: 350 },
  { date: '2024-04-12', bike: 292, run: 210 },
  { date: '2024-04-13', bike: 342, run: 380 },
  { date: '2024-04-14', bike: 137, run: 220 },
  { date: '2024-04-15', bike: 120, run: 170 },
  { date: '2024-04-16', bike: 138, run: 190 },
  { date: '2024-04-17', bike: 446, run: 360 },
  { date: '2024-04-18', bike: 364, run: 410 },
  { date: '2024-04-19', bike: 243, run: 180 },
  { date: '2024-04-20', bike: 89, run: 150 },
  { date: '2024-04-21', bike: 137, run: 200 },
  { date: '2024-04-22', bike: 224, run: 170 },
  { date: '2024-04-23', bike: 138, run: 230 },
  { date: '2024-04-24', bike: 387, run: 290 },
  { date: '2024-04-25', bike: 215, run: 250 },
  { date: '2024-04-26', bike: 75, run: 130 },
  { date: '2024-04-27', bike: 383, run: 420 },
  { date: '2024-04-28', bike: 122, run: 180 },
  { date: '2024-04-29', bike: 315, run: 240 },
  { date: '2024-04-30', bike: 454, run: 380 },
  { date: '2024-05-01', bike: 165, run: 220 },
  { date: '2024-05-02', bike: 293, run: 310 },
  { date: '2024-05-03', bike: 247, run: 190 },
  { date: '2024-05-04', bike: 385, run: 420 },
  { date: '2024-05-05', bike: 481, run: 390 },
  { date: '2024-05-06', bike: 498, run: 520 },
  { date: '2024-05-07', bike: 388, run: 300 },
  { date: '2024-05-08', bike: 149, run: 210 },
  { date: '2024-05-09', bike: 227, run: 180 },
  { date: '2024-05-10', bike: 293, run: 330 },
  { date: '2024-05-11', bike: 335, run: 270 },
  { date: '2024-05-12', bike: 197, run: 240 },
  { date: '2024-05-13', bike: 197, run: 160 },
  { date: '2024-05-14', bike: 448, run: 490 },
  { date: '2024-05-15', bike: 473, run: 380 },
  { date: '2024-05-16', bike: 338, run: 400 },
  { date: '2024-05-17', bike: 499, run: 420 },
  { date: '2024-05-18', bike: 315, run: 350 },
  { date: '2024-05-19', bike: 235, run: 180 },
  { date: '2024-05-20', bike: 177, run: 230 },
  { date: '2024-05-21', bike: 82, run: 140 },
  { date: '2024-05-22', bike: 81, run: 120 },
  { date: '2024-05-23', bike: 252, run: 290 },
  { date: '2024-05-24', bike: 294, run: 220 },
  { date: '2024-05-25', bike: 201, run: 250 },
  { date: '2024-05-26', bike: 213, run: 170 },
  { date: '2024-05-27', bike: 420, run: 460 },
  { date: '2024-05-28', bike: 233, run: 190 },
  { date: '2024-05-29', bike: 78, run: 130 },
  { date: '2024-05-30', bike: 340, run: 280 },
  { date: '2024-05-31', bike: 178, run: 230 },
  { date: '2024-06-01', bike: 178, run: 200 },
  { date: '2024-06-02', bike: 470, run: 410 },
  { date: '2024-06-03', bike: 103, run: 160 },
  { date: '2024-06-04', bike: 439, run: 380 },
  { date: '2024-06-05', bike: 88, run: 140 },
  { date: '2024-06-06', bike: 294, run: 250 },
  { date: '2024-06-07', bike: 323, run: 370 },
  { date: '2024-06-08', bike: 385, run: 320 },
  { date: '2024-06-09', bike: 438, run: 480 },
  { date: '2024-06-10', bike: 155, run: 200 },
  { date: '2024-06-11', bike: 92, run: 150 },
  { date: '2024-06-12', bike: 492, run: 420 },
  { date: '2024-06-13', bike: 81, run: 130 },
  { date: '2024-06-14', bike: 426, run: 380 },
  { date: '2024-06-15', bike: 307, run: 350 },
  { date: '2024-06-16', bike: 371, run: 310 },
  { date: '2024-06-17', bike: 475, run: 520 },
  { date: '2024-06-18', bike: 107, run: 170 },
  { date: '2024-06-19', bike: 341, run: 290 },
  { date: '2024-06-20', bike: 408, run: 450 },
  { date: '2024-06-21', bike: 169, run: 210 },
  { date: '2024-06-22', bike: 317, run: 270 },
  { date: '2024-06-23', bike: 480, run: 530 },
  { date: '2024-06-24', bike: 132, run: 180 },
  { date: '2024-06-25', bike: 141, run: 190 },
  { date: '2024-06-26', bike: 434, run: 380 },
  { date: '2024-06-27', bike: 448, run: 490 },
  { date: '2024-06-28', bike: 149, run: 200 },
  { date: '2024-06-29', bike: 103, run: 160 },
  { date: '2024-06-30', bike: 446, run: 400 },
]

const chartConfig = {
  run: { label: 'Run', color: 'hsl(var(--chart-1))' },
  bike: { label: 'Bike', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

export default function AreaChartInteractive() {
  const [range, setRange] = React.useState('90d')

  const filtered = React.useMemo(() => {
    const reference = new Date('2024-06-30')
    const days = range === '30d' ? 30 : range === '7d' ? 7 : 90
    const start = new Date(reference)
    start.setDate(start.getDate() - days)
    return chartData.filter((d) => new Date(d.date) >= start)
  }, [range])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Distance</CardTitle>
        <CardDescription>
          Last {range === '90d' ? '3 months' : range === '30d' ? '30 days' : '7 days'}
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
