'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, PolarRadiusAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/ui/chart'

export const description = 'A radar chart of workout activity by time'

const chartData = [
  { time: '12am', sessions: 2 },
  { time: '2am', sessions: 1 },
  { time: '4am', sessions: 0 },
  { time: '6am', sessions: 8 },
  { time: '8am', sessions: 12 },
  { time: '10am', sessions: 4 },
  { time: '12pm', sessions: 5 },
  { time: '2pm', sessions: 1 },
  { time: '4pm', sessions: 2 },
  { time: '6pm', sessions: 6 },
  { time: '8pm', sessions: 3 },
  { time: '10pm', sessions: 2 },
]

const chartConfig = {
  sessions: {
    label: 'Sessions',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export default function RadarChartWorkoutByTime({
  random = Math.random,
}: { random?: () => number } = {}) {
  return (
    <Card>
      <CardHeader className='items-center pb-4'>
        <CardTitle>Activity by Time of Day</CardTitle>
        <CardDescription>Session counts in two-hour intervals (typical daily pattern)</CardDescription>
      </CardHeader>
      <CardContent className='pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px] md:max-h-[300px] lg:max-h-[350px]'
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey='time' />
            <PolarRadiusAxis />
            <PolarGrid />
            <Radar
              dataKey='sessions'
              fill='var(--color-sessions)'
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {generateTrendMessage(random)} <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground flex items-center gap-2 leading-none'>
          Activity over a typical day
        </div>
      </CardFooter>
    </Card>
  )
}
