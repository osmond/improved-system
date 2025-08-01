'use client'

import { TrendingUp } from 'lucide-react'
import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from '@/components/ui/chart'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

const scatterData = Array.from({ length: 200 }, () => ({
  pace: 6 + Math.random() * 2,
  hr: 120 + Math.random() * 40,
}))

const chartConfig = {
  pace: { label: 'Pace', color: 'hsl(var(--chart-9))' },
  hr: { label: 'Heart Rate', color: 'hsl(var(--chart-10))' },
} as const

export default function ScatterChartPaceHeartRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pace vs Heart Rate</CardTitle>
        <CardDescription>Correlation of effort and speed from recent runs</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-64'>
          <ScatterChart>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='pace' name='Pace (min/mi)' />
            <YAxis dataKey='hr' name='Heart Rate (bpm)' />
            <ChartTooltip />
            <Scatter data={scatterData} fill='var(--color-pace)' />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex items-center gap-2 text-sm'>
        Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
      </CardFooter>
    </Card>
  )
}
