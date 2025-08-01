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
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A horizontal bar chart'

// Distance buckets showing how often different session lengths occur
const chartData = [
  { bucket: '0-3', count: 4 },
  { bucket: '3-6', count: 10 },
  { bucket: '6-9', count: 8 },
  { bucket: '9-12', count: 5 },
  { bucket: '12+', count: 2 },
]

const chartConfig = {
  count: {
    label: 'Sessions',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function ChartBarHorizontal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distance Frequency</CardTitle>
        <CardDescription>Distribution of run/bike session distances (e.g., how often you do short vs long efforts)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-60'>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{ left: -20 }}
          >
            <XAxis type='number' dataKey='count' hide />
            <YAxis
              dataKey='bucket'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='count' fill='var(--color-miles)' radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 leading-none font-medium'>
          {generateTrendMessage()} <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

