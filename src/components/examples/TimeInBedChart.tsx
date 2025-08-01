'use client'

import {
  ChartContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  ReferenceLine,
  ChartTooltip
} from '@/components/ui/chart'
import ChartCard from '@/components/dashboard/ChartCard'
import type { ChartConfig } from '@/components/ui/chart'

const data = [
  { date: '2025-07-01', hours: 7 },
  { date: '2025-07-02', hours: 6 },
  { date: '2025-07-03', hours: 8 },
]

const chartConfig = {
  hours: { label: 'Hours', color: 'hsl(var(--chart-1))' },
  goal: { label: 'Goal', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig

export default function TimeInBedChart() {
  return (
    <ChartCard title="Time in Bed">
      <ChartContainer config={chartConfig} className="h-48">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" hide />
          <ReferenceLine y={8} stroke={chartConfig.goal.color} strokeDasharray="4 4" />
          <ChartTooltip />
          <Bar dataKey="hours" fill="var(--color-hours)" radius={2} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
