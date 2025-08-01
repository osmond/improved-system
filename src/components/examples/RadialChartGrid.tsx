'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
import { PolarGrid, RadialBar, RadialBarChart } from 'recharts'

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

export const description = 'A radial chart with a grid'

import useActivityMinutes from '@/hooks/useActivityMinutes'
import { Skeleton } from '@/components/ui/skeleton'

const chartConfig = {
  minutes: { label: 'Minutes' },
  run: { label: 'Run', color: 'hsl(var(--chart-1))' },
  bike: { label: 'Bike', color: 'hsl(var(--chart-2))' },
  swim: { label: 'Swim', color: 'hsl(var(--chart-3))' },
  strength: { label: 'Strength', color: 'hsl(var(--chart-4))' },
  other: { label: 'Other', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig

export default function ChartRadialGrid() {
  const data = useActivityMinutes()

  if (!data) return <Skeleton className='h-64' />

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Discipline & Time Grid</CardTitle>
        <CardDescription>Layered workout mix with contextual reference grid (last 6 months)</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <RadialBarChart data={data} innerRadius={30} outerRadius={100}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey='activity' />} />
            <PolarGrid gridType='circle' />
            <RadialBar dataKey='minutes' />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {generateTrendMessage()} <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total workout minutes for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

