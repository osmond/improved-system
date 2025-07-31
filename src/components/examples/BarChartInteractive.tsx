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
  { date: '2024-04-01', bike: 18.7, run: 6.29 },
  { date: '2024-04-02', bike: 15.9, run: 6.5 },
  { date: '2024-04-03', bike: 17.5, run: 6.07 },
  { date: '2024-04-04', bike: 19.2, run: 7.07 },
  { date: '2024-04-05', bike: 22.1, run: 7.29 },
  { date: '2024-04-06', bike: 20.5, run: 7.64 },
  { date: '2024-04-07', bike: 19.2, run: 6.5 },
  { date: '2024-04-08', bike: 23.0, run: 7.5 },
  { date: '2024-04-09', bike: 15.0, run: 6.0 },
  { date: '2024-04-10', bike: 19.6, run: 6.57 },
  { date: '2024-04-11', bike: 21.1, run: 7.71 },
  { date: '2024-04-12', bike: 20.3, run: 6.71 },
  { date: '2024-04-13', bike: 21.4, run: 7.93 },
  { date: '2024-04-14', bike: 16.8, run: 6.79 },
  { date: '2024-04-15', bike: 16.4, run: 6.43 },
  { date: '2024-04-16', bike: 16.8, run: 6.57 },
  { date: '2024-04-17', bike: 23.8, run: 7.79 },
  { date: '2024-04-18', bike: 21.9, run: 8.14 },
  { date: '2024-04-19', bike: 19.2, run: 6.5 },
  { date: '2024-04-20', bike: 15.7, run: 6.29 },
  { date: '2024-04-21', bike: 16.8, run: 6.64 },
  { date: '2024-04-22', bike: 18.8, run: 6.43 },
  { date: '2024-04-23', bike: 16.8, run: 6.86 },
  { date: '2024-04-24', bike: 22.5, run: 7.29 },
  { date: '2024-04-25', bike: 18.5, run: 7.0 },
  { date: '2024-04-26', bike: 15.4, run: 6.14 },
  { date: '2024-04-27', bike: 22.4, run: 8.21 },
  { date: '2024-04-28', bike: 16.4, run: 6.5 },
  { date: '2024-04-29', bike: 20.8, run: 6.93 },
  { date: '2024-04-30', bike: 24.0, run: 7.93 },
  { date: '2024-05-01', bike: 17.4, run: 6.79 },
  { date: '2024-05-02', bike: 20.3, run: 7.43 },
  { date: '2024-05-03', bike: 19.3, run: 6.57 },
  { date: '2024-05-04', bike: 22.4, run: 8.21 },
  { date: '2024-05-05', bike: 24.6, run: 8.0 },
  { date: '2024-05-06', bike: 25.0, run: 8.93 },
  { date: '2024-05-07', bike: 22.5, run: 7.36 },
  { date: '2024-05-08', bike: 17.0, run: 6.71 },
  { date: '2024-05-09', bike: 18.8, run: 6.5 },
  { date: '2024-05-10', bike: 20.3, run: 7.57 },
  { date: '2024-05-11', bike: 21.3, run: 7.14 },
  { date: '2024-05-12', bike: 18.1, run: 6.93 },
  { date: '2024-05-13', bike: 18.1, run: 6.36 },
  { date: '2024-05-14', bike: 23.8, run: 8.71 },
  { date: '2024-05-15', bike: 24.4, run: 7.93 },
  { date: '2024-05-16', bike: 21.3, run: 8.07 },
  { date: '2024-05-17', bike: 25.0, run: 8.21 },
  { date: '2024-05-18', bike: 20.8, run: 7.71 },
  { date: '2024-05-19', bike: 19.0, run: 6.5 },
  { date: '2024-05-20', bike: 17.7, run: 6.86 },
  { date: '2024-05-21', bike: 15.5, run: 6.21 },
  { date: '2024-05-22', bike: 15.5, run: 6.07 },
  { date: '2024-05-23', bike: 19.4, run: 7.29 },
  { date: '2024-05-24', bike: 20.3, run: 6.79 },
  { date: '2024-05-25', bike: 18.2, run: 7.0 },
  { date: '2024-05-26', bike: 18.5, run: 6.43 },
  { date: '2024-05-27', bike: 23.2, run: 8.5 },
  { date: '2024-05-28', bike: 19.0, run: 6.57 },
  { date: '2024-05-29', bike: 15.4, run: 6.14 },
  { date: '2024-05-30', bike: 21.4, run: 7.21 },
  { date: '2024-05-31', bike: 17.7, run: 6.86 },
  { date: '2024-06-01', bike: 17.7, run: 6.64 },
  { date: '2024-06-02', bike: 24.3, run: 8.14 },
  { date: '2024-06-03', bike: 16.0, run: 6.36 },
  { date: '2024-06-04', bike: 23.6, run: 7.93 },
  { date: '2024-06-05', bike: 15.7, run: 6.21 },
  { date: '2024-06-06', bike: 20.3, run: 7.0 },
  { date: '2024-06-07', bike: 21.0, run: 7.86 },
  { date: '2024-06-08', bike: 22.4, run: 7.5 },
  { date: '2024-06-09', bike: 23.6, run: 8.64 },
  { date: '2024-06-10', bike: 17.2, run: 6.64 },
  { date: '2024-06-11', bike: 15.8, run: 6.29 },
  { date: '2024-06-12', bike: 24.8, run: 8.21 },
  { date: '2024-06-13', bike: 15.5, run: 6.14 },
  { date: '2024-06-14', bike: 23.3, run: 7.93 },
  { date: '2024-06-15', bike: 20.6, run: 7.71 },
  { date: '2024-06-16', bike: 22.1, run: 7.43 },
  { date: '2024-06-17', bike: 24.5, run: 8.93 },
  { date: '2024-06-18', bike: 16.1, run: 6.43 },
  { date: '2024-06-19', bike: 21.4, run: 7.29 },
  { date: '2024-06-20', bike: 22.9, run: 8.43 },
  { date: '2024-06-21', bike: 17.5, run: 6.71 },
  { date: '2024-06-22', bike: 20.9, run: 7.14 },
  { date: '2024-06-23', bike: 24.6, run: 9.0 },
  { date: '2024-06-24', bike: 16.7, run: 6.5 },
  { date: '2024-06-25', bike: 16.9, run: 6.57 },
  { date: '2024-06-26', bike: 23.5, run: 7.93 },
  { date: '2024-06-27', bike: 23.8, run: 8.71 },
  { date: '2024-06-28', bike: 17.0, run: 6.64 },
  { date: '2024-06-29', bike: 16.0, run: 6.36 },
  { date: '2024-06-30', bike: 23.8, run: 8.07 },
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
          <CardDescription>Showing run & bike distance for the last 3 months</CardDescription>
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
