'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

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

export const description = 'A bar chart with a custom label'

// Mock monthly mileage split by activity type
const chartData = [
  { month: 'January', run: 60, bike: 40 },
  { month: 'February', run: 70, bike: 50 },
  { month: 'March', run: 55, bike: 65 },
  { month: 'April', run: 80, bike: 80 },
  { month: 'May', run: 90, bike: 85 },
  { month: 'June', run: 75, bike: 65 },
]

const chartConfig = {
  run: { label: 'Run', color: 'hsl(var(--chart-1))' },
  bike: { label: 'Bike', color: 'hsl(var(--chart-2))' },
  label: { color: 'hsl(var(--background))' },
} satisfies ChartConfig

export default function ChartBarLabelCustom() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location / Segment Breakdown</CardTitle>
        <CardDescription>Mileage or sessions per custom category (e.g., favorite routes, segments, or surfaces)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-60 md:h-80 lg:h-96'>
          <BarChart accessibilityLayer data={chartData} layout='vertical' margin={{ right: 16 }}>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey='month'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey='run' type='number' hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='line' />} />
            <Bar dataKey='run' layout='vertical' fill='var(--color-run)' radius={4}>
              <LabelList dataKey='month' position='insideLeft' offset={8} className='fill-[var(--color-label)]' fontSize={12} />
              <LabelList dataKey='run' position='right' offset={8} className='fill-foreground' fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 leading-none font-medium'>
          {generateTrendMessage()} <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing run mileage for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

