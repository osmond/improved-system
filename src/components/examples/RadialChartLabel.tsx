'use client'

import { TrendingUp } from 'lucide-react'
import { LabelList, RadialBar, RadialBarChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A radial chart with a label'

// Distribution of workout minutes by activity type
const chartData = [
  { activity: 'Run', minutes: 520, fill: 'var(--color-run)' },
  { activity: 'Bike', minutes: 340, fill: 'var(--color-bike)' },
  { activity: 'Swim', minutes: 120, fill: 'var(--color-swim)' },
  { activity: 'Strength', minutes: 220, fill: 'var(--color-strength)' },
  { activity: 'Other', minutes: 90, fill: 'var(--color-other)' },
]

const chartConfig = {
  minutes: { label: 'Minutes' },
  run: { label: 'Run', color: 'hsl(var(--chart-1))' },
  bike: { label: 'Bike', color: 'hsl(var(--chart-2))' },
  swim: { label: 'Swim', color: 'hsl(var(--chart-3))' },
  strength: { label: 'Strength', color: 'hsl(var(--chart-4))' },
  other: { label: 'Other', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig

export default function ChartRadialLabel() {
  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Discipline Mix</CardTitle>
        <CardDescription>Total workout minutes by type over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey='activity' />}
            />
            <RadialBar dataKey='minutes' background>
              <LabelList
                position='insideStart'
                dataKey='activity'
                className='fill-white capitalize mix-blend-luminosity'
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total workout minutes for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
