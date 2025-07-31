'use client'

import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'An interactive bar chart'

const chartData = [
  { date: '2024-04-01', bike: 2, run: 3 },
  { date: '2024-04-08', bike: 1, run: 4 },
  { date: '2024-04-15', bike: 2, run: 2 },
  { date: '2024-04-22', bike: 3, run: 3 },
  { date: '2024-04-29', bike: 4, run: 2 },
  { date: '2024-05-06', bike: 3, run: 1 },
  { date: '2024-05-13', bike: 5, run: 4 },
  { date: '2024-05-20', bike: 3, run: 2 },
  { date: '2024-05-27', bike: 2, run: 3 },
  { date: '2024-06-03', bike: 4, run: 3 },
  { date: '2024-06-10', bike: 2, run: 5 },
  { date: '2024-06-17', bike: 3, run: 2 },
]

const chartConfig = {
  bike: {
    label: 'Bike',
    color: 'hsl(var(--chart-2))',
  },
  run: {
    label: 'Run',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function BarChartInteractive() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('bike')

  const total = React.useMemo(
    () => ({
      bike: chartData.reduce((acc, curr) => acc + curr.bike, 0),
      run: chartData.reduce((acc, curr) => acc + curr.run, 0),
    }),
    []
  )

  return (
    <Card className='py-0'>
      <CardHeader className='flex flex-col items-stretch border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0'>
          <CardTitle>Weekly Sessions by Discipline</CardTitle>
          <CardDescription>Showing number of sessions for the last 3 months</CardDescription>
        </div>
        <div className='flex'>
          {['bike', 'run'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg leading-none font-bold sm:text-3xl'>
                  {total[chart].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='views'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
