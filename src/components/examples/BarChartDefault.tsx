'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

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

export const description = 'A bar chart'

// Mock monthly mileage totals so the chart resembles fitness data
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

export default function ChartBarDefault() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Distance Comparison</CardTitle>
        <CardDescription>Total mileage per month (January – June 2024)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-60'>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='miles' fill='var(--color-miles)' radius={8} />
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

