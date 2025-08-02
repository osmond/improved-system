'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
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

export const description = 'A radar chart with dots'

// Mock mileage data by month
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

export default function ChartRadarDots() {
  return (
    <Card>
      <CardHeader className='items-center'>
        <CardTitle>Monthly Mileage Pattern</CardTitle>
        <CardDescription>Mileage consistency and variation by month over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className='pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px] md:max-h-[300px] lg:max-h-[350px]'>
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey='month' />
            <PolarGrid />
            <Radar dataKey='miles' fill='var(--color-miles)' fillOpacity={0.6} dot={{ r: 4, fillOpacity: 1 }} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {generateTrendMessage()} <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground flex items-center gap-2 leading-none'>
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}

