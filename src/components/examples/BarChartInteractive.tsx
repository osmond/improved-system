'use client'

import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/ui/chart'

export const description = 'An interactive bar chart'

const startDate = new Date('2024-04-01')
const weeks = 12

const chartData = Array.from({ length: weeks }, (_, i) => ({
  date: new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10),
  bike: Math.floor(Math.random() * 5) + 1,
  run: Math.floor(Math.random() * 5) + 1,
}))

// ensure totals are not identical
const totals = chartData.reduce(
  (acc, curr) => {
    acc.bike += curr.bike
    acc.run += curr.run
    return acc
  },
  { bike: 0, run: 0 }
)
if (totals.bike === totals.run) {
  chartData[chartData.length - 1].bike += 1
}

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
          <CardTitle>Sessions by Discipline</CardTitle>
          <CardDescription>Number of runs vs bike rides over the last 3 months</CardDescription>
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
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] md:h-[300px] lg:h-[350px] w-full'>
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
