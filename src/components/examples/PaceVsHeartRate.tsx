'use client'

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
} from '@/components/ui/card'
import { useRunningStats } from '@/hooks/useRunningStats'
import { Skeleton } from '@/components/ui/skeleton'

const chartConfig = {
  pace: { label: 'Pace', color: 'hsl(var(--chart-9))' },
  heartRate: { label: 'Heart Rate', color: 'hsl(var(--chart-10))' },
} as const

export default function PaceVsHeartRate() {
  const stats = useRunningStats()

  if (!stats) return <Skeleton className='h-64' />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pace vs Heart Rate</CardTitle>
        <CardDescription>Recent workouts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-64'>
          <ScatterChart>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='pace' name='Pace (min/mi)' />
            <YAxis dataKey='heartRate' name='Heart Rate (bpm)' />
            <ChartTooltip />
            <Scatter data={stats.paceVsHeart} fill='var(--chart-9)' />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
