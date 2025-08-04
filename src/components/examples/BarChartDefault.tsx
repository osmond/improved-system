'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

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
        <ChartContainer config={chartConfig} className='h-60 md:h-80 lg:h-96'>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={1}
              tickFormatter={(value) => {
                const date = new Date(`${value} 1, 2024`)
                return (
                  date.toLocaleString('en-US', { month: 'short' }) +
                  " '" +
                  date.toLocaleString('en-US', { year: '2-digit' })
                )
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='miles' fill='var(--color-miles)' radius={8} />
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

