'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'

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

export const description = 'A mixed bar chart'

// Share of different activity types measured in session counts
const chartData = [
  { activity: 'run', sessions: 45, fill: 'var(--color-run)' },
  { activity: 'bike', sessions: 30, fill: 'var(--color-bike)' },
  { activity: 'walk', sessions: 12, fill: 'var(--color-walk)' },
  { activity: 'hike', sessions: 8, fill: 'var(--color-hike)' },
  { activity: 'other', sessions: 6, fill: 'var(--color-other)' },
]

const chartConfig = {
  sessions: { label: 'Sessions' },
  run: { label: 'Run', color: 'hsl(var(--chart-1))' },
  bike: { label: 'Bike', color: 'hsl(var(--chart-2))' },
  walk: { label: 'Walk', color: 'hsl(var(--chart-3))' },
  hike: { label: 'Hike', color: 'hsl(var(--chart-4))' },
  other: { label: 'Other', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig

export default function ChartBarMixed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Type Breakdown</CardTitle>
        <CardDescription>Total sessions or volume by type (Run / Bike / Walk / Other)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-60 md:h-80 lg:h-96'>
          <BarChart accessibilityLayer data={chartData} layout='vertical' margin={{ left: 0 }}>
            <YAxis
              dataKey='activity'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
            />
            <XAxis dataKey='sessions' type='number' hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='sessions' layout='vertical' radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 leading-none font-medium'>
          {generateTrendMessage()} <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total sessions for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

