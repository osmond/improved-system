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
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'

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
  bike: { label: 'Bike Speed', color: 'hsl(var(--chart-1))' },
  run: { label: 'Run Pace', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

export default function LineChartInteractive() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('bike')

  const average = React.useMemo(
    () => ({
      bike: chartData.reduce((acc, curr) => acc + curr.bike, 0) / chartData.length,
      run: chartData.reduce((acc, curr) => acc + curr.run, 0) / chartData.length,
    }),
    []
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Average Pace</CardTitle>
          <CardDescription>Showing average pace for the last 3 months</CardDescription>
        </div>
        <div className="flex">
          {(['bike', 'run'] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-xs">{chartConfig[key].label}</span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {average[key].toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
