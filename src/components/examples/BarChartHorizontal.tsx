'use client'

import { TrendingUp } from 'lucide-react'
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

// Monthly mileage totals used as mock activity data
const chartData = [
  { month: 'January', miles: 120 },
  { month: 'February', miles: 150 },
  { month: 'March', miles: 95 },
  { month: 'April', miles: 160 },
  { month: 'May', miles: 175 },
  { month: 'June', miles: 140 },
]

const chartConfig = {
  miles: {
    label: 'Miles',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function ChartBarHorizontal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Horizontal</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-60'>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{ left: -20 }}
          >
            <XAxis type='number' dataKey='miles' hide />
            <YAxis
              dataKey='month'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='miles' fill='var(--color-miles)' radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 leading-none font-medium'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

