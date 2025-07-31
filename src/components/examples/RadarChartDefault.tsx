'use client'

import { TrendingUp } from 'lucide-react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts'

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

export const description = 'A radar chart'

const chartData = [
  { month: 'January', miles: 186 },
  { month: 'February', miles: 305 },
  { month: 'March', miles: 237 },
  { month: 'April', miles: 273 },
  { month: 'May', miles: 209 },
  { month: 'June', miles: 214 },
]

const chartConfig = {
  miles: {
    label: 'Miles',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function ChartRadarDefault() {
  return (
    <Card>
      <CardHeader className='items-center pb-4'>
        <CardTitle>Weekly Activity Distribution</CardTitle>
        <CardDescription>Average mileage by month</CardDescription>
      </CardHeader>
      <CardContent className='pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey='month' />
            <PolarGrid />
            <Radar
              dataKey='miles'
              fill='var(--color-miles)'
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground flex items-center gap-2 leading-none'>
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
