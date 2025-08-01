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

export const description = 'A shoe usage bar chart'

const chartData = [
  { model: 'Pegasus 40', miles: 120 },
  { model: 'Alphafly 2', miles: 95 },
  { model: 'Invincible 3', miles: 75 },
  { model: 'Zoom Fly 5', miles: 60 },
]

const chartConfig = {
  miles: { label: 'Miles', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig

export default function ShoeUsageChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shoe Usage</CardTitle>
        <CardDescription>Miles logged per shoe model (wear tracking)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-60'>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='model' tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='miles' fill='var(--color-miles)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex gap-2 text-sm'>
        Trending up <TrendingUp className='h-4 w-4' />
      </CardFooter>
    </Card>
  )
}
